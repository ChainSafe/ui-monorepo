// trims a string at both ends for a character
export function trimChar(str: string, char: string) {
  char = char.charAt(0)
  if (str.charAt(0) === char) {
    str = str.substr(1, str.length - 1)
  }
  if (str.charAt(str.length - 1) === char) {
    str = str.substr(0, str.length - 1)
  }
  return str
}

// "/" -> []
// "/path/to/this" -> ["path", "to", "this"]
export function getArrayOfPaths(path: string): string[] {
  if (path === "/") return []
  else {
    path = trimChar(path, "/")
    return path.split("/")
  }
}

// [] -> "/"
// ["path", "to", "this"] -> "/path/to/this"
export function getURISafePathFromArray(arrayOfPaths: string[]): string {
  if (!arrayOfPaths.length) return "/"
  else {
    return `/${arrayOfPaths.map(encodeURIComponent).join("/")}`
  }
}

// Safe append path to file name
// /path/to/somewhere + 1.txt -> /path/to/somewhere/1.txt
// /path/to/somewhere/ + 1.txt -> /path/to/somewhere/1.txt
export function getPathWithFile(path: string, fileName: string) {
  return path === "/"
    ? `/${fileName}`
    : path[path.length - 1] === "/"
      ? `${path}${fileName}`
      : `${path}/${fileName}`
}

// /path/to/somewhere/1.txt -> /path/to/somewhere
export function getParentPathFromFilePath(filePath: string) {
  const parentPath = filePath.substring(0, filePath.lastIndexOf("/"))
  if (!parentPath) return "/"
  return parentPath
}

// /drive/path/to/somewhere -> /path/to/somewhere
// /drive -> /
export function extractFileBrowserPathFromURL(browserUrl: string, modulePath: string) {
  const result = browserUrl.replace(modulePath, "").split("/").map(decodeURIComponent).join("/")
  // this path must start by a /
  return result[0] === "/" ? result : `/${result}`
}

// /shared/{bucket-id}/path/to/somewhere -> /path/to/somewhere
export function extractSharedFileBrowserPathFromURL(browserUrl: string, modulePath: string) {
  const res = extractFileBrowserPathFromURL(browserUrl, modulePath)
  // this path must start by a /
  return res[0] === "/" ? res : `/${res}`
}

// is fold1 a subfolder of fold2
export const isSubFolder = (fold1: string, fold2: string) => {
  const path1 = fold1.split("/").filter(p => p !== "")
  const path2 = fold2.split("/").filter(p => p !== "")
  let result = false

  // the path1 can only be a subfolder
  // if it's longer than path2
  if (path1.length < path2.length){
    return result
  }

  // we loop over every section of path1
  path1.every((section, index) => {
    // so far every paths were identical
    // if we reach the end of paths2, then paths1 is a subfolder of paths2
    if (index === path2.length){
      result = true
      //break out of the loop
      return false
    }

    return section === path2[index]
  })

  return result
}

export const getUrlSafePathWithFile = (path: string, fileName: string) => {
  let urlSafePath =  getURISafePathFromArray(getArrayOfPaths(path))
  if (urlSafePath === "/") {
    urlSafePath = ""
  }

  return `${urlSafePath}/${encodeURIComponent(fileName)}`
}
