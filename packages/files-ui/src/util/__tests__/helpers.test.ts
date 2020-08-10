import { getJsonFromString, formatFileSizeFromBytes } from '../helpers'

describe('JSON from string', () => {
  const exampleJson = {
    name: 'JohnDoe'
  }
  const exampleJsonString = JSON.stringify(exampleJson)

  it('should be valid with valid JSON string', () => {
    expect(getJsonFromString(exampleJsonString)).toEqual(exampleJson)
  })

  it('should be valid with valid JSON string', () => {
    expect(getJsonFromString(`${exampleJsonString}s`)).toBe(null)
  })
})

describe('Format file size', () => {
  it('should be 0 bytes for 0 file size', () => {
    expect(formatFileSizeFromBytes(0)).toEqual('0 Bytes')
  })

  it('should be 12 bytes for 12 file size', () => {
    expect(formatFileSizeFromBytes(12)).toEqual('12 Bytes')
  })

  it('should be 1 KB for 1024 file size', () => {
    expect(formatFileSizeFromBytes(1024)).toEqual('1 KB')
  })

  it('should be 2 KB for 2048 file size', () => {
    expect(formatFileSizeFromBytes(2048)).toEqual('2 KB')
  })

  it('should be 2.24 KB for 2294 file size', () => {
    expect(formatFileSizeFromBytes(2294)).toEqual('2.24 KB')
  })

  it('should be 2.24 KB for 2295 file size with 3 decimal place', () => {
    expect(formatFileSizeFromBytes(2295, 3)).toEqual('2.241 KB')
  })

  it('should be 2.24 MB for 2295*1024 file size with 3 decimal place', () => {
    expect(formatFileSizeFromBytes(2295 * 1024, 3)).toEqual('2.241 MB')
  })

  it('should be 2.24 GB for 2295*1024*1024 file size with 3 decimal place', () => {
    expect(formatFileSizeFromBytes(2295 * 1024 * 1024, 3)).toEqual('2.241 GB')
  })
})
