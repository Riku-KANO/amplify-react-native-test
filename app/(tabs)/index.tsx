import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Schema['chat']['type'] | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const client = generateClient<Schema>();

  const initializeConversation = useCallback(async () => {
    try {
      const { data: chat } = await client.conversations.chat.create({
        name: 'AI Chat Session',
      });
      setConversation(chat);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
    }
  }, [client]);

  useEffect(() => {
    // Initialize conversation
    initializeConversation();
  }, [initializeConversation]);

  const handleSendMessage = async (content: string) => {
    if (!conversation) {
      console.error('No conversation initialized');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to AI
      await conversation.sendMessage({
        content: [{ text: content }],
      });

      // Subscribe to streaming response
      const subscription = conversation.onStreamEvent({
        next: (event: unknown) => {
          if (
            typeof event === 'object' &&
            event &&
            'type' in event &&
            event.type === 'contentBlock' &&
            'contentBlock' in event &&
            event.contentBlock &&
            typeof event.contentBlock === 'object' &&
            'text' in event.contentBlock
          ) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: String(event.contentBlock.text),
              role: 'assistant',
              timestamp: new Date(),
            };
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'assistant') {
                // Update existing assistant message
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    content: lastMessage.content + String(event.contentBlock.text),
                  },
                ];
              } else {
                // Add new assistant message
                return [...prev, aiMessage];
              }
            });
          }
        },
        error: (error: unknown) => {
          console.error('Streaming error:', error);
          setIsLoading(false);
        },
        complete: () => {
          setIsLoading(false);
          // Scroll to bottom
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
      });

      // Clean up subscription when component unmounts
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Assistant</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation with AI Assistant</Text>
          </View>
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
});
