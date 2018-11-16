const chalk = require('chalk')

const info = (module, ...args) => {
  console.log(`${chalk.green(module)}:`, ...args)
}

const warn = (module, ...args) => {
  console.log(`${chalk.yellow(module)}:`, ...args)
}

const err = (module, ...args) => {
  console.log(`${chalk.red(module)}`, ...args)
}

module.exports = {
  info,
  warn,
  err,
}
