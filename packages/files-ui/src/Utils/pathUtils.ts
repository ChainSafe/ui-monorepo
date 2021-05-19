// trims a string at both ends for a character
function trimChar(str: string, char: string) {
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
export function getPathFromArray(arrayOfPaths: string[]): string {
  if (!arrayOfPaths.length) return "/"
  else {
    return "/" + arrayOfPaths.join("/")
  }
}

// get path and file
export function getPathWithFile(path: string, fileName: string) {
  return path === "/"
    ? `/${fileName}`
    : path[path.length - 1] === "/"
      ? `${path}${fileName}`
      : `${path}/${fileName}`
}

// get path and file
export function getParentPathFromFilePath(filePath: string) {
  const parentPath = filePath.substring(0, filePath.lastIndexOf("/"))
  if (!parentPath) return "/"
  return parentPath
}


export function extractDrivePath(pathname: string) {
  return pathname.split("/").slice(2).join("/").concat("/")
}