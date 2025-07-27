import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Conversation route with AI
  chat: a
    .conversation({
      aiModel: a.ai.model('Claude 3 Haiku'),
      systemPrompt: 'You are a helpful AI assistant. Be concise and friendly.',
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
