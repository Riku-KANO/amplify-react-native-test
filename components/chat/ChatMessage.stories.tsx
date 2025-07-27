import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import ChatMessage from './ChatMessage';

const meta: Meta<typeof ChatMessage> = {
  title: 'Chat/ChatMessage',
  component: ChatMessage,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: '#F2F2F7' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    message: {
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    message: {
      id: '1',
      content: 'Hello! How are you doing today?',
      role: 'user',
      timestamp: new Date(),
    },
  },
};

export const AssistantMessage: Story = {
  args: {
    message: {
      id: '2',
      content: "I'm doing well, thank you! How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  },
};

export const LongUserMessage: Story = {
  args: {
    message: {
      id: '3',
      content:
        'This is a really long message to test how the chat bubble handles longer text content. It should wrap properly and maintain good readability.',
      role: 'user',
      timestamp: new Date(),
    },
  },
};

export const LongAssistantMessage: Story = {
  args: {
    message: {
      id: '4',
      content:
        'This is a comprehensive response from the AI assistant. It includes multiple sentences and demonstrates how longer responses are displayed in the chat interface. The text should wrap nicely within the bubble and maintain proper spacing.',
      role: 'assistant',
      timestamp: new Date(),
    },
  },
};
