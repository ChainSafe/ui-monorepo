import { useLocation } from "@chainsafe/common-components"
import { guessContentType } from "./contentTypeGuesser"
import { FileContentResponse } from "@chainsafe/files-api-client"
import { FileSystemItem } from "../Contexts/FilesContext"

export const centerEllipsis = (address: string, remaining = 6) => {
  if (address.length <= remaining * 2) {
    return address
  }
  return `${address.substr(0, remaining)}...${address.substr(
    address.length - remaining,
    remaining
  )}`
}

export const readFileAsync = (file: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      reader.result && resolve(reader.result as ArrayBuffer)
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file)
  })
}

export function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const parseFileContentResponse = (fcr: FileContentResponse): FileSystemItem => ({
  ...fcr,
  content_type:
    fcr.content_type !== "application/octet-stream"
      ? fcr.content_type
      : guessContentType(fcr.name),
  isFolder:
    fcr.content_type === "application/chainsafe-files-directory"
})
