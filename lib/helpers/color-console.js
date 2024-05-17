import chalk from 'chalk'

export function colorize (colorizer, args) {
  return Array.from(args).map(el => colorizer(el))
}

export function error () {
  console.error.apply(null, colorize(chalk.red, arguments))
}

export function warn () {
  console.warn.apply(null, colorize(chalk.yellow, arguments))
}

export function log () {
  console.log.apply(null, colorize(chalk.blue, arguments))
}
