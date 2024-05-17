import * as fs from 'fs'
import { parse } from 'yaml'

export function parseYAML (yaml) {
  if (!yaml) {
    throw new Error('YAML input was null or empty')
  }

  const data = parse(yaml)
  switch (data.type) {
    case 'product':
    case 'company':
      return data
    default:
      throw new Error('Unrecognized YAML file, expected product or company type')
  }
}

function readYAML (filename) {
  const yml = fs.readFileSync(filename, 'utf-8')
  return parseYAML(yml)
}

export default readYAML
