import React from "react"
import {
  IMenuItem,
  EditSvg,
  DeleteSvg,
  DownloadSvg,
  ExportSvg,
  ShareAltSvg,
  RecoverSvg,
  ZoomInSvg,
  EyeSvg,
  ExclamationCircleInverseSvg
} from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { FileOperation } from "../../../Contexts/types"
import { ISelectedFile } from "../../../Contexts/FileBrowserContext"
import { FileSystemItem } from "../../../Contexts/StorageContext"

export function getItemMenuOptions(params: {
  menuIconClass: string
  file: FileSystemItem
  editFile?: (item: ISelectedFile) => void
  deleteFile?: (item: ISelectedFile) => void
  downloadFile?: (item: ISelectedFile) => void
  moveFile?: (item: ISelectedFile) => void
  previewFile?: (file: FileSystemItem) => void
  viewFolder?: (item: ISelectedFile) => void
  showFileInfo?: (item: ISelectedFile) => void
  itemOperations: FileOperation[]
}
) {
  const {
    menuIconClass,
    file,
    viewFolder,
    editFile,
    deleteFile,
    downloadFile,
    moveFile,
    previewFile,
    showFileInfo,
    itemOperations
  } = params
  const item = { cid: file.cid, name: file.name }
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
      onClick: () => editFile && editFile(item)
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
      onClick: () => deleteFile && deleteFile(item)
    },
    download: {
      contents: (
        <>
          <DownloadSvg className={menuIconClass} />
          <span data-cy="menu-download">
            <Trans>Download</Trans>
          </span>
        </>
      ),
      onClick: () => downloadFile && downloadFile(item)
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
      onClick: () => moveFile && moveFile(item)
    },
    share: {
      contents: (
        <>
          <ShareAltSvg className={menuIconClass} />
          <span data-cy="menu-share">
            <Trans>Share</Trans>
          </span>
        </>
      ),
      onClick: () => console.log
    },
    info: {
      contents: (
        <>
          <ExclamationCircleInverseSvg className={menuIconClass} />
          <span data-cy="menu-info">
            <Trans>Info</Trans>
          </span>
        </>
      ),
      onClick: () => showFileInfo && showFileInfo(item)
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
      onClick: () => console.log
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
          <span data-cy="view-folder">
            <Trans>View folder</Trans>
          </span>
        </>
      ),
      onClick: () => viewFolder && viewFolder(item)
    }
  }

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  return menuItems
}
