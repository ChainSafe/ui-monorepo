export interface IDriveFileOrFolder {
  name: string
  cid: string
  content_type: string
  size: number
}

export interface IDriveFileInfo {
  content: {
    name: string
    cid: string
    content_type: string
    size: number
  }
  persistent: {
    job_id: string
    cid: string
    created: number
    hot: {
      enabled: boolean
      size: number
      ipfs: {
        created: number
      }
    }
    cold: {
      filecoin: {
        data_cid: string
      }
    }
  }
}

interface IDriveFileOrFolderStore extends IDriveFileOrFolder {
  downloadLoading: boolean
  renameLoading: boolean
  renameOpen: boolean
  renameTempName: string
  deleteLoading: boolean
}
