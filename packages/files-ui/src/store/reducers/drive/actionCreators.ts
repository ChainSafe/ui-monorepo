import { AsyncDispatch } from '../../store'
import { Dispatch } from 'redux'
import {
  uploadDriveApi,
  IDriveUploadError,
  fileListDriveApi,
  IDriveFileListApiError,
  mkDirDriveApi,
  IDriveMkDirApiError,
  deleteFileDriveApi,
  IDriveDeleteFileApiError,
  moveFileDriveApi,
  IDriveMoveFileApiError,
  billingInfoApi
} from '../../../apiLib/driveApi'
import { handleApiErr } from '../../../apiLib/errorResponse'
import { IDriveFileOrFolder } from '../../../types/drive'
import { GetState } from '../../store'
import {
  getPath,
  getNewFolderPath,
  addFileOrFolderToPath
} from 'src/util/helpers'
import { showErrorToastAction } from '../toast/actionCreators'

export const DRIVE_UPLOAD_LOADING = '@@imploy/drive/upload_loading'
export const DRIVE_UPLOAD_PROGRESS = '@@imploy/drive/upload_progress'
export const DRIVE_UPLOAD_SUCCESS = '@@imploy/drive/upload_success'
export const DRIVE_UPLOAD_FAIL = '@@imploy/drive/upload_fail'
export const DRIVE_UPLOAD_CLEAR = '@@imploy/drive/upload_clear'

export const DRIVE_FILE_LIST_LOADING = '@@imploy/drive/file_list_loading'
export const DRIVE_FILE_LIST_SUCCESS = '@@imploy/drive/file_list_success'
export const DRIVE_FILE_LIST_FAIL = '@@imploy/drive/file_list_fail'

export const DRIVE_FILE_INFO_LOADING = '@@imploy/drive/file_info'
export const DRIVE_FILE_INFO_SUCCESS = '@@imploy/drive/file_info_success'
export const DRIVE_FILE_INFO_FAIL = '@@imploy/drive/file_info_fail'

export const DRIVE_MKDIR_LOADING = '@@imploy/drive/mkdir_loading'
export const DRIVE_MKDIR_SUCCESS = '@@imploy/drive/mkdir_success'
export const DRIVE_MKDIR_FAIL = '@@imploy/drive/mkdir_fail'

export const DRIVE_DELETE_FILES_LOADING = '@@imploy/drive/delete_files_loading'
export const DRIVE_DELETE_FILES_SUCCESS = '@@imploy/drive/delete_files_success'
export const DRIVE_DELETE_FILES_FAIL = '@@imploy/drive/delete_files_fail'

export const DRIVE_PUSH_FOLDER = '@@imploy/drive/push_folder'
export const DRIVE_MOVE_TO_FOLDER = '@@imploy/drive/move_to_folder'

export const DRIVE_FILE_RENAME_START = '@@imploy/drive/file_rename_start'
export const DRIVE_FILE_RENAME_CANCEL = '@@imploy/drive/file_rename_cancel'
export const DRIVE_FILE_RENAME_TEMP_SET = '@@imploy/drive/file_rename_temp_set'
export const DRIVE_FILE_RENAME_LOADING = '@@imploy/drive/file_rename_loading'
export const DRIVE_FILE_RENAME_SUCCESS = '@@imploy/drive/file_rename_success'
export const DRIVE_FILE_RENAME_FAIL = '@@imploy/drive/file_rename_fail'

export const DRIVE_INFO_SUCCESS = '@@imploy/drive/info_success'

interface IUploadLoadingAction {
  type: typeof DRIVE_UPLOAD_LOADING
}

interface IUploadProgressAction {
  type: typeof DRIVE_UPLOAD_PROGRESS
  payload: number
}

interface IUploadSuccessAction {
  type: typeof DRIVE_UPLOAD_SUCCESS
}

interface IUploadFailAction {
  type: typeof DRIVE_UPLOAD_FAIL
  payload: string
}

interface IUploadClearAction {
  type: typeof DRIVE_UPLOAD_CLEAR
}

export function clearUploadFlagsAction() {
  return {
    type: DRIVE_UPLOAD_CLEAR
  }
}

// auth
export function uploadApiAction(formData: FormData, pathString: string) {
  return async (dispatch: AsyncDispatch) => {
    dispatch({ type: DRIVE_UPLOAD_LOADING })
    uploadDriveApi(formData, (progressEvent: any) => {
      dispatch({
        type: DRIVE_UPLOAD_PROGRESS,
        payload: Math.floor((progressEvent.loaded / progressEvent.total) * 100)
      })
    })
      .then(() => {
        dispatch({ type: DRIVE_UPLOAD_SUCCESS })
        dispatch(getFileListApiAction(pathString))
      })
      .catch((err: IDriveUploadError) => {
        const { data, message } = handleApiErr(err, dispatch)
        dispatch({
          type: DRIVE_UPLOAD_FAIL,
          payload: data ? data.drive || data.server : message || 'Upload failed'
        })
      })
  }
}

interface IFileListLoadingAction {
  type: typeof DRIVE_FILE_LIST_LOADING
}

interface IFileListSuccessAction {
  type: typeof DRIVE_FILE_LIST_SUCCESS
  payload: IDriveFileOrFolder[]
}

interface IFileListFailAction {
  type: typeof DRIVE_FILE_LIST_FAIL
  payload: string
}

// auth
export function getFileListApiAction(pathString: string) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DRIVE_FILE_LIST_LOADING })
    fileListDriveApi(pathString)
      .then(newFileList => {
        dispatch({
          type: DRIVE_FILE_LIST_SUCCESS,
          payload: newFileList
        })
      })
      .catch((err: IDriveFileListApiError) => {
        const { data, message } = handleApiErr(err, dispatch)
        const error =
          data?.drive || data?.server || message || 'Something went wrong'
        dispatch({
          type: DRIVE_FILE_LIST_FAIL,
          payload: error
        })
        dispatch(
          showErrorToastAction({
            message: error
          })
        )
      })
  }
}

interface IMkDirLoadingAction {
  type: typeof DRIVE_MKDIR_LOADING
}

interface IMkDirSuccessAction {
  type: typeof DRIVE_MKDIR_SUCCESS
  payload: IDriveFileOrFolder[]
}

interface IMkDirFailAction {
  type: typeof DRIVE_MKDIR_FAIL
  payload: string
}

// auth
export function mkDirApiAction(
  pathArray: string[],
  pathString: string,
  newFolder: string,
  onSuccess: Function
) {
  return async (dispatch: AsyncDispatch) => {
    const newFolderPath = getNewFolderPath(pathArray, newFolder)
    if (!newFolderPath) return

    dispatch({ type: DRIVE_MKDIR_LOADING })
    mkDirDriveApi(newFolderPath)
      .then(newFolder => {
        dispatch({
          type: DRIVE_MKDIR_SUCCESS,
          payload: newFolder
        })
        dispatch(getFileListApiAction(pathString))
        onSuccess()
      })
      .catch((err: IDriveMkDirApiError) => {
        const { data, message } = handleApiErr(err, dispatch)
        dispatch({
          type: DRIVE_MKDIR_FAIL,
          payload: data
            ? data.drive || data.server
            : message || 'Something went wrong'
        })
      })
  }
}

interface IDeleteFilesLoadingAction {
  type: typeof DRIVE_DELETE_FILES_LOADING
  payload: {
    indexes: number[]
  }
}

interface IDeleteFilesSuccessAction {
  type: typeof DRIVE_DELETE_FILES_SUCCESS
  payload: {
    indexes: number[]
  }
}

interface IDeleteFilesFailAction {
  type: typeof DRIVE_DELETE_FILES_FAIL
  payload: {
    indexes: number[]
    error: string
  }
}

export function deleteFilesApiAction(
  fileIndexes: number[],
  onSuccess?: Function,
  onFail?: Function
) {
  return async (dispatch: AsyncDispatch, getState: GetState) => {
    const { pathString, fileList } = getState().drive
    if (fileList) {
      const filePaths = fileIndexes.map(fileIndex =>
        addFileOrFolderToPath(pathString, fileList[fileIndex].name)
      )

      dispatch({
        type: DRIVE_DELETE_FILES_LOADING,
        payload: {
          indexes: fileIndexes
        }
      })

      deleteFileDriveApi(filePaths)
        .then(() => {
          dispatch({
            type: DRIVE_DELETE_FILES_SUCCESS,
            payload: {
              indexes: fileIndexes
            }
          })
          dispatch(getFileListApiAction(pathString))
          if (onSuccess) onSuccess()
        })
        .catch((err: IDriveDeleteFileApiError) => {
          const { status, data, message } = handleApiErr(err, dispatch)

          let error =
            (data ? data.drive || data.server : message) ||
            'Something went wrong'
          if (status === 500) {
            error = 'Only empty folders can be deleted'
          }
          if (onFail) onFail()

          dispatch({
            type: DRIVE_DELETE_FILES_FAIL,
            payload: {
              indexes: fileIndexes,
              error: error
            }
          })
          dispatch(
            showErrorToastAction({
              message: error
            })
          )
        })
    }
  }
}

interface IPushFolder {
  type: typeof DRIVE_PUSH_FOLDER
  payload: {
    pathArray: string[]
    pathString: string
  }
}

function pushFolderAction(
  pathArray: string[],
  pathString: string
): IPushFolder {
  return {
    type: DRIVE_PUSH_FOLDER,
    payload: {
      pathArray,
      pathString
    }
  }
}

export function onFolderEnter(
  pathArray: string[],
  pathString: string,
  folderName: string
) {
  return async (dispatch: AsyncDispatch) => {
    const newPathString = getNewFolderPath(pathArray, folderName)
    const newPathArray = [...pathArray, folderName]
    if (newPathString) {
      dispatch(pushFolderAction(newPathArray, newPathString))
      dispatch(getFileListApiAction(newPathString))
    }
  }
}

interface IMoveToFolder {
  type: typeof DRIVE_MOVE_TO_FOLDER
  payload: {
    pathArray: string[]
    pathString: string
  }
}

function moveToFolderAction(
  pathArray: string[],
  pathString: string
): IMoveToFolder {
  return {
    type: DRIVE_MOVE_TO_FOLDER,
    payload: {
      pathArray,
      pathString
    }
  }
}

export function folderMoveAction(folderIndex: number) {
  return async (dispatch: AsyncDispatch, getState: GetState) => {
    const { pathArray } = getState().drive
    if (pathArray.length > 1) {
      // moved to a folder
      const newPathArray = pathArray
      newPathArray.length = folderIndex + 1
      const newPathString = getPath(newPathArray)

      if (newPathString) {
        dispatch(moveToFolderAction(newPathArray, newPathString))
        dispatch(getFileListApiAction(newPathString))
      }
    }
  }
}

interface IRenameStartAction {
  type: typeof DRIVE_FILE_RENAME_START
  payload: { fileIndex: number }
}

// rename
export function renameStartAction(fileIndex: number): IRenameStartAction {
  return {
    type: DRIVE_FILE_RENAME_START,
    payload: { fileIndex: fileIndex }
  }
}

interface IRenameCancelAction {
  type: typeof DRIVE_FILE_RENAME_CANCEL
  payload: { fileIndex: number }
}

// rename
export function renameCancelAction(fileIndex: number): IRenameCancelAction {
  return {
    type: DRIVE_FILE_RENAME_CANCEL,
    payload: { fileIndex: fileIndex }
  }
}

interface IRenameTempSetAction {
  type: typeof DRIVE_FILE_RENAME_TEMP_SET
  payload: {
    fileIndex: number
    tempName: string
  }
}

// rename
export function renameTempSetAction(
  fileIndex: number,
  tempName: string
): IRenameTempSetAction {
  return {
    type: DRIVE_FILE_RENAME_TEMP_SET,
    payload: { fileIndex, tempName }
  }
}

interface IRenameLoadingAction {
  type: typeof DRIVE_FILE_RENAME_LOADING
  payload: { fileIndex: number }
}

interface IRenameSuccessAction {
  type: typeof DRIVE_FILE_RENAME_SUCCESS
  payload: { fileIndex: number }
}

interface IRenameFailAction {
  type: typeof DRIVE_FILE_RENAME_FAIL
  payload: { fileIndex: number }
}

export function renameFileApiAction(fileIndex: number) {
  return (dispatch: AsyncDispatch, getState: GetState) => {
    const { fileList, pathString } = getState().drive
    if (!fileList || !fileList[fileIndex]) return

    dispatch({
      type: DRIVE_FILE_RENAME_LOADING,
      payload: { fileIndex }
    })

    const fileRecord = fileList[fileIndex]
    const path = addFileOrFolderToPath(pathString, fileRecord.name)
    const newPath = addFileOrFolderToPath(pathString, fileRecord.renameTempName)

    moveFileDriveApi(path, newPath)
      .then(() => {
        dispatch({
          type: DRIVE_FILE_RENAME_SUCCESS,
          payload: { fileIndex }
        })
      })
      .catch((err: IDriveMoveFileApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        dispatch({
          type: DRIVE_FILE_RENAME_FAIL,
          payload: { fileIndex }
        })
        dispatch(
          showErrorToastAction({
            message: data?.drive || data?.server || message || 'Rename failed'
          })
        )
      })
  }
}

interface IDriveInfoSuccess {
  type: typeof DRIVE_INFO_SUCCESS
  payload: {
    apiKey: string
  }
}

export function getDriveInfoApiAction() {
  return (dispatch: AsyncDispatch) => {
    billingInfoApi()
      .then(data => {
        dispatch({
          type: DRIVE_INFO_SUCCESS,
          payload: {
            apiKey: data.api_key
          }
        })
      })
      .catch()
  }
}

export type IDriveAction =
  | IUploadLoadingAction
  | IUploadProgressAction
  | IUploadSuccessAction
  | IUploadFailAction
  | IFileListLoadingAction
  | IFileListSuccessAction
  | IFileListFailAction
  | IMkDirLoadingAction
  | IMkDirSuccessAction
  | IMkDirFailAction
  | IUploadClearAction
  | IDeleteFilesLoadingAction
  | IDeleteFilesSuccessAction
  | IDeleteFilesFailAction
  | IPushFolder
  | IMoveToFolder
  | IRenameStartAction
  | IRenameCancelAction
  | IRenameTempSetAction
  | IRenameLoadingAction
  | IRenameSuccessAction
  | IRenameFailAction
  | IDriveInfoSuccess
