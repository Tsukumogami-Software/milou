import * as fs from 'fs'
import path from 'upath'
import archiver from 'archiver'
import { PassThrough } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'

function zip (name, destination, source, files) {
  const filename = path.join(destination, name)
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

export async function s3zip (name, destination, source, files, s3bucket) {
  const filename = path.join(destination, name)
  const passthrough = new PassThrough()

  const upload = new Upload({
    client,
    params: {
      Bucket: s3bucket,
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

export default zip
