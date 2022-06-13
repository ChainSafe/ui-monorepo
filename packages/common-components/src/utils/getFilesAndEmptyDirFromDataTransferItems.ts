export type FileWithPath = File & {
  path: string
}

interface FilesAndDirFromDataTransferItems {
  files?: FileWithPath[]
  emptyDirPaths?: string[]
}

const mergeResults = (prevRes: FilesAndDirFromDataTransferItems, newRes: FilesAndDirFromDataTransferItems) => {
  return {
    files: [...(prevRes.files || []), ...(newRes.files || [])],
    emptyDirPaths: [...(prevRes.emptyDirPaths || []), ...(newRes.emptyDirPaths || [])]
  } as FilesAndDirFromDataTransferItems
}

const readFile = (entry: FileEntry, path = ""): Promise<FileWithPath> => {
  return new Promise((resolve, reject) => {
    entry.file((file: File) => {
      Object.defineProperty(file, "path", {
        value: path
      })
      resolve(file as FileWithPath)
    }, (err: Error) => {
      reject(err)
    })
  })
}


const dirReadEntries = (dirReader: DirectoryReader, path: string): Promise<FilesAndDirFromDataTransferItems> => {
  return new Promise((resolve, reject) => {
    dirReader.readEntries(async (entries: FileSystemEntry[]) => {
      let res: FilesAndDirFromDataTransferItems = {}
      for (const entry of entries) {
        const newRes = await getFilesAndEmptyDirFromEntry(entry, path)
        res = mergeResults(res, newRes)
      }
      resolve(res)
    }, (err: Error) => {
      reject(err)
    })
  })
}

const readDir = async (entry: DirectoryEntry, path: string) => {
  const dirReader = entry.createReader()
  const newPath = path + entry.name + "/"
  let newFilesOrFolders: FilesAndDirFromDataTransferItems = {}
  let res: FilesAndDirFromDataTransferItems = {}
  do {
    newFilesOrFolders = await dirReadEntries(dirReader, newPath)

    res = mergeResults(res, newFilesOrFolders)
  } while (newFilesOrFolders?.files && newFilesOrFolders.files.length > 0)

  return res
}

const getFilesAndEmptyDirFromEntry = async (entry: FileSystemEntry, path = ""): Promise<FilesAndDirFromDataTransferItems> => {
  if (entry.isFile) {
    const file = await readFile(entry as FileEntry, path)
    return { files: [file] }
  }

  if (entry.isDirectory) {
    // read files inside this dir
    const res = await readDir(entry as DirectoryEntry, path)

    if(!res?.files || res.files.length === 0){
      // this is an empty dir
      return { emptyDirPaths: [`${path}${entry.name}`] }
    }

    return res
  }

  return {}
}

export const getFilesAndEmptyDirFromDataTransferItems =
    async (dataTransferItems: DataTransferItemList): Promise<FilesAndDirFromDataTransferItems> => {
      let result: FilesAndDirFromDataTransferItems = { files: [], emptyDirPaths: [] }
      const entries: (FileSystemEntry | null)[] = []

      // Pull out all entries before reading them
      for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
        entries.push(dataTransferItems[i].webkitGetAsEntry())
      }

      // Recursively read through all entries
      for (const entry of entries) {
        if (entry) {
          const newRes = await getFilesAndEmptyDirFromEntry(entry)
          result = mergeResults(result, newRes)
        }
      }

      return result
    }