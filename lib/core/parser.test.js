import * as fs from 'fs'
import parseYAML from './parser'

describe('YAML Parser', () => {
  const companyYAML = fs.readFileSync(`${process.cwd()}/data/data.yml`, 'utf-8')
  const productYAML = fs.readFileSync(`${process.cwd()}/data/product/data.yml`, 'utf-8')

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

  it('handles valid YAML `company` presskit string', () => {
    const result = parseYAML(companyYAML)

    expect(result.type).toBe('company')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })

  it('handles valid YAML `product` presskit string', () => {
    const result = parseYAML(productYAML)

    expect(result.type).toBe('product')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })
})
