import upath from 'upath'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = upath.dirname(__filename)

export const assets = upath.join(__dirname, '../assets')

export const assetsToCopy = [
  upath.join(assets, 'css/master.css'),
  upath.join(assets, 'css/normalize.css')
]

export const companyTemplate = upath.join(assets, 'templates/company.yml')
export const productTemplate = upath.join(assets, 'templates/product.yml')

export const imagesFolderName = 'images'
export const authorizedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.apng', '.avif', '.webp']
