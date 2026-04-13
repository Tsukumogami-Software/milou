import * as fs from 'fs'
import path from 'upath'
import archiver from 'archiver'
import { PassThrough } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'
import config from '../config.js'

const client = new S3Client({})

function zip (name, target, source, files) {
  if (!files || files.length === 0) return

  const filename = path.join(target, name)
  const output = fs.createWriteStream(filename)

  const archive = archiver('zip', {
    store: true,
    zlib: { level: 6 }
  })
  archive.on('error', (err) => { throw err })
  archive.pipe(output)

  files.forEach((f) => {
    archive.append(fs.createReadStream(path.join(source, f)), { name: f })
  })

  archive.finalize()

  return filename
}

async function s3zip (name, target, source, files, s3Bucket) {
  if (!files || files.length === 0) return

  const filename = path.join(target, name)
  const passthrough = new PassThrough()

  const upload = new Upload({
    client,
    params: {
      Bucket: s3Bucket,
      Key: filename,
      Body: passthrough,
      ContentType: 'application/zip'
    }
  })
  upload.on('httpUploadProgress', (progress) => {
    console.log(`Uploaded: ${progress.loaded} / ${progress.total}`)
  })

  const archive = archiver('zip', {
    store: true,
    zlib: { level: 6 }
  })
  archive.on('error', (err) => { throw err })
  archive.pipe(passthrough)

  files.forEach((f) => {
    archive.append(fs.createReadStream(path.join(source, f)), { name: f })
  })

  archive.finalize()

  await upload.done()
  return filename
}

async function createArchive (name, target, source, files) {
  if (!config.commands.build.zip) {
    return ''
  }

  const s3Bucket = config.commands.build.s3Bucket
  if (s3Bucket) {
    const filename = await s3zip(name, target, source, files, s3Bucket)
    const url = new URL(filename, config.commands.build.s3PublicUrl)
    return url.href
  }

  zip(name, target, source, files)
  return path.join('images', name)
}

export default createArchive
