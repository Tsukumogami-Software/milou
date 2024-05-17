import * as fs from "fs"
import chalk from "chalk"
import * as path from "upath"

import * as console from "./helpers/color-console.js"
import * as generator from "./core/generator.js"
import config from "./config.js"

import * as assets from "./assets.js"
import * as sfs from "./helpers/sfs.js"

export function runBuildCommand (launchOptions) {
  config.commands.build = launchOptions

  parseEntryPoint(launchOptions.entryPoint, (err, entry) => {
    if (err) {
      console.warn('No valid entry point provided. Use current directory instead')
      console.log('')

      generator.generate(process.cwd())
      return
    }

    generator.generate(entry)
  })
}

function parseEntryPoint (entry, cb) {
  // No file provided? Just return the current working dir.
  if (!entry) {
    return cb(null, process.cwd())
  }

  // Check if the entry is valid.
  // And ensure that we use a directory.
  fs.stat(entry, (err, stat) => {
    if (err) {
      return cb(new Error('Not a file'))
    }

    if (stat.isDirectory()) {
      cb(null, entry)
    } else if (stat.isFile()) {
      cb(null, path.dirname(entry))
    } else {
      cb(new Error('Not a directory or file'))
    }
  })
}

export function runNewCommand (type, destination) {
  if (type !== 'company' && type !== 'product') {
    console.error('Unknow type. Expected "company" or "product"')
    return
  }

  const isProduct = (type === 'product')
  const source = (isProduct ? assets.productTemplate : assets.companyTemplate)

  let targetDir = destination

  // Create subfolder for product.
  if (isProduct) {
    targetDir = path.join(destination, 'product')
    sfs.createDir(targetDir)
  }

  const target = path.join(targetDir, 'data.xml')

  // Copy files from examples to target directory.
  fs.writeFileSync(target, fs.readFileSync(source))

  // Create images folder.
  sfs.createDir(path.join(targetDir, 'images'))

  console.log(`Creating new ${type} template: ${chalk.blue(target)}`)
  console.log('')
  console.log('Done! 👌')
}
