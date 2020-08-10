export interface IFpsFileOrFolder {
  name: string
  cid: string
  content_type: string
  size: number
}

export interface IFpsFileInfo {
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

interface IFpsFileOrFolderStore extends IFpsFileOrFolder {
  downloadLoading: boolean
  renameLoading: boolean
  renameOpen: boolean
  renameTempName: string
  deleteLoading: boolean
}

export interface INotification {
  id: string
  filename: string
  cid: string
  message: string
}
