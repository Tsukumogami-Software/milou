import path from 'upath'
import chalk from 'chalk'
import { Command } from 'commander'
import * as presskit from '../lib/index.js'
import version from '../lib/helpers/version.js'

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<entry point>')

const description = 'Generate a presskit based on information found in `data.yml` files.'

const program = new Command()

program
  .version(version)
  .description(description)
  .usage(usage)
  .option(
    '-o, --output [destination]', 'output the build folder to the [destination] (defaults to ./build)',
    path.join(process.cwd(), 'build')
  )
  .option('-w, --watch', 'watch project for changes and re-generate if needed')
  .option('-d, --dev', 'add monitoring of CSS and templates in watch mode')
  .option('-p, --port [8080]', 'set the server port to [8080]', 8080)
  .option('-D, --clean-build-folder', 'delete the build folder beforehand')
  .option('-T, --ignore-thumbnails', 'use original images in galleries instead of thumbnails (will increase pages size)')
  .parse(process.argv)

presskit.runBuildCommand({
  entryPoint: program.args[0],
  cleanBuildFolder: program.opts().cleanBuildFolder,
  ignoreThumbnails: program.opts().ignoreThumbnails,
  output: program.opts().output,
  watch: program.opts().watch,
  port: program.opts().port,
  dev: program.opts().dev
})
