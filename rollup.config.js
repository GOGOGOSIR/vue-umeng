import path from 'path'
import ts from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const pkg = require(path.resolve(__dirname, 'package.json'))

function getAuthors(pkg) {
  const { contributors, author } = pkg

  const authors = new Set()
  if (contributors && contributors) {
    contributors.forEach((contributor) => {
      authors.add(contributor.name)
    })
  }
  if (author) authors.add(author.name)

  return Array.from(authors).join(', ')
}

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${getAuthors(pkg)}
  * @license MIT
  */`

let hasTSChecked = false

const outputConfigs = {
  mjs: {
    file: pkg.module,
    format: 'es'
  },
  cjs: {
    file: pkg.module.replace('mjs', 'cjs'),
    format: 'cjs'
  },
  global: {
    file: pkg.unpkg,
    format: 'iife'
  }
}

const packageBuilds = Object.keys(outputConfigs)
const packageConfigs = packageBuilds.map((format) => {
  if (format === 'global')
    return createMinifiedConfig(format)
  else
    return createConfig(format, outputConfigs[format])
})

export default packageConfigs

function createConfig(buildName, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${buildName}"`))
    process.exit(1)
  }

  // output.exports = 'named'
  output.sourcemap = false
  output.banner = banner
  output.externalLiveBindings = false
  output.globals = {
    'vue-router': 'VueRouter',
    vue: 'Vue'
  }

  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, './tsconfig.json'),
    cacheRoot: path.resolve(__dirname, './node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      // TODO: add test
      exclude: ['src/*/__tests__', 'src/*/test-dts']
    }
  })

  hasTSChecked = true

  const external = ['vue-router', 'vue']

  const nodePlugins = [resolve(), commonjs()]

  return {
    input: 'src/index.ts',
    external,
    plugins: [tsPlugin, ...nodePlugins, ...plugins],
    output
  }
}

function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: 'dist/index.min.js',
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
          pure_funcs: ['console.log']
        }
      })
    ]
  )
}
