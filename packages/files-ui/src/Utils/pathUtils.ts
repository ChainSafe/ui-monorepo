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
export function extractFileBrowserPathFromURL(browserUrl: string, modulePath: string) {
  return browserUrl.replace(modulePath, "").split("/").map(decodeURIComponent).join("/")
}