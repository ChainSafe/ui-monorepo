import {
  IFpsAction,
  FPS_UPLOAD_LOADING,
  FPS_UPLOAD_SUCCESS,
  FPS_UPLOAD_CLEAR,
  FPS_UPLOAD_PROGRESS,
  FPS_UPLOAD_FAIL,
  FPS_FILE_LIST_LOADING,
  FPS_FILE_LIST_SUCCESS,
  FPS_FILE_LIST_FAIL,
  FPS_DELETE_FILES_LOADING,
  FPS_DELETE_FILES_SUCCESS,
  FPS_DELETE_FILES_FAIL,
  FPS_FILE_RENAME_START,
  FPS_FILE_RENAME_CANCEL,
  FPS_FILE_RENAME_LOADING,
  FPS_FILE_RENAME_SUCCESS,
  FPS_FILE_RENAME_FAIL,
  FPS_FILE_RENAME_TEMP_SET,
  FPS_NOTIFICATION_FETCH_SUCCESS
} from './actionCreators'
import { IFpsFileOrFolderStore, INotification } from '../../../types/fps'

export interface IFpsStore {
  uploadLoading: boolean | null
  uploadProgress: number
  uploadStatus: boolean | null
  uploadError: string | null

  pathString: string
  fileList: IFpsFileOrFolderStore[] | null
  fileListLoading: boolean
  fileListError: string

  mkdirLoading: boolean
  mkdirError: string

  notifications: INotification[]
}

const initializer: IFpsStore = {
  uploadLoading: null,
  uploadProgress: 0,
  uploadStatus: null,
  uploadError: null,

  pathString: '/fps',
  fileList: [],
  fileListLoading: false,
  fileListError: '',

  mkdirLoading: false,
  mkdirError: '',
  notifications: []
}

export default (state = initializer, action: IFpsAction): IFpsStore => {
  switch (action.type) {
    case FPS_UPLOAD_LOADING: {
      return {
        ...state,
        uploadLoading: true,
        uploadProgress: 0,
        uploadStatus: null,
        uploadError: null
      }
    }
    case FPS_UPLOAD_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.payload,
        uploadError: null
      }
    }
    case FPS_UPLOAD_SUCCESS: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: true,
        uploadError: null
      }
    }
    case FPS_UPLOAD_FAIL: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: false,
        uploadError: action.payload
      }
    }
    case FPS_UPLOAD_CLEAR: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: null,
        uploadError: ''
      }
    }
    case FPS_FILE_LIST_LOADING: {
      return {
        ...state,
        fileListLoading: true
      }
    }
    case FPS_FILE_LIST_SUCCESS: {
      return {
        ...state,
        fileListLoading: false,
        fileList: action.payload.map(record => ({
          ...record,
          downloadLoading: false,
          renameLoading: false,
          deleteLoading: false,
          renameOpen: false,
          renameTempName: record.name
        }))
      }
    }
    case FPS_FILE_LIST_FAIL: {
      return {
        ...state,
        fileListLoading: false,
        fileListError: action.payload
      }
    }
    case FPS_DELETE_FILES_LOADING: {
      const driveFiles = state.fileList
      if (driveFiles) {
        action.payload.indexes.forEach(index => {
          driveFiles[index].deleteLoading = true
        })
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_DELETE_FILES_SUCCESS: {
      const driveFiles = state.fileList
      if (driveFiles) {
        action.payload.indexes.forEach(index => {
          driveFiles[index].deleteLoading = false
        })
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_DELETE_FILES_FAIL: {
      const driveFiles = state.fileList
      if (driveFiles) {
        action.payload.indexes.forEach(index => {
          driveFiles[index].deleteLoading = false
        })
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_START: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameOpen = true
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_CANCEL: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameOpen = false
        driveFiles[action.payload.fileIndex].renameTempName =
          driveFiles[action.payload.fileIndex].name
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_TEMP_SET: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameTempName =
          action.payload.tempName
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_LOADING: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameLoading = true
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_SUCCESS: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameLoading = false
        driveFiles[action.payload.fileIndex].renameOpen = false
        driveFiles[action.payload.fileIndex].name =
          driveFiles[action.payload.fileIndex].renameTempName
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_FILE_RENAME_FAIL: {
      const driveFiles = state.fileList
      if (driveFiles) {
        driveFiles[action.payload.fileIndex].renameLoading = false
        driveFiles[action.payload.fileIndex].renameTempName = ''
        return {
          ...state,
          fileList: [...driveFiles]
        }
      } else {
        return state
      }
    }
    case FPS_NOTIFICATION_FETCH_SUCCESS: {
      return {
        ...state,
        notifications: action.payload ? action.payload : []
      }
    }
    default:
      return state
  }
}
