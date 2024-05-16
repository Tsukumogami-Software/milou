'use strict'

import { default as mock } from "mock-fs"
import { readdirSync } from "fs"
import { createDir, copyDirContent, findAllFiles } from "./sfs"

// -------------------------------------------------------------
// Data.
// -------------------------------------------------------------

const fakeFileSystem = {
  product1: {
    'data.json': '{ "type": "product", "title": "Fake Product" }',
    images: {
      'img01.png': Buffer.from([]),
      'img02.png': Buffer.from([]),
      'img03.png': Buffer.from([])
    },
    emptyDir1: {}
  },
  product2: {
    'data.xml': '<?xml version="1.0" encoding="utf-8"?><product></product>'
  },
  misc: {
    product3: {
      'data.md': 'Fake Product'
    },
    emptyDir2: {}
  },
  emptyDir3: {},
  'data.json': '{ "type": "company", "title": "Fake Company" }'
}

// -------------------------------------------------------------
// Setup.
// -------------------------------------------------------------

beforeEach(() => {
  mock(fakeFileSystem)
})

afterEach(() => {
  mock.restore()
})

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('createDir()', () => {
  it('should create a directory if it does not exist', () => {
    // No dir: error.
    expect(() => readdirSync('tmpdir')).toThrow()

    const result = createDir('tmpdir')
    expect(result).toBeTruthy()
    expect(readdirSync('tmpdir').length).toBe([].length)
  })

  it('should not create the directory if it already exists', () => {
    const result = createDir('product1')
    expect(result).toBeFalsy()
  })
})

describe('copyDirContent()', () => {
  it('should copy all the files of a folder to another', () => {
    const numberOfFiles = readdirSync('product1/images').length
    copyDirContent('product1/images', 'copiedImages')

    expect(readdirSync('copiedImages').length).toBe(numberOfFiles)
  })
})

describe('findAllFiles()', () => {
  it('should return an array containing every files on the FS', () => {
    const files = findAllFiles('.')

    // Number of files in mockfs.
    expect(files.length).toBe(7)
  })

  it('should limit its search to one subfolder only', () => {
    const files = findAllFiles('.', { maxDepth: 1 })
    expect(files.length).toBe(3)
  })

  it('should ignore some folders', () => {
    const files = findAllFiles('.', { ignoredFolders: ['product1', 'product2'] })
    expect(files.length).toBe(2)
  })
})
