#!/usr/bin/env node

const commands: { [command: string]: () => Promise<void> } = {
  build: async () => await import('../scripts/build').then(i => i.default()),
  start: async () => await import('../src/start').then(i => i.default()),
  dev: async () => await import('../src/start-dev').then(i => i.default()),
}

const command = process.argv[2]

const hasCommand = Boolean(commands[command])

if (!hasCommand) {
  // @ts-ignore
  const formatter = new Intl.ListFormat('en-GB')

  const availableCommands = formatter.format(Object.keys(commands))

  console.error(
    `Unkown command '${command}'. Available ones are ${availableCommands}.`
  )
  process.exit(0)
}

const defaultEnv = command === 'dev' ? 'development' : 'production'
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv

commands[command]()
