import { AsyncDispatch } from '../../store'
import { Dispatch } from 'redux'
import {
  uploadBulkFpsApi,
  IFpsUploadError,
  fileListFpsApi,
  IFpsFileListApiError,
  deleteFileFpsApi,
  IFpsDeleteFileApiError,
  moveFileFpsApi,
  IFpsMoveFileApiError,
  getFpsNotificationsApi
} from '../../../apiLib/fpsApi'
import { handleApiErr } from '../../../apiLib/errorResponse'
import { IFpsFileOrFolder, INotification } from '../../../types/fps'
import { GetState } from '../../store'
import { addFileOrFolderToPath } from 'src/util/helpers'
import { showErrorToastAction } from '../toast/actionCreators'

export const FPS_UPLOAD_LOADING = '@@imploy/fps/upload_loading'
export const FPS_UPLOAD_PROGRESS = '@@imploy/fps/upload_progress'
export const FPS_UPLOAD_SUCCESS = '@@imploy/fps/upload_success'
export const FPS_UPLOAD_FAIL = '@@imploy/fps/upload_fail'
export const FPS_UPLOAD_CLEAR = '@@imploy/fps/upload_clear'

export const FPS_FILE_LIST_LOADING = '@@imploy/fps/file_list_loading'
export const FPS_FILE_LIST_SUCCESS = '@@imploy/fps/file_list_success'
export const FPS_FILE_LIST_FAIL = '@@imploy/fps/file_list_fail'

export const FPS_FILE_INFO_LOADING = '@@imploy/fps/file_info'
export const FPS_FILE_INFO_SUCCESS = '@@imploy/fps/file_info_success'
export const FPS_FILE_INFO_FAIL = '@@imploy/fps/file_info_fail'

export const FPS_DELETE_FILES_LOADING = '@@imploy/fps/delete_files_loading'
export const FPS_DELETE_FILES_SUCCESS = '@@imploy/fps/delete_files_success'
export const FPS_DELETE_FILES_FAIL = '@@imploy/fps/delete_files_fail'

export const FPS_FILE_RENAME_START = '@@imploy/fps/file_rename_start'
export const FPS_FILE_RENAME_CANCEL = '@@imploy/fps/file_rename_cancel'
export const FPS_FILE_RENAME_TEMP_SET = '@@imploy/fps/file_rename_temp_set'
export const FPS_FILE_RENAME_LOADING = '@@imploy/fps/file_rename_loading'
export const FPS_FILE_RENAME_SUCCESS = '@@imploy/fps/file_rename_success'
export const FPS_FILE_RENAME_FAIL = '@@imploy/fps/file_rename_fail'

export const FPS_NOTIFICATION_FETCH_SUCCESS =
  '@@files/profile/notification_success'

interface IUploadLoadingAction {
  type: typeof FPS_UPLOAD_LOADING
}

interface IUploadProgressAction {
  type: typeof FPS_UPLOAD_PROGRESS
  payload: number
}

interface IUploadSuccessAction {
  type: typeof FPS_UPLOAD_SUCCESS
}

interface IUploadFailAction {
  type: typeof FPS_UPLOAD_FAIL
  payload: string
}

interface IUploadClearAction {
  type: typeof FPS_UPLOAD_CLEAR
}

export function clearFpsUploadFlagsAction() {
  return {
    type: FPS_UPLOAD_CLEAR
  }
}

// auth
export function uploadFpsApiAction(
  formData: FormData,
  onSuccess?: Function,
  onFail?: Function
) {
  return async (dispatch: AsyncDispatch, getState: GetState) => {
    const { pathString } = getState().fps
    const finalFormData = formData
    finalFormData.append('path', pathString)

    dispatch({ type: FPS_UPLOAD_LOADING })
    uploadBulkFpsApi(finalFormData, (progressEvent: any) => {
      dispatch({
        type: FPS_UPLOAD_PROGRESS,
        payload: Math.floor((progressEvent.loaded / progressEvent.total) * 100)
      })
    })
      .then(() => {
        dispatch({ type: FPS_UPLOAD_SUCCESS })
        dispatch(getFpsFileListApiAction())
        if (onSuccess) onSuccess()
      })
      .catch((err: IFpsUploadError) => {
        const { data, message } = handleApiErr(err, dispatch)
        dispatch({
          type: FPS_UPLOAD_FAIL,
          payload: data ? data.drive || data.server : message || 'Upload failed'
        })
        if (onFail) onFail()
      })
  }
}

interface IFileListLoadingAction {
  type: typeof FPS_FILE_LIST_LOADING
}

interface IFileListSuccessAction {
  type: typeof FPS_FILE_LIST_SUCCESS
  payload: IFpsFileOrFolder[]
}

interface IFileListFailAction {
  type: typeof FPS_FILE_LIST_FAIL
  payload: string
}

// auth
export function getFpsFileListApiAction() {
  return async (dispatch: Dispatch, getState: GetState) => {
    const { pathString } = getState().fps
    dispatch({ type: FPS_FILE_LIST_LOADING })
    fileListFpsApi(pathString)
      .then(newFileList => {
        dispatch({
          type: FPS_FILE_LIST_SUCCESS,
          payload: newFileList
        })
      })
      .catch((err: IFpsFileListApiError) => {
        const { data, message } = handleApiErr(err, dispatch)
        const error =
          data?.drive || data?.server || message || 'Something went wrong'
        dispatch({
          type: FPS_FILE_LIST_FAIL,
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

export function pollFpsFileListApiAction() {
  return async (dispatch: Dispatch, getState: GetState) => {
    const { pathString } = getState().fps
    fileListFpsApi(pathString)
      .then(newFileList => {
        dispatch({
          type: FPS_FILE_LIST_SUCCESS,
          payload: newFileList
        })
      })
      .catch((err: IFpsFileListApiError) => {
        const { data, message } = handleApiErr(err, dispatch)
        const error =
          data?.drive || data?.server || message || 'Something went wrong'
        dispatch({
          type: FPS_FILE_LIST_FAIL,
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

interface IDeleteFilesLoadingAction {
  type: typeof FPS_DELETE_FILES_LOADING
  payload: {
    indexes: number[]
  }
}

interface IDeleteFilesSuccessAction {
  type: typeof FPS_DELETE_FILES_SUCCESS
  payload: {
    indexes: number[]
  }
}

interface IDeleteFilesFailAction {
  type: typeof FPS_DELETE_FILES_FAIL
  payload: {
    indexes: number[]
    error: string
  }
}

export function deleteFpsFilesApiAction(
  fileIndexes: number[],
  onSuccess?: Function,
  onFail?: Function
) {
  return async (dispatch: AsyncDispatch, getState: GetState) => {
    const { pathString, fileList } = getState().fps
    if (fileList) {
      const filePaths = fileIndexes.map(fileIndex =>
        addFileOrFolderToPath(pathString, fileList[fileIndex].name)
      )

      dispatch({
        type: FPS_DELETE_FILES_LOADING,
        payload: {
          indexes: fileIndexes
        }
      })

      deleteFileFpsApi(filePaths)
        .then(() => {
          dispatch({
            type: FPS_DELETE_FILES_SUCCESS,
            payload: {
              indexes: fileIndexes
            }
          })
          dispatch(getFpsFileListApiAction())
          if (onSuccess) onSuccess()
        })
        .catch((err: IFpsDeleteFileApiError) => {
          const { data, message } = handleApiErr(err, dispatch)

          const error =
            (data ? data.drive || data.server : message) ||
            'Something went wrong'
          if (onFail) onFail()

          dispatch({
            type: FPS_DELETE_FILES_FAIL,
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

interface IRenameStartAction {
  type: typeof FPS_FILE_RENAME_START
  payload: { fileIndex: number }
}

// rename
export function renameFpsStartAction(fileIndex: number): IRenameStartAction {
  return {
    type: FPS_FILE_RENAME_START,
    payload: { fileIndex: fileIndex }
  }
}

interface IRenameCancelAction {
  type: typeof FPS_FILE_RENAME_CANCEL
  payload: { fileIndex: number }
}

// rename
export function renameFpsCancelAction(fileIndex: number): IRenameCancelAction {
  return {
    type: FPS_FILE_RENAME_CANCEL,
    payload: { fileIndex: fileIndex }
  }
}

interface IRenameTempSetAction {
  type: typeof FPS_FILE_RENAME_TEMP_SET
  payload: {
    fileIndex: number
    tempName: string
  }
}

// rename
export function renameFpsTempSetAction(
  fileIndex: number,
  tempName: string
): IRenameTempSetAction {
  return {
    type: FPS_FILE_RENAME_TEMP_SET,
    payload: { fileIndex, tempName }
  }
}

interface IRenameLoadingAction {
  type: typeof FPS_FILE_RENAME_LOADING
  payload: { fileIndex: number }
}

interface IRenameSuccessAction {
  type: typeof FPS_FILE_RENAME_SUCCESS
  payload: { fileIndex: number }
}

interface IRenameFailAction {
  type: typeof FPS_FILE_RENAME_FAIL
  payload: { fileIndex: number }
}

export function renameFpsFileApiAction(fileIndex: number) {
  return (dispatch: AsyncDispatch, getState: GetState) => {
    const { fileList, pathString } = getState().drive
    if (!fileList || !fileList[fileIndex]) return

    dispatch({
      type: FPS_FILE_RENAME_LOADING,
      payload: { fileIndex }
    })

    const fileRecord = fileList[fileIndex]
    const path = addFileOrFolderToPath(pathString, fileRecord.name)
    const newPath = addFileOrFolderToPath(pathString, fileRecord.renameTempName)

    moveFileFpsApi(path, newPath)
      .then(() => {
        dispatch({
          type: FPS_FILE_RENAME_SUCCESS,
          payload: { fileIndex }
        })
      })
      .catch((err: IFpsMoveFileApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        dispatch({
          type: FPS_FILE_RENAME_FAIL,
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

interface IGetNotificationsAction {
  type: typeof FPS_NOTIFICATION_FETCH_SUCCESS
  payload: INotification[] | null
}

export function getFpsNotificationApiAction() {
  return (dispatch: AsyncDispatch) => {
    getFpsNotificationsApi()
      .then(data => {
        dispatch({
          type: FPS_NOTIFICATION_FETCH_SUCCESS,
          payload: data
        })
      })
      .catch()
  }
}

export type IFpsAction =
  | IUploadLoadingAction
  | IUploadProgressAction
  | IUploadSuccessAction
  | IUploadFailAction
  | IFileListLoadingAction
  | IFileListSuccessAction
  | IFileListFailAction
  | IUploadClearAction
  | IDeleteFilesLoadingAction
  | IDeleteFilesSuccessAction
  | IDeleteFilesFailAction
  | IRenameStartAction
  | IRenameCancelAction
  | IRenameTempSetAction
  | IRenameLoadingAction
  | IRenameSuccessAction
  | IRenameFailAction
  | IGetNotificationsAction
