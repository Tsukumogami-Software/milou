import * as fs from 'fs'
import chalk from 'chalk'
import path from 'upath'
import zip, { s3zip } from '../helpers/zip.js'
import { config } from 'process'

// Export archives for screenshots and logos.
async function exportArchives (images, source, target) {
  if (!images) return

  if (config.commands.build.s3bucket) {
    await createS3Archive('images.zip', target, source, images.screenshots, config.commands.build.s3bucket)
    await createS3Archive('logo.zip', target, source, images.logos, config.commands.build.s3bucket)
  } else {
    createArchive('images.zip', target, source, images.screenshots)
    createArchive('logo.zip', target, source, images.logos)
  }
}

function createArchive (name, target, source, files) {
  if (!files || files.length == 0) return

  // Do not override an existing archive.
  if (fs.existsSync(path.join(source, name))) {
    console.warn(`An existing archive named ${chalk.blue(name)} has been found in the assets. Keeping it…`)
    return
  }

  zip(name, target, source, files)
}

async function createS3Archive (name, target, source, files, s3bucket) {
  if (!files || files.length == 0) return

  await s3zip(name, target, source, files)
}

export default exportArchives
