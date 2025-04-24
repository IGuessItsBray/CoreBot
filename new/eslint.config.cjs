const globals = require('globals');
const js = require('@eslint/js');

const {
    FlatCompat,
} = require('@eslint/eslintrc');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = [...compat.extends('eslint:recommended'), {
    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 'latest',
        sourceType: 'commonjs',
    },

    rules: {
        'no-fallthrough': 'off',

        'brace-style': ['warn', 'stroustrup', {
            allowSingleLine: true,
        }],

        'comma-dangle': ['warn', 'always-multiline'],
        'comma-spacing': 'warn',
        'comma-style': 'warn',
        curly: ['warn', 'multi-line', 'consistent'],
        'dot-location': ['warn', 'property'],
        'handle-callback-err': 'off',

        indent: ['warn', 4, {
            SwitchCase: 1,
        }],

        'max-nested-callbacks': ['warn', {
            max: 6,
        }],

        'max-statements-per-line': ['warn', {
            max: 2,
        }],

        'no-console': 'off',
        'no-empty-function': 'warn',
        'no-floating-decimal': 'warn',
        'no-lonely-if': 'warn',
        'no-multi-spaces': 'warn',

        'no-multiple-empty-lines': ['warn', {
            max: 2,
            maxEOF: 1,
            maxBOF: 0,
        }],

        'no-shadow': ['off', {
            allow: ['err', 'resolve', 'reject'],
        }],

        'no-trailing-spaces': ['warn'],

        'no-unused-vars': ['off', {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
        }],

        'no-var': 'warn',
        'object-curly-spacing': ['warn', 'always'],
        'prefer-const': 'warn',
        quotes: ['warn', 'single'],
        semi: ['warn', 'always'],
        'space-before-blocks': 'warn',
        'space-in-parens': 'warn',
        'space-infix-ops': 'warn',
        'space-unary-ops': 'warn',
        'spaced-comment': 'warn',
        yoda: 'warn',
    },
}];