/* eslint-disable no-console */
import chalk from 'chalk'

const prefixes = {
  wait: chalk`{gray wait}:`,
  error: chalk`{red error}:`,
  warn: chalk`{yellow warn}:`,
  ready: chalk`{green ready}:`,
  info: chalk`{cyan info}:`,
}

export function wait(...message: any[]) {
  console.log(prefixes.wait, ...message)
}

export function error(...message: any[]) {
  console.log(prefixes.error, ...message)
}

export function warn(...message: any[]) {
  console.log(prefixes.warn, ...message)
}

export function info(...message: any[]) {
  console.log(prefixes.info, ...message)
}

export function ready(...message: any[]) {
  console.log(prefixes.ready, ...message)
}
