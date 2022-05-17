//Shamelessly borrowed from https://github.com/anatol-grabowski/datatransfer-files-promise with added Types

export type FileWithPath = File & {filepath: string}

const getFilesFromDataTransferItems = async (dataTransferItems: DataTransferItemList): Promise<Array<FileWithPath>> => {
  const readFile = (entry: FileEntry, path = ""): Promise<FileWithPath> => {
    return new Promise((resolve, reject) => {
      entry.file((file: File) => {
        Object.defineProperty(file, "filepath", {
          value: path
        })
        resolve(file as FileWithPath)
      }, (err: Error) => {
        reject(err)
      })
    })
  }

  const dirReadEntries = (dirReader: DirectoryReader, path: string): Promise<FileWithPath[]> => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(async (entries: FileSystemEntry[]) => {
        let files = [] as Array<FileWithPath>
        for (const entry of entries) {
          const itemFiles = await getFilesFromEntry(entry, path) as Array<FileWithPath>
          files = files.concat(itemFiles)
        }
        resolve(files)
      }, (err: Error) => {
        reject(err)
      })
    })
  }

  const readDir = async (entry: DirectoryEntry, path: string) => {
    const dirReader = entry.createReader()
    const newPath = path + entry.name + "/"
    let files = [] as Array<FileWithPath>
    let newFiles
    do {
      newFiles = await dirReadEntries(dirReader, newPath)
      files = files.concat(newFiles)
    } while (newFiles.length > 0)
    return files
  }

  const getFilesFromEntry = async (entry: FileSystemEntry, path = "") => {
    if (entry.isFile) {
      const file = await readFile(entry as FileEntry, path)
      return [file]
    }
    if (entry.isDirectory) {
      const files = await readDir(entry as DirectoryEntry, path)
      return files
    }
  }

  let files = [] as Array<FileWithPath>
  const entries = []

  // Pull out all entries before reading them
  for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
    entries.push(dataTransferItems[i].webkitGetAsEntry())
  }

  // Recursively read through all entries
  for (const entry of entries) {
    if (entry) {
      const newFiles = await getFilesFromEntry(entry)
      if (newFiles) {
        files = files.concat(newFiles)
      }
    }
  }

  return files
}

export default getFilesFromDataTransferItems