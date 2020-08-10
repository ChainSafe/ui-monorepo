import {
  IDriveAction,
  DRIVE_UPLOAD_LOADING,
  DRIVE_UPLOAD_SUCCESS,
  DRIVE_UPLOAD_CLEAR,
  DRIVE_UPLOAD_PROGRESS,
  DRIVE_UPLOAD_FAIL,
  DRIVE_FILE_LIST_LOADING,
  DRIVE_FILE_LIST_SUCCESS,
  DRIVE_FILE_LIST_FAIL,
  DRIVE_DELETE_FILES_LOADING,
  DRIVE_DELETE_FILES_SUCCESS,
  DRIVE_DELETE_FILES_FAIL,
  DRIVE_MKDIR_LOADING,
  DRIVE_MKDIR_SUCCESS,
  DRIVE_MKDIR_FAIL,
  DRIVE_PUSH_FOLDER,
  DRIVE_MOVE_TO_FOLDER,
  DRIVE_FILE_RENAME_START,
  DRIVE_FILE_RENAME_CANCEL,
  DRIVE_FILE_RENAME_LOADING,
  DRIVE_FILE_RENAME_SUCCESS,
  DRIVE_FILE_RENAME_FAIL,
  DRIVE_FILE_RENAME_TEMP_SET,
  DRIVE_INFO_SUCCESS
} from './actionCreators'
import { IDriveFileOrFolderStore } from '../../../types/drive'

export interface IDriveStore {
  uploadLoading: boolean | null
  uploadProgress: number
  uploadStatus: boolean | null
  uploadError: string | null

  pathArray: string[]
  pathString: string
  fileList: IDriveFileOrFolderStore[] | null
  fileListLoading: boolean
  fileListError: string

  mkdirLoading: boolean
  mkdirError: string

  apiKey: string
}

const initializer: IDriveStore = {
  uploadLoading: null,
  uploadProgress: 0,
  uploadStatus: null,
  uploadError: null,

  pathArray: ['/'],
  pathString: '/',
  fileList: [],
  fileListLoading: false,
  fileListError: '',

  mkdirLoading: false,
  mkdirError: '',
  apiKey: ''
}

export default (state = initializer, action: IDriveAction): IDriveStore => {
  switch (action.type) {
    case DRIVE_UPLOAD_LOADING: {
      return {
        ...state,
        uploadLoading: true,
        uploadProgress: 0,
        uploadStatus: null,
        uploadError: null
      }
    }
    case DRIVE_UPLOAD_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.payload,
        uploadError: null
      }
    }
    case DRIVE_UPLOAD_SUCCESS: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: true,
        uploadError: null
      }
    }
    case DRIVE_UPLOAD_FAIL: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: false,
        uploadError: action.payload
      }
    }
    case DRIVE_UPLOAD_CLEAR: {
      return {
        ...state,
        uploadLoading: false,
        uploadProgress: 0,
        uploadStatus: null,
        uploadError: ''
      }
    }
    case DRIVE_FILE_LIST_LOADING: {
      return {
        ...state,
        fileListLoading: true
      }
    }
    case DRIVE_FILE_LIST_SUCCESS: {
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
    case DRIVE_FILE_LIST_FAIL: {
      return {
        ...state,
        fileListLoading: false,
        fileListError: action.payload
      }
    }
    case DRIVE_MKDIR_LOADING: {
      return {
        ...state,
        mkdirLoading: true,
        mkdirError: ''
      }
    }
    case DRIVE_MKDIR_SUCCESS: {
      return {
        ...state,
        mkdirLoading: false,
        mkdirError: ''
      }
    }
    case DRIVE_MKDIR_FAIL: {
      return {
        ...state,
        mkdirLoading: false,
        mkdirError: action.payload
      }
    }
    case DRIVE_PUSH_FOLDER: {
      return {
        ...state,
        pathArray: action.payload.pathArray,
        pathString: action.payload.pathString
      }
    }
    case DRIVE_MOVE_TO_FOLDER: {
      return {
        ...state,
        pathArray: action.payload.pathArray,
        pathString: action.payload.pathString
      }
    }
    case DRIVE_DELETE_FILES_LOADING: {
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
    case DRIVE_DELETE_FILES_SUCCESS: {
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
    case DRIVE_DELETE_FILES_FAIL: {
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
    case DRIVE_FILE_RENAME_START: {
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
    case DRIVE_FILE_RENAME_CANCEL: {
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
    case DRIVE_FILE_RENAME_TEMP_SET: {
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
    case DRIVE_FILE_RENAME_LOADING: {
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
    case DRIVE_FILE_RENAME_SUCCESS: {
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
    case DRIVE_FILE_RENAME_FAIL: {
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
    case DRIVE_INFO_SUCCESS: {
      return {
        ...state,
        apiKey: action.payload.apiKey
      }
    }
    default:
      return state
  }
}
