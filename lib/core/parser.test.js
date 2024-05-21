import readYAML, { parseYAML } from './parser'

describe('YAML Parser', () => {
  it('handles empty, null or undefined XML strings', () => {
    expect(() => parseYAML(undefined)).toThrow()
    expect(() => parseYAML(null)).toThrow()
    expect(() => parseYAML('')).toThrow()
  })

  it('handles invalid YAML strings', () => {
    expect(() => parseYAML('thisIsNot a valid yaml structure')).toThrow()
  })

  it('handles valid YAML strings but invalid presskit type', () => {
    expect(() => parseYAML('type: book')).toThrow()
  })
})

describe('YAML Reader', () => {
  it('handles valid YAML `company` presskit string', () => {
    const result = readYAML(`${process.cwd()}/data/data.yml`)

    expect(result.type).toBe('company')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })

  it('handles valid YAML `product` presskit string', () => {
    const result = readYAML(`${process.cwd()}/data/product/data.yml`)

    expect(result.type).toBe('product')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })
})
