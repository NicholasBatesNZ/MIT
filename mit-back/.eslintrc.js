module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    env: {
        browser: true,
        node: true,
    },
    rules: {
        'semi': 'error',
        'quotes': ['error', 'single'],
        '@typescript-eslint/no-misused-promises': [
            'error', {
                'checksVoidReturn': false
            }
        ]
    },
};