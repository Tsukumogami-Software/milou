import path from 'upath'

import * as sfs from '../helpers/sfs.js'
import config from '../config.js'

export function createAndGetBuildFolder () {
  const destination = config.commands.build.output
  sfs.createDir(destination)

  return destination
}

export function getHtmlFilePath (pageFolder) {
  return path.join(pageFolder, 'index.html')
}

export function getPageFolder (buildFolder, dataFilePath, pageType) {
  // Logic:
  // - Company page should be placed in the root folder.
  // - But each product page is a subfolder.

  // If it's not a company page, it means that the page is in a subfolder.
  if (pageType !== 'company') {
    const productFolderName = path.basename(path.dirname(dataFilePath))
    const subfolder = path.join(buildFolder, productFolderName)
    return subfolder
  }

  // Company's page? It's simply the build folder!
  return buildFolder
}

// Get an absolute page url from its location in the build process.
export function getAbsolutePageUrl (dataFilePath, pageType) {
  const buildFolder = createAndGetBuildFolder()
  const pageFolder = getPageFolder(buildFolder, dataFilePath, pageType)

  const htmlFilePath = getHtmlFilePath(pageFolder)
  const relativePath = path.posix.relative(buildFolder, htmlFilePath)

  return path.posix.join(config.commands.build.baseUrl, relativePath)
}
