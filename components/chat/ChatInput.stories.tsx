import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
// Note: action import temporarily removed - using function placeholders for now
import ChatInput from './ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'Chat/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#F2F2F7' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    onSendMessage: { action: 'message sent' },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSendMessage: (message: string) => console.warn('Message sent:', message),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    onSendMessage: (message: string) => console.warn('Message sent:', message),
    disabled: true,
  },
};
