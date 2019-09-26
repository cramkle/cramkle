import { Compiler, Plugin } from 'webpack'

export default class WatchMissingNodeModulesPlugin implements Plugin {
  private nodeModulesPath: string

  public constructor(nodeModulesPath: string) {
    this.nodeModulesPath = nodeModulesPath
  }

  public apply(compiler: Compiler) {
    compiler.hooks.emit.tap('WatchMissingNodeModulesPlugin', compilation => {
      const missingDeps = Array.from(compilation.missingDependencies)
      const nodeModulesPath = this.nodeModulesPath

      // If any missing files are expected to appear in node_modules...
      if (missingDeps.some(file => file.includes(nodeModulesPath))) {
        // ...tell webpack to watch node_modules recursively until they appear.
        compilation.contextDependencies.add(nodeModulesPath)
      }
    })
  }
}
