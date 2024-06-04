import chalk from 'chalk'
import { Command } from 'commander'
import * as presskit from '../lib/index.js'
import version from '../lib/helpers/version.js'

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<destination>')

const description = `Create an empty \`data.yml\` file and its \`images/\` folder in the <destination> folder (current working directory by default).

  There are two template types available: ${chalk.blue('company')} (default) or ${chalk.blue('product')}.`

const program = new Command()

program
  .version(version)
  .description(description)
  .usage(usage)
  .option('-t, --type [company]', 'set the type of the new `data.yml` file', 'company')
  .parse(process.argv)

presskit.runNewCommand(program.opts().type, program.args[0] || process.cwd())
