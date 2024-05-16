'use strict'

import * as fs from 'fs'
import { outputFileSync } from 'fs-extra/esm'
import path from "upath"
import * as mkdirp from "mkdirp"

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a directory if it doesn't exist yet.
export function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  mkdirp.sync(dir)
  return true
}

export function copyDirContent (source, target) {
  if (!fs.existsSync(source)) return

  // Create target dir if necessary.
  createDir(target)

  // Copy all files from source to target.
  findAllFiles(source).forEach((name) => {
    const nameWithoutSource = path.relative(source, name)
    const targetFile = path.join(target, nameWithoutSource)
    outputFileSync(targetFile, fs.readFileSync(name))
  })
}

// Find all files in a directory structure.
export function findAllFiles (baseDir, {
  ignoredFolders = [],
  maxDepth = undefined
} = {}) {
  const list = []

  function search (dir, depth) {
    fs.readdirSync(dir).forEach(file => {
      file = path.join(dir, file)

      // File or directory? Ok.
      // Otherwise, discard the file.
      const stat = fs.statSync(file)
      if (stat.isFile()) {
        list.push(file)
      } else if (stat.isDirectory()) {
        // The directory should be ignored?
        if (ignoredFolders.includes(path.basename(file))) {
          return
        }

        // Should we stop at this depth?
        if (maxDepth && (depth >= maxDepth)) {
          return
        }

        search(file, depth + 1)
      }
    })
  }

  search(baseDir, 0)

  return list
}
