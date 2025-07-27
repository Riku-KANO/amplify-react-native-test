import { a } from '@aws-amplify/backend';

// AI conversation route
export const conversationRoute = a.conversation({
  aiModel: a.ai.model('Claude 3 Haiku'),
  systemPrompt: 'You are a helpful AI assistant.',
});
