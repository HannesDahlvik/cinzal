module.exports = {
    ...require('@cz/config/server-eslint'),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    }
}
