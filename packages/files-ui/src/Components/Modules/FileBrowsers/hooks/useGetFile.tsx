import { t } from "@lingui/macro"
import { useCallback, useRef, useState } from "react"
import { IFileSystemItem, useFiles } from "../../../../Contexts/FilesContext"
import axios, { CancelTokenSource } from "axios"
import { useFileBrowser } from "../../../../Contexts/FileBrowserContext"

export const useGetFile = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState("")
  const { getFileContent } = useFiles()
  const source = useRef<CancelTokenSource | null>(null)
  const { bucket } = useFileBrowser()

  const getFile = useCallback(async ({ file, filePath }: {file: IFileSystemItem; filePath: string}) => {
    const { cid, size } = file
    if(!bucket) return

    if (source.current) {
      source.current.cancel("Cancelling previous request")
      source.current = null
    }

    const getSource = () => {
      if (source.current === null) {
        source.current = axios.CancelToken.source()
      }
      return source.current
    }

    const cancelToken = getSource().token
    setIsDownloading(true)
    setError("")

    try {
      const content = await getFileContent(
        bucket?.id,
        {
          cid,
          cancelToken,
          onDownloadProgress: (evt) => {
            setDownloadProgress((evt.loaded / size) * 100)
          },
          file,
          path: filePath
        })

      source.current = null
      setDownloadProgress(0)

      setIsDownloading(false)
      return content

    } catch (error) {
      setIsDownloading(false)

      // If no error is thrown, this was due to a cancellation by the user.
      if (error) {
        console.error(error)
        setError(t`There was an error getting the preview.`)
      }
    }


  }, [bucket, getFileContent])

  return { getFile, isDownloading, error, downloadProgress }
}