import config from '../config.js'

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
export default function installWatchers (startingFolder, yamlCallback, cssCallback) {
  bs.init({
    server: config.commands.build.output,
    port: config.commands.build.port,
    ui: false,
    open: false,
    logLevel: 'silent'
  })

  const watcher = createWatcher(path.join(startingFolder, '**/data.yml'))
  const cssWatcher = createWatcher(path.join(startingFolder, 'style.css'))

  watcher.on('change', () => {
    yamlCallback()
    bs.reload()
  })

  cssWatcher.on('change', () => {
    cssCallback()
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
