// eslint-disable-next-line import/no-unresolved
import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['tests/**'],
      rules: {
        'import/no-nodejs-modules': 'off',
      },
    },
  ],
  ignores: ['coverage', 'dist'],
});
