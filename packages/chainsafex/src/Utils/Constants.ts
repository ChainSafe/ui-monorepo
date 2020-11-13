export enum CONTENT_TYPES {
  Directory = "application/chainsafe-files-directory",
  Image = "image/",
  Text = "text/plain",
  File = "",
  Pdf = "application/pdf",
}

export const getContentType = (contentType: string) => {
  if (contentType.includes(CONTENT_TYPES.Pdf)) {
    return CONTENT_TYPES.Pdf
  } else if (contentType.includes(CONTENT_TYPES.Image)) {
    return CONTENT_TYPES.Image
  } else if (contentType.includes(CONTENT_TYPES.Directory)) {
    return CONTENT_TYPES.Directory
  } else {
    return CONTENT_TYPES.File
  }
}

export const FREE_PLAN_LIMIT = 50 * 1024 * 1024 * 1024
export interface DriveFile {
  /** cid in IPFS */
  cid?: string
  /** file name */
  name?: string
  /** size in bytes */
  size?: number
  /** content type */
  content_type?: string
}
