module.exports = {
    env: {
        node: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        project: ['./tsconfig.json']
    }
}
