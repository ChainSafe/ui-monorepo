// Shamelessly borrowed from https://github.com/katlasik/mime-matcher/blob/master/src/index.js
// Updated the regex to more accurately reflect the IANA spec as per https://en.wikipedia.org/wiki/Media_type

// eslint-disable-next-line
const MIME_TYPE_REGEX = /^(\*|application|audio|image|message|multipart|text|video|font|example|model)\/(\*|[a-z0-9._\-]+)(\+([a-zA-Z0-9._\-=]+))?(; ([a-zA-Z0-9._\-=]+))?$/

function createMatcher(expected: string) {
  if (expected === "*") {
    return () => true
  } else {
    return (actual: string) => actual === expected
  }
}

function parse(mimeType: string) {
  if (!mimeType) {
    return {
      valid: false
    }
  }

  const match = mimeType.match(MIME_TYPE_REGEX)

  if (!match) {
    return {
      valid: false
    }
  }

  const [, type, subType, parameter] = Array.from(match)
  return {
    valid: !!match,
    type,
    subType,
    parameter
  }
}

function isValid(mimeType: string) {
  return parse(mimeType).valid
}

function matcher(expected: string[]) {
  const m = new MimeMatcher(expected)
  return (actual: string) => m.match(actual)
}

class MimeMatcher {
    expected = [] as { typeMatcher: (actual: string) => boolean; subTypeMatcher: (actual: string) => boolean }[]

    constructor(expected: string | string[]) {
      if (Array.isArray(expected)) {
        this.expected = expected.map(mimeType => {
          const { valid, type, subType } = parse(mimeType)
          if (valid && type && subType) {
            return ({
              typeMatcher: createMatcher(type),
              subTypeMatcher: createMatcher(subType)
            })
          } else {
            const msg = `Value "${mimeType}" is not valid mime type.It should have format "type/subtype".`
            throw new TypeError(msg)
          }
        })
      }
      else {
        const { valid, type, subType } = parse(expected)
        if (valid && type && subType) {
          this.expected = [{
            typeMatcher: createMatcher(type),
            subTypeMatcher: createMatcher(subType)
          }]
        } else {
          const msg = `Value "${expected}" is not valid mime type.It should have format "type/subtype".`
          throw new TypeError(msg)
        }
      }

    }

    match(actual: string) {
      const { valid, type, subType } = parse(actual)
      if (valid && type && subType) {
        return this.expected.some(({ typeMatcher, subTypeMatcher }) => {
          return typeMatcher(type) && subTypeMatcher(subType)
        })
      } else {
        return false
      }
    }
}

export { isValid, parse, matcher }

export default MimeMatcher