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

export function getItemMenuOptions(params: {
  menuIconClass: string
  file: FileSystemItem
  inSharedFolder: boolean
  itemOperations: FileOperation[]
  editFile?: (item: FileSystemItem) => void
  deleteFile?: (item: FileSystemItem) => void
  downloadFile?: (item: FileSystemItem) => void
  moveFile?: (item: FileSystemItem) => void
  handleShare?: (item: FileSystemItem) => void
  recoverFile?: (item: FileSystemItem) => void
  previewFile?: (item: FileSystemItem) => void
  showFileInfo?: (item: FileSystemItem) => void
  reportFile?: (item: FileSystemItem) => void
  viewFolder?: (item: FileSystemItem) => void
}) {
  const {
    file,
    itemOperations,
    inSharedFolder,
    viewFolder,
    editFile,
    deleteFile,
    downloadFile,
    handleShare,
    moveFile,
    previewFile,
    recoverFile,
    reportFile,
    showFileInfo,
    menuIconClass
  } = params
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
      onClick: () => editFile && editFile(file)
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
      onClick: () => deleteFile && deleteFile(file)
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
      onClick: () => downloadFile && downloadFile(file)
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
      onClick: () => moveFile && moveFile(file)
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
      onClick: () => showFileInfo && showFileInfo(file)
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
      onClick: () => recoverFile && recoverFile(file)
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
      onClick: () => previewFile && previewFile(file)
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
      onClick: () => viewFolder && viewFolder(file)
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
      onClick: () => reportFile && reportFile(file)
    }
  }

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  return menuItems
}
