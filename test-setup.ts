import React from 'react';

// Mock React Native modules
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Mock Expo modules
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  Link: ({ children }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
    children,
  Stack: ({ children }: { children: React.ReactNode }) => children,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
  Redirect: () => null,
}));

vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

vi.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock AWS Amplify
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    conversations: {
      chat: {
        create: vi.fn(),
      },
    },
  })),
}));

vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
}));
