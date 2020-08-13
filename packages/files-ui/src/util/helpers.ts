export function getJsonFromString(jsonString: string): any {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    return null
  }
}

export function formatFileSizeFromBytes(bytes: number, decimalPoint = 2) {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimalPoint
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function addFileOrFolderToPath(
  pathString: string,
  newFileOrFolderName: string
) {
  if (pathString === '/') {
    return '/' + newFileOrFolderName
  } else {
    return pathString + '/' + newFileOrFolderName
  }
}

export function getPath(pathArray: string[]): string | null {
  if (!pathArray || !pathArray.length) {
    return null
  } else if (pathArray.length === 1) {
    return '/'
  } else {
    let path = ''
    for (let i = 1; i < pathArray.length; i++) {
      path += '/' + pathArray[i]
    }
    return path
  }
}

export function getNewFolderPath(
  pathArray: string[],
  folderName: string
): string | null {
  if (!pathArray || !pathArray.length) {
    return null
  } else if (pathArray.length === 1) {
    return '/' + folderName
  } else {
    let path = ''
    for (let i = 1; i < pathArray.length; i++) {
      path += '/' + pathArray[i]
    }
    return path + '/' + folderName
  }
}

export const customEllipsis = (input: string, sideDistribution = 3): string => {
  return typeof input == 'string'
    ? input.length > sideDistribution * 2
      ? `${input.substr(0, sideDistribution)}...${input.substr(
          input.length - sideDistribution,
          sideDistribution
        )}`
      : input
    : input
}

export const commaSplitting = (input: number, digitsBetween = 3): string => {
  return `${input}`.length > digitsBetween
    ? `${input}`
        .split('')
        .reverse()
        .map((letter: string, index: number) => {
          const test =
            index % digitsBetween === 0 && index !== 0 ? `${letter},` : letter
          return test
        })
        .reverse()
        .join('')
    : `${input}`
}
