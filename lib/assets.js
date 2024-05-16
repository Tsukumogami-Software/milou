'use strict'

const path = require('upath')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

export const assets = path.join(__dirname, '../assets')

export const assetsToCopy = [
  path.join(assets, 'css/master.css'),
  path.join(assets, 'css/normalize.css'),
  path.join(assets, 'js/hamburger.js'),
  path.join(assets, 'js/imagesloaded.min.js'),
  path.join(assets, 'js/masonry.min.js')
]

export const companyTemplate = path.join(assets, 'templates/company.xml')
export const productTemplate = path.join(assets, 'templates/product.xml')

export const imagesFolderName = 'images'
export const authorizedImageFormats = ['.jpg', '.jpeg', '.png', '.gif']
