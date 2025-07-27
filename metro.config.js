const { getDefaultConfig } = require('expo/metro-config');

let config = getDefaultConfig(__dirname);

// Enable require context for Storybook
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
};

// Only apply Storybook modifications when needed
if (process.env.STORYBOOK_ENABLED === 'true') {
  try {
    const withStorybook = require('@storybook/react-native/metro/withStorybook');
    config = withStorybook(config, {
      configPath: './.storybook',
    });
  } catch (error) {
    console.warn('Storybook metro config failed:', error.message);
  }
}

module.exports = config;
