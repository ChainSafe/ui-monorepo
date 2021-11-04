const guessContentType = (fileName: string) => {
  const { length, [length - 1]: ext } = fileName.split(".")

  switch (ext.toLowerCase()) {
    case "pdf":
      return "application/pdf"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "heic":
      return `image/${ext.toLowerCase()}`
    case "mp3":
    case "m4a":
      return `audio/${ext}`
    case "mp4":
      return `video/${ext}`
    case "txt":
      return "text/plain"
    case "md":
      return "text/markdown"
    default:
      return "application/octet-stream"
  }
}

export { guessContentType }
