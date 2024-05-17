import { parse } from 'yaml'

function parseYAML (yaml) {
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

export default parseYAML
