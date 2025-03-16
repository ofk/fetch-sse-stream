// eslint-disable-next-line import/default
import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['tests/**'],
      rules: {
        'import/no-nodejs-modules': 'off',
        'vitest/prefer-expect-assertions': 'off',
      },
    },
  ],
  ignores: ['coverage', 'dist'],
});
