import * as fs from 'fs'
import chalk from 'chalk'
import sharp from 'sharp'
import path from 'upath'

import * as sfs from '../helpers/sfs.js'
import { imagesFolderName, authorizedImageFormats } from '../assets.js'

// Get the folder containing the images.
export function getImagesFolder (dataFile) {
  const stat = fs.statSync(dataFile)
  const dataFileFolder = stat.isFile() ? path.dirname(dataFile) : dataFile

  return path.join(dataFileFolder, imagesFolderName)
}

// Get the images in the source, and sort them by types.
// We are interested in three types of images:
// - the header, starting with 'header'.
// - the logos, starting with 'logo'.
// - And the rest (what we call "screenshots").
export function getImages (source) {
  if (!fs.existsSync(source)) {
    console.error(`No images found for "${source}"`, '🤔')
    return
  }

  const images = { header: null, screenshots: [], logos: [] }

  sfs.findAllFiles(source)
    .forEach(filePathWithSource => {
      // Remove 'path/to/images' from 'path/to/images/filename'.
      // ie, 'data/product/images/burger01.png' becomes 'burger01.png'.
      // This is super important. We only need this portion for:
      // - the comparison below
      // - the url on the site
      // - the copy to the built presskit
      const f = path.relative(source, filePathWithSource)

      // Authorize only these formats.
      const ext = path.extname(f)
      if (!authorizedImageFormats.includes(ext)) return

      // Ignore favicon.
      if (f.toLowerCase() === 'favicon.ico') return

      // And put in the correct category.
      if (f.toLowerCase().startsWith('header')) {
        images.header = f
      } else if (f.toLowerCase().startsWith('logo')) {
        images.logos.push(f)
      } else {
        images.screenshots.push(f)
      }
    })

  return images
}

// This function takes a list of images and separate the images which are
// in a folder into separate categories.
//
// **Pure function.**
//
//   Example:
//     - burger01.png
//     - gifs/burger02.png
//     - wallpapers/burger03.png
//     - wallpapers/burger04.png
//   → {
//     ...
//     screenshots: ['burger01.png']
//     screenshotsWithCategory: {
//       gifs: {title: 'gifs', elements: ['gifs/burger02.png']}
//       wallpapers: {title: 'gifs', elements: ['wallpapers/burger03.png', 'wallpapers/burger04.png']}
//     }
//     ...
//   }
export function sortScreenshotsByCategories (images) {
  const clone = { ...images }

  // Abort early if no screenshots.
  const screenshots = clone.screenshots
  if (!screenshots) return clone

  // We put category-less screenshots first. This is important.
  const result = []
  const withCategories = {}

  for (const i of screenshots) {
    // We get the category from the dirname.
    const category = path.dirname(i)

    // Separate the screenshots which are at the root of the images folder.
    // They must be first, so we store them in another array.
    if (category === '.') {
      result.push(i)
    } else {
      // Create a new category first.
      if (!withCategories[category]) {
        withCategories[category] = {}
        withCategories[category].title = category
        withCategories[category].elements = []
      }

      withCategories[category].elements.push(i)
    }
  }

  clone.screenshots = result
  clone.screenshotsWithCategory = withCategories
  return clone
}

// Create thumbnails.
// For each provided images, generate a low-res jpg thumbnail.
// Even for gif.
//
// We don't check if the format of the images is valid,
// since the check is already done when constructing the images object.
export async function createThumbnails (target, images) {
  for (const x of images) {
    const imagePath = path.join(target, x)
    const thumbPath = path.join(target, `${x}.thumb.jpg`)

    try {
      // Background and flatten are for transparent PNGs/Gifs.
      // We force a white background here.

      await sharp(imagePath)
        .resize(450)
        .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .jpeg()
        .toFile(thumbPath)
    } catch (e) {
      const msg = chalk.dim(`(${e.message})`)
      console.warn(`The '${chalk.bold(x)}' thumbnail has not been generated. ${msg}`)
    }
  }
}
