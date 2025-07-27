# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native AI chatbot application built with:

- **Expo** (managed workflow, not using Expo Go due to Amplify Gen2)
- **AWS Amplify Gen2** for backend services
- **Authentication features**: Passkeys, MFA, and various auth methods
- **Storybook** for UI component development and testing

## Key Commands

### Development

```bash
# Install dependencies
npm install

# Start development server (custom dev client required for Amplify)
npx expo start --dev-client

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Build development client
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Storybook

```bash
# Start Storybook server
npm run storybook

# Start Storybook for React Native
npm run storybook:native
```

### Amplify Gen2

```bash
# Start Amplify sandbox for local development
npx ampx sandbox

# Deploy to AWS
npx ampx pipeline-deploy --branch main --app-id <app-id>

# Generate client configuration
npx ampx generate outputs --app-id <app-id> --branch main
```

### Testing & Quality

```bash
# Run tests with Vitest
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code with Prettier
npx prettier --write .
```

## Architecture Overview

### Directory Structure

```
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout with auth provider
├── components/            # Shared React Native components
│   ├── chat/             # Chat-related components
│   └── auth/             # Authentication components
├── amplify/              # Amplify Gen2 backend
│   ├── auth/             # Authentication configuration
│   ├── data/             # GraphQL schema and resolvers
│   ├── functions/        # Lambda functions
│   └── backend.ts        # Backend configuration
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── constants/            # App constants
└── .storybook/          # Storybook configuration
```

### Key Technical Decisions

1. **Amplify Gen2 Integration**: Uses the new Amplify Gen2 architecture which requires custom development clients (not compatible with Expo Go)

2. **Authentication Strategy**:
   - Implements AWS Cognito with support for:
     - Passkeys (WebAuthn)
     - Multi-factor authentication (MFA)
     - Social sign-in providers
   - Auth state managed via React Context

3. **AI Chatbot Architecture**:
   - Uses AWS Bedrock or OpenAI via Lambda functions
   - Real-time chat updates via GraphQL subscriptions
   - Message history stored in DynamoDB

4. **Component Development**:
   - Storybook for isolated component development
   - Components follow atomic design principles
   - TypeScript for type safety

## Development Workflow

1. **Setting up a new feature**:
   - Create components in isolation with Storybook
   - Implement backend logic in `amplify/` directory
   - Connect frontend and backend via generated GraphQL client

2. **Authentication flows**:
   - All auth logic centralized in `app/(auth)/` screens
   - Use Amplify UI components where applicable
   - Custom UI components in `components/auth/`

3. **Testing approach**:
   - Unit tests for utilities and hooks
   - Component tests with React Native Testing Library
   - E2E tests with Detox (if configured)

## Important Notes

- Always run `npx ampx sandbox` before starting development to ensure backend is available
- Use `eas build` for creating development builds when Amplify dependencies change
- Environment variables are managed through Amplify Gen2's environment system
- GraphQL operations are auto-generated - run `npx ampx generate graphql-client-code` after schema changes
