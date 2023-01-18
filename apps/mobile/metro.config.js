const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const config = getDefaultConfig(projectRoot)

module.exports = {
    ...config,
    watchFolders: [workspaceRoot],
    resolver: {
        ...config.resolver,
        disableHierarchicalLookup: true,
        nodeModulesPaths: [
            path.resolve(projectRoot, 'node_modules'),
            path.resolve(workspaceRoot, 'node_modules')
        ],
        sourceExts: [...config.resolver.sourceExts, 'cjs']
    }
}
