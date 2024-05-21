import * as fs from 'fs'
import chalk from 'chalk'

import * as console from '../helpers/color-console.js'
import * as sfs from '../helpers/sfs.js'

import { createTemplate } from './template.js'
import config from '../config.js'
import { imagesFolderName } from '../assets.js'
import path from 'upath'
import packageVersion from '../helpers/version.js'
import exportArchives from './archives.js'
import { createAndGetBuildFolder, getPageFolder, getHtmlFilePath } from './folders.js'
import { createThumbnails, getImagesFolder, getImages, sortScreenshotsByCategories } from './images.js'

export async function build (dataFilePath, presskit, {
  company = {},
  products = []
} = {}) {
  const buildFolder = createAndGetBuildFolder()
  const pageFolder = getPageFolder(buildFolder, dataFilePath, presskit.type)

  // Create the page folder.
  sfs.createDir(pageFolder)

  const htmlFilePath = getHtmlFilePath(pageFolder)
  console.log(`- "${presskit.title}" -> ${chalk.blue(htmlFilePath)}`)

  // Templates and images.
  const template = createTemplate(presskit.type, pageFolder)
  const assetsSource = getImagesFolder(dataFilePath)
  const images = getImages(assetsSource)

  // Copy images and zips to the page folder.
  const assetsTarget = path.join(pageFolder, imagesFolderName)
  sfs.copyDirContent(assetsSource, assetsTarget)

  // Add thumbnails on the screenshot images.
  // Because the thumbnails are not in the `images` object, they won't
  // be added to the zips. Neat.
  if (!config.commands.build.ignoreThumbnails) {
    await createThumbnails(assetsTarget, images.screenshots)
  }

  // This must be done after `sfs.copyDirContent`.
  // Otherwise, we might override existing archives.
  exportArchives(images, assetsSource, assetsTarget)

  // Apply data to template.
  const html = template({
    presskit,
    company,
    products,
    images: sortScreenshotsByCategories(images),
    assets: (presskit.type !== 'company' ? '..' : '.'),

    // Handlebars can't check for equality, so we provide two
    // variables to differentiate a product and a company sheet.
    isCompany: presskit.type === 'company',
    isProduct: presskit.type === 'product',

    // Same to know if a presskit has any screenshots.
    hasScreenshots: images.screenshots && images.screenshots.length > 0,

    // Misc.
    buildVersion: packageVersion,
    buildTime: new Date().getTime()
  })

  // Export the HTML to a file.
  fs.writeFileSync(htmlFilePath, html)

  // And return the relative path from `build/`.
  return path.relative(buildFolder, htmlFilePath)
}
