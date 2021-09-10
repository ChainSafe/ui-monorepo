type FileWithPath = File & {filepath: string}

const getFilesFromDataTransferItems = async (dataTransferItems: DataTransferItemList): Promise<Array<FileWithPath>> => {
  //@ts-ignore
  const readFile = (entry: FileSystemFileEntry, path = ''): Promise<FileWithPath> => {
    return new Promise((resolve, reject) => {
      entry.file((file: File) => {
        //@ts-ignore
        file.filepath = path
        //@ts-ignore
        resolve(file)
      }, (err: Error) => {
        reject(err)
      })
    })
  }

  //@ts-ignore
  const dirReadEntries = (dirReader: FileSystemDirectoryReader, path: string): Promise<FileWithPath[]> => {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      dirReader.readEntries(async (entries: FileSystemEntry[]) => {
        let files = [] as Array<FileWithPath>
        for (let entry of entries) {
          const itemFiles = await getFilesFromEntry(entry, path) as Array<FileWithPath>
          files = files.concat(itemFiles)
        }
        resolve(files)
      }, (err: Error) => {
        reject(err)
      })
    })
  }

  //@ts-ignore
  const readDir = async (entry: FileSystemDirectoryEntry, path: string) => {
    const dirReader = entry.createReader()
    const newPath = path + entry.name + '/'
    let files = [] as Array<FileWithPath>
    let newFiles
    do {
      newFiles = await dirReadEntries(dirReader, newPath)
      files = files.concat(newFiles)
    } while (newFiles.length > 0)
    return files
  }

  //@ts-ignore
  const getFilesFromEntry = async (entry: FileSystemEntry, path = '') => {
    if (entry.isFile) {
      //@ts-ignore
      const file = await readFile(entry as FileSystemFileEntry, path)
      return [file]
    }
    if (entry.isDirectory) {
      //@ts-ignore
      const files = await readDir(entry as FileSystemDirectoryEntry, path)
      return files
    }
    // throw new Error('Entry not isFile and not isDirectory - unable to get files')
  }

  let files = [] as Array<FileWithPath>
  let entries = []

  // Pull out all entries before reading them
  for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
    //@ts-ignore
    entries.push(dataTransferItems[i].webkitGetAsEntry())
  }

  // Recursively read through all entries
  for (let entry of entries) {
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