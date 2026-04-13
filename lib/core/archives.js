import * as fs from 'fs'
import chalk from 'chalk'
import path from 'upath'
import zip, { s3zip } from '../helpers/zip.js'
import config from '../config.js'

// Export archives for screenshots and logos.
async function exportArchives (images, source, target) {
  if (!images) return

  if (!config.commands.build.zip) return

  const s3Bucket = config.commands.build.s3Bucket
  if (s3Bucket) {
    await createS3Archive('images.zip', target, source, images.screenshots, s3Bucket)
    await createS3Archive('logo.zip', target, source, images.logos, s3Bucket)
  } else {
    createArchive('images.zip', target, source, images.screenshots)
    createArchive('logo.zip', target, source, images.logos)
  }
}

async function createS3Archive (name, target, source, files, s3Bucket) {
  if (!files || files.length === 0) return

  return await s3zip(name, target, source, files, s3Bucket)
}

export default exportArchives
