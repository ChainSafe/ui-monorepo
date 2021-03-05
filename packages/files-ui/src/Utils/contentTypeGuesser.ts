const guessContentType = (fileName: string) => {
  const { length, [length - 1]: ext } = fileName.split(".")

  switch (ext) {
  case "pdf":
    return "application/pdf"
  case "jpg":
  case "png":
  case "gif":
  case "bmp":
    return `image/${ext}`
  case "mp3":
  case "m4a":
    return `audio/${ext}`
  case "mp4":
    return `video/${ext}`
  case "txt":
    return "text/plain"
  default:
    return "application/octet-stream"
  }
}

export { guessContentType }
