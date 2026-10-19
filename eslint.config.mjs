import nextVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextVitals,
  { ignores: ['coverage/**'] },
  {
    rules: {
      'react/display-name': 'warn',
      // Surface existing compiler-readiness findings while the compiler is disabled.
      // Keep the existing rules-of-hooks and exhaustive-deps checks enabled.
      'react-hooks/globals': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/use-memo': 'warn',
    },
  },
];
