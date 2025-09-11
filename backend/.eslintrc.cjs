module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console.log for backend logging
  },
  overrides: [
    {
      files: ['src/controllers/*.js'],
      plugins: ['jsdoc'],
      rules: {
        // JSDoc validation rules - only for controllers
        'jsdoc/check-access': 'warn',
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-examples': 'off',
        'jsdoc/check-param-names': 'error',
        'jsdoc/check-property-names': 'error',
        'jsdoc/check-syntax': 'error',
        'jsdoc/check-tag-names': 'error',
        'jsdoc/check-types': 'error',
        'jsdoc/check-values': 'error',
        'jsdoc/empty-tags': 'error',
        'jsdoc/multiline-blocks': 'error',
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-blank-block-descriptions': 'error',
        'jsdoc/no-blank-blocks': 'error',
        'jsdoc/no-undefined-types': 'error',
        'jsdoc/require-asterisk-prefix': 'error',
        'jsdoc/require-description': 'error',
        'jsdoc/require-example': [
          'warn',
          {
            exemptedBy: ['type'],
            contexts: [
              'MethodDefinition[key.name=/^(bulkUpdatePositions|getPlayerDashboard|createGameSession)$/]' // Require examples for complex methods only
            ]
          }
        ],
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
            require: {
              ClassDeclaration: true,
              MethodDefinition: true
            },
            contexts: [
              'ClassDeclaration',
              'MethodDefinition:not([key.name=/^constructor$/])'
            ]
          }
        ],
        'jsdoc/require-param': [
          'error',
          {
            checkConstructors: false,
            checkGetters: false,
            checkSetters: false,
            exemptedBy: ['type']
          }
        ],
        'jsdoc/require-param-description': 'error',
        'jsdoc/require-param-name': 'error',
        'jsdoc/require-param-type': 'error',
        'jsdoc/require-returns': [
          'error',
          {
            checkGetters: false,
            exemptedBy: ['type']
          }
        ],
        'jsdoc/require-returns-check': 'error',
        'jsdoc/require-returns-description': 'error',
        'jsdoc/require-returns-type': 'error',
        'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
        'jsdoc/valid-types': 'error'
      },
      settings: {
        jsdoc: {
          mode: 'typescript',
          preferredTypes: {
            object: 'Object',
            'object.': 'Object',
            'Object.<>': 'Object',
            'object<>': 'Object'
          },
          tagNamePreference: {
            returns: 'returns',
            yield: 'yields'
          }
        }
      }
    }
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', 'docs/'],
};
