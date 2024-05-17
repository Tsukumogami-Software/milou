import config from '../config.js'
import { assets } from '../assets.js'

import path from 'upath'
import * as chokidar from 'chokidar'
import browserSync from 'browser-sync'

const bs = browserSync.create()

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Simple watcher used by the end-user.
// It only checks the data files and will launch a server on the build
// folder.
// It ignores the templates and CSS files changes.
export function installWatcher (startingFolder, callback) {
  bs.init({
    server: config.commands.build.output,
    port: config.commands.build.port,
    ui: false,
    open: false,
    logLevel: 'silent'
  })

  const watcher = createWatcher(path.join(startingFolder, '**/data.xml'))

  watcher.on('change', () => {
    callback()
    bs.reload()
  })
}

// Complex watcher to develop the CSS and templates of this project.
// Will check the data files, the templates AND the CSS.
export function installDevelopmentWatcher (startingFolder, callback) {
  const buildFolder = config.commands.build.output

  // BrowserSync will watch for changes in the assets CSS.
  // It will also create a server with the build folder and the assets.
  bs.init({
    server: [buildFolder, assets],
    port: config.commands.build.port,
    files: path.join(assets, '**/*.css'),
    ui: false,
    open: false
  })

  // Meanwhile, the watcher will monitor changes in the templates
  // and the data files.
  // Then, when a change occurs, it will regenerate the site through
  // the provide callback.
  const templateFolder = path.join(assets, '**/*.html')
  const dataFolder = path.join(startingFolder, '**/data.xml')

  const watcher = createWatcher(templateFolder, dataFolder)

  watcher.on('change', () => {
    callback()
    bs.reload()
  })
}

function createWatcher (...folders) {
  const watcher = chokidar.watch(folders, {
    ignored: /(^|[/\\])\../,
    persistent: true
  })

  return watcher
}
