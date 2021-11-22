const path = require('path')

module.exports = {
  buildServer: {
    port: 8000,
  },
  buildFolder: 'build',
  loaderRuntime: path.join(__dirname, 'src/loaderRuntime.ts'),
  experiments: {
    esbuildDependencies: true,
    esmExternals: true,
  },
}
