import { privateAPICall } from './apiRequest'
import { convertErrors } from './errorResponse'
import {
  DRIVE_UPLOAD_ROUTE,
  DRIVE_FILE_LIST_ROUTE,
  DRIVE_FILE_DOWNLOAD,
  DRIVE_FILE_INFO_ROUTE,
  DRIVE_MKDIR,
  DRIVE_DELETE_FILES,
  DRIVE_FILE_MOVE,
  BILLING_INFO
} from './apiRoutes'
import { AxiosError } from 'axios'

interface IDriveFileOrFolder {
  name: string
  cid: string
  content_type: string
  size: number
}

export type IDriveUploadError = AxiosError<{
  drive?: string
  server?: string
}>

export function uploadDriveApi(
  data: FormData,
  uploadProgressFunction: (progressEvent: any) => void
) {
  return new Promise<IDriveFileOrFolder>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_UPLOAD_ROUTE, data, {
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

export type IDriveDownloadApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function downloadDriveApi(path: string) {
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

export type IDriveFileListApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function fileListDriveApi(path: string) {
  return new Promise<IDriveFileOrFolder[]>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_FILE_LIST_ROUTE, { path })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

interface IDriveFileInfo {
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

export type IDriveFileInfoApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function fileInfoDriveApi(path: string) {
  return new Promise<IDriveFileInfo>((resolve, reject) => {
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

export type IDriveMkDirApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function mkDirDriveApi(path: string) {
  return new Promise<IDriveFileOrFolder>((resolve, reject) => {
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

export type IDriveDeleteFileApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function deleteFileDriveApi(paths: string[]) {
  return new Promise<IDriveFileOrFolder>((resolve, reject) => {
    privateAPICall
      .post(DRIVE_DELETE_FILES, { paths })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IDriveMoveFileApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function moveFileDriveApi(path: string, newPath: string) {
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

interface IDriveInfoResponse {
  api_key: string
}

export type IBillingInfoApiError = AxiosError<{
  drive?: string
  server?: string
}>

export function billingInfoApi() {
  return new Promise<IDriveInfoResponse>((resolve, reject) => {
    privateAPICall
      .get(BILLING_INFO)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}
