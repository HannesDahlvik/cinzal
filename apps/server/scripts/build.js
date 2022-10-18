import { execa } from 'execa'
import path from 'path'
import fse from 'fs-extra'

async function main() {
    await removeOldBuild()

    try {
        const tscBuild = execa('tsc', ['--build'])
        tscBuild.on('close', () => {
            createPackageJson()
        })
    } catch (err) {
        throw err
    }
}

async function removeOldBuild() {
    const buildDirPath = path.resolve('build')

    fse.remove(buildDirPath, (err) => {
        if (err) throw err
        else return
    })
}

async function createPackageJson() {
    const packageJSONPath = path.resolve('package.json')
    const packageJSON = await fse.readJSON(packageJSONPath).catch((err) => {
        throw err
    })

    const buildPackageJSONPath = path.resolve('build', 'package.json')
    const prismaVersion = packageJSON.devDependencies.prisma

    const newPackage = {
        name: packageJSON.name,
        version: packageJSON.version,
        main: 'src/server.js',
        scripts: {
            start: 'node src/server.js',
            'db:pull': 'prisma db pull',
            'db:push': 'prisma db push'
        },
        dependencies: packageJSON.dependencies,
        devDependencies: {
            prisma: prismaVersion
        }
    }
    fse.appendFile(buildPackageJSONPath, JSON.stringify(newPackage))
        .then(() => {
            createEnvFile()
        })
        .catch((err) => {
            throw err
        })
}

async function createEnvFile() {
    const filePath = path.resolve('.env')
    const buildFilePath = path.resolve('build', '.env')

    fse.copyFile(filePath, buildFilePath)
        .then(() => {
            copyPrismaDir()
        })
        .catch((err) => {
            throw err
        })
}

function copyPrismaDir() {
    const prismaFolderPath = path.resolve('prisma')
    const buildPrismaFolderPath = path.resolve('build', 'prisma')

    fse.copy(prismaFolderPath, buildPrismaFolderPath)
        .then(() => {
            return
        })
        .catch((err) => {
            throw err
        })
}

main()
