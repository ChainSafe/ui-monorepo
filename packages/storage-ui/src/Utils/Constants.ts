export enum CONTENT_TYPES {
  Directory = "application/chainsafe-files-directory",
  File = "*/*",
  Image = "image/*",
  Text = "text/*",
  Markdown = "text/markdown",
  Pdf = "application/pdf",
  MP4 = "video/mp4",
  Audio = "audio/*"
}

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/"


