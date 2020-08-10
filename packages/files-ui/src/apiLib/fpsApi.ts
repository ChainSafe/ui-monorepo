import { privateAPICall } from './apiRequest'
import { convertErrors } from './errorResponse'
import {
  FPS_UPLOAD_BULK_ROUTE,
  DRIVE_FILE_LIST_ROUTE,
  DRIVE_FILE_DOWNLOAD,
  DRIVE_FILE_INFO_ROUTE,
  DRIVE_MKDIR,
  DRIVE_DELETE_FILES,
  DRIVE_FILE_MOVE,
  FPS_NOTIFICATION_ROUTE
} from './apiRoutes'
import { AxiosError } from 'axios'

interface IFpsFileOrFolder {
  name: string
  cid: string
  content_type: string
  size: number
}

export type IFpsUploadError = AxiosError<{
  drive?: string
  server?: string
}>

export function uploadBulkFpsApi(
  data: FormData,
  uploadProgressFunction: (progressEvent: any) => void
) {
  return new Promise<IFpsFileOrFolder>((resolve, reject) => {
    privateAPICall
      .post(FPS_UPLOAD_BULK_ROUTE, data, {
        onUploadProgress: uploadProgressFunction
      })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IFpsDownloadApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function downloadFpsApi(path: string) {
  return new Promise<Blob>((resolve, reject) => {
    privateAPICall({
      url: DRIVE_FILE_DOWNLOAD,
      method: 'POST',
      data: { path },
      responseType: 'blob'
    })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IFpsFileListApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function fileListFpsApi(path: string) {
  return new Promise<IFpsFileOrFolder[]>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_FILE_LIST_ROUTE, { path, source: 'fps' })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

interface IFpsFileInfo {
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

export type IFpsFileInfoApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function fileInfoFpsApi(path: string) {
  return new Promise<IFpsFileInfo>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_FILE_INFO_ROUTE, { path })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IFpsMkDirApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function mkDirFpsApi(path: string) {
  return new Promise<IFpsFileOrFolder>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_MKDIR, { path })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IFpsDeleteFileApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function deleteFileFpsApi(paths: string[]) {
  return new Promise<IFpsFileOrFolder>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_DELETE_FILES, { paths, source: 'fps' })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IFpsMoveFileApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function moveFileFpsApi(path: string, newPath: string) {
  return new Promise((resolve, reject) => {
    privateAPICall
      .post(DRIVE_FILE_MOVE, { path, new_path: newPath })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

interface INotification {
  id: string
  filename: string
  cid: string
  message: string
}

export type IFpsNotificationApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function getFpsNotificationsApi() {
  return new Promise<INotification[]>((resolve, reject) => {
    privateAPICall
      .get(FPS_NOTIFICATION_ROUTE)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}
