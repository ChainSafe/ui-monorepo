import React from "react"
import {
  IMenuItem,
  EditSvg,
  DeleteSvg,
  DownloadSvg,
  ExportSvg,
  ShareAltSvg,
  InfoCircleSvg,
  RecoverSvg,
  ZoomInSvg,
  EyeSvg,
  ExclamationCircleInverseSvg
} from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import { FileOperation } from "../../types"
import { FileSystemItem } from "../../../../../Contexts/FilesContext"
import { getPathWithFile } from "../../../../../Utils/pathUtils"

export function getItemMenuOptions(
  menuIconClass: string,
  file: FileSystemItem,
  fileIndex: number,
  currentPath: string,
  inSharedFolder: boolean,
  functions: {
    setEditing?: (cid: string) => void
    deleteFile?: () => void
    downloadFile?: () => void
    moveFile?: () => void
    handleShare?: (item: FileSystemItem) => void
    recoverFile?: () => void
    onFilePreview?: (fileIndex: number) => void
    viewFolder?: (cid: string) => void
    showFileInfo?: (filePath: string) => void
    reportFile?: (filePath: string) => void
  },
  itemOperations: FileOperation[]
) {
  const { name, cid } = file
  const filePath = getPathWithFile(currentPath, name)
  const {
    viewFolder,
    setEditing,
    deleteFile,
    downloadFile,
    handleShare,
    moveFile,
    onFilePreview,
    recoverFile,
    reportFile,
    showFileInfo
  } = functions
  const allMenuItems: Record<FileOperation, IMenuItem> = {
    rename: {
      contents: (
        <>
          <EditSvg className={menuIconClass} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setEditing && setEditing(cid)
    },
    delete: {
      contents: (
        <>
          <DeleteSvg className={menuIconClass} />
          <span data-cy="menu-delete">
            <Trans>Delete</Trans>
          </span>
        </>
      ),
      onClick: () => deleteFile && deleteFile()
    },
    download: {
      contents: (
        <>
          <DownloadSvg className={menuIconClass} />
          <span data-cy="menu-download">
            {file.isFolder ? <Trans>Download as zip</Trans> : <Trans>Download</Trans>}
          </span>
        </>
      ),
      onClick: () => downloadFile && downloadFile()
    },
    move: {
      contents: (
        <>
          <ExportSvg className={menuIconClass} />
          <span data-cy="menu-move">
            <Trans>Move</Trans>
          </span>
        </>
      ),
      onClick: () => moveFile && moveFile()
    },
    share: {
      contents: (
        <>
          <ShareAltSvg className={menuIconClass} />
          <span data-cy="menu-share">
            {inSharedFolder
              ? t`Copy to`
              : t`Share`
            }
          </span>
        </>
      ),
      onClick: () => handleShare && handleShare(file)
    },
    info: {
      contents: (
        <>
          <InfoCircleSvg className={menuIconClass} />
          <span data-cy="menu-info">
            <Trans>Info</Trans>
          </span>
        </>
      ),
      onClick: () => showFileInfo && showFileInfo(filePath)
    },
    recover: {
      contents: (
        <>
          <RecoverSvg className={menuIconClass} />
          <span data-cy="menu-recover">
            <Trans>Recover</Trans>
          </span>
        </>
      ),
      onClick: () => recoverFile && recoverFile()
    },
    preview: {
      contents: (
        <>
          <ZoomInSvg className={menuIconClass} />
          <span data-cy="menu-preview">
            <Trans>Preview</Trans>
          </span>
        </>
      ),
      onClick: () => onFilePreview && onFilePreview(fileIndex)
    },
    view_folder: {
      contents: (
        <>
          <EyeSvg className={menuIconClass} />
          <span data-cy="menu-view-folder">
            <Trans>View folder</Trans>
          </span>
        </>
      ),
      onClick: () => viewFolder && viewFolder(cid)
    },
    report: {
      contents: (
        <>
          <ExclamationCircleInverseSvg className={menuIconClass} />
          <span data-cy="menu-report">
            <Trans>Report</Trans>
          </span>
        </>
      ),
      onClick: () => reportFile && reportFile(filePath)
    }
  }

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  return menuItems
}
