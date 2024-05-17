'use strict'

import path from 'upath'
import chalk from 'chalk'
import { Command } from 'commander'
import * as presskit from '../lib/index.js'
import version from '../lib/helpers/version.js'

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<entry point>')

const description = `Generate a presskit based on information found in \`data.xml\` files. The format and the ouput are (nearly) the same as ${chalk.blue('http://dopresskit.com/')}. However, this command will generate static HTML files.

  More information on ${chalk.blue('https://github.com/pixelnest/presskit.html#usage')}.`

const program = new Command()

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

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
  .option('-L, --pretty-links', 'hide index.html at the end of links')
  .option('-M, --collapse-menu', 'use a collapsed menu (hamburger) on small screens')
  .option('-B, --base-url [base]', 'prefix absolute urls with [base] (if your presskit is not at the root of your server)', '/')
  .option('-T, --ignore-thumbnails', 'use original images in galleries instead of thumbnails (will increase pages size)')
  .parse(process.argv)

presskit.runBuildCommand({
  entryPoint: program.args[0],
  cleanBuildFolder: program.opts().cleanBuildFolder,
  ignoreThumbnails: program.opts().ignoreThumbnails,
  prettyLinks: program.opts().prettyLinks,
  baseUrl: program.opts().baseUrl,
  hamburger: program.opts().collapseMenu,
  output: program.opts().output,
  watch: program.opts().watch,
  port: program.opts().port,
  dev: program.opts().dev
})
