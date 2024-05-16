'use strict'

import * as chalk from "chalk"

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

export function colorize (colorizer, args) {
  return Array.from(args).map(el => colorizer(el))
}

export function error () {
  console.error.apply(null, colorize(chalk.red, arguments))
}

export function warn () {
  console.warn.apply(null, colorize(chalk.yellow, arguments))
}
