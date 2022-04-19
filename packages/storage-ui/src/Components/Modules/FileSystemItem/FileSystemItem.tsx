import React, { useCallback, useEffect, useMemo, useRef } from "react"
import {
  FormikTextInput,
  Typography,
  Button,
  FileImageSvg,
  FilePdfSvg,
  FileTextSvg,
  FolderFilledSvg,
  DownloadSvg,
  DeleteSvg,
  EditSvg,
  IMenuItem,
  RecoverSvg,
  EyeSvg,
  ExportSvg,
  ShareAltSvg,
  ExclamationCircleInverseSvg,
  ZoomInSvg } from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import { Form, useFormik, FormikProvider } from "formik"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { getEmptyImage, NativeTypes } from "react-dnd-html5-backend"
import { CSSTheme } from "../../../Themes/types"
import FileItemTableItem from "./FileSystemTableItem"
import FileItemGridItem from "./FileSystemGridItem"
import { FileSystemItem as FileSystemItemType } from "../../../Contexts/StorageContext"
import { ISelectedFile, useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { BrowserView, FileOperation } from "../../../Contexts/types"
import { DragTypes } from "../FilesList/DragConstants"
import { nameValidator } from "../../../Utils/validationSchema"
import { getPathWithFile } from "../../../Utils/pathUtils"
import { getIconForItem } from "../../../Utils/getItemIcon"

const useStyles = makeStyles(({ breakpoints, constants }: CSSTheme) => {
  return createStyles({
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0
      },
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`
      }
    },
    modalRoot: {
      [breakpoints.down("md")]: {}
    },
    modalInner: {
      [breakpoints.down("md")]: {
        bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    renameHeader: {
      textAlign: "center"
    },
    renameFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    renameModal: {
      padding: constants.generalUnit * 4
    },
    okButton: {
      marginLeft: constants.generalUnit
    },
    cancelButton: {
      [breakpoints.down("md")]: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: constants?.mobileButtonHeight
      }
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      "& svg": {
        fill: constants.fileSystemItemRow.menuIcon
      }
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    }
  })
})

interface IFileSystemItemProps {
  index: number
  file: FileSystemItemType
  files: FileSystemItemType[]
  selected: ISelectedFile[]
  handleSelectCid(selectedFile: ISelectedFile): void
  handleAddToSelectedCids(selectedFile: ISelectedFile): void
  editingFile?: ISelectedFile
  setEditingFile(editingFile: ISelectedFile | undefined): void
  handleRename?: (item: ISelectedFile, newName: string) => Promise<void> | undefined
  handleMove?: (toMove: ISelectedFile, newPath: string) => Promise<void>
  deleteFile?: () => void
  recoverFile?: (toRecover: ISelectedFile) => void
  viewFolder?: (toView: ISelectedFile) => void
  setPreviewFileIndex: (fileIndex: number | undefined) => void
  moveFile?: () => void
  setFileInfoPath: (path: string) => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
}

const FileSystemItem = ({
  file,
  files,
  selected,
  editingFile,
  setEditingFile,
  handleRename,
  deleteFile,
  recoverFile,
  viewFolder,
  setPreviewFileIndex,
  moveFile,
  setFileInfoPath,
  handleSelectCid,
  handleAddToSelectedCids,
  itemOperations,
  browserView,
  resetSelectedFiles
}: IFileSystemItemProps) => {
  const { downloadFile, currentPath, handleUploadOnDrop, moveItems } = useFileBrowser()
  const { cid, name, isFolder } = file

  const { desktop } = useThemeSwitcher()
  const classes = useStyles()

  const {
    fileName,
    extension
  } = useMemo(() => {
    if (isFolder) {
      return {
        fileName : name,
        extension: ""
      }
    }
    const split = name.split(".")
    const extension = `.${split[split.length - 1]}`

    if (split.length === 1) {
      return {
        fileName : name,
        extension: ""
      }
    }

    return {
      fileName: name.slice(0, name.length - extension.length),
      extension: split[split.length - 1]
    }
  }, [name, isFolder])

  const formik = useFormik({
    initialValues: { name: fileName },
    validationSchema: nameValidator,
    onSubmit: (values: { name: string }) => {
      const newName = extension !== "" ? `${values.name.trim()}.${extension}` : values.name.trim()

      editingFile && newName && handleRename && handleRename(editingFile, newName)
    },
    enableReinitialize: true
  })

  const allMenuItems: Record<FileOperation, IMenuItem> = {
    rename: {
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setEditingFile({ cid, name })
    },
    delete: {
      contents: (
        <>
          <DeleteSvg className={classes.menuIcon} />
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
          <DownloadSvg className={classes.menuIcon} />
          <span data-cy="menu-download">
            <Trans>Download</Trans>
          </span>
        </>
      ),
      onClick: () => downloadFile && downloadFile({
        cid,
        name
      })
    },
    move: {
      contents: (
        <>
          <ExportSvg className={classes.menuIcon} />
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
          <ShareAltSvg className={classes.menuIcon} />
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
          <ExclamationCircleInverseSvg className={classes.menuIcon} />
          <span data-cy="menu-info">
            <Trans>Info</Trans>
          </span>
        </>
      ),
      onClick: () => setFileInfoPath(getPathWithFile(currentPath, name))
    },
    recover: {
      contents: (
        <>
          <RecoverSvg className={classes.menuIcon} />
          <span data-cy="menu-recover">
            <Trans>Recover</Trans>
          </span>
        </>
      ),
      onClick: () => recoverFile && recoverFile({
        cid,
        name
      })
    },
    preview: {
      contents: (
        <>
          <ZoomInSvg className={classes.menuIcon} />
          <span data-cy="menu-preview">
            <Trans>Preview</Trans>
          </span>
        </>
      ),
      onClick: () => setPreviewFileIndex(files?.indexOf(file))
    },
    view_folder: {
      contents: (
        <>
          <EyeSvg className={classes.menuIcon} />
          <span data-cy="view-folder">
            <Trans>View folder</Trans>
          </span>
        </>
      ),
      onClick: () => viewFolder && viewFolder({
        cid,
        name
      })
    }
  }

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  const [, dragMoveRef, preview] = useDrag(() =>
    ({ type: DragTypes.MOVABLE_FILE,
      item: () => {
        if (selected.findIndex(item => item.cid === file.cid && item.name === file.name) >= 0) {
          return { selected: selected }
        } else {
          return { selected: [...selected, {
            cid: file.cid,
            name: file.name
          }] }
        }
      }
    }), [selected])

  useEffect(() => {
    // This gets called after every render, by default

    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    preview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    })
  })

  const [{ isOverMove }, dropMoveRef] = useDrop({
    accept: DragTypes.MOVABLE_FILE,
    canDrop: () => isFolder,
    drop: (item: {selected: ISelectedFile[]}) => {
      moveItems && moveItems(item.selected, getPathWithFile(currentPath, name))
    },
    collect: (monitor) => ({
      isOverMove: monitor.isOver()
    })
  })

  const [{ isOverUpload }, dropUploadRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any) => {
      handleUploadOnDrop &&
        handleUploadOnDrop(item.files, item.items, getPathWithFile(currentPath, name))
    },
    collect: (monitor) => ({
      isOverUpload: monitor.isOver()
    })
  })

  const fileOrFolderRef = useRef<any>()

  if (!editingFile && isFolder) {
    dropMoveRef(fileOrFolderRef)
    dropUploadRef(fileOrFolderRef)
  }
  if (!editingFile && !isFolder) {
    dragMoveRef(fileOrFolderRef)
  }

  const onFilePreview = useCallback(() => {
    setPreviewFileIndex(files?.indexOf(file))
  }, [file, files, setPreviewFileIndex])

  const onSingleClick = useCallback(
    (e) => {
      if (desktop) {
        // on desktop 
        if (e && (e.ctrlKey || e.metaKey)) {
          handleAddToSelectedCids({
            cid,
            name
          })
        } else {
          handleSelectCid({
            cid,
            name
          })
        }
      } else {
        // on mobile
        if (isFolder) {
          viewFolder && viewFolder({
            cid,
            name
          })
        } else {
          onFilePreview()
        }
      }
    },
    [cid, handleSelectCid, handleAddToSelectedCids, desktop, isFolder, viewFolder, name, onFilePreview]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
        if (isFolder) {
          viewFolder && viewFolder({
            cid,
            name
          })
        } else {
          onFilePreview()
        }
      } else {
        // on mobile
        return
      }
    },
    [desktop, viewFolder, name, cid, onFilePreview, isFolder]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderOrFileClicks = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  const Icon = getIconForItem(file)

  const itemProps = {
    ref: fileOrFolderRef,
    currentPath,
    editingFile,
    file,
    handleAddToSelectedCids,
    handleRename,
    icon: <Icon />,
    isFolder,
    isOverMove,
    isOverUpload,
    menuItems,
    onFolderOrFileClicks,
    preview,
    selected,
    setEditingFile,
    resetSelectedFiles
  }

  return (
    <>
      {
        browserView === "table"
          ? <FileItemTableItem {...itemProps} />
          : <FileItemGridItem {...itemProps} />
      }
      {
        editingFile?.cid === cid && editingFile?.name === name && !desktop && (
          <>
            <CustomModal
              className={classes.modalRoot}
              injectedClass={{
                inner: classes.modalInner
              }}
              closePosition="none"
              onClose={() => setEditingFile(undefined)}
            >
              <FormikProvider value={formik}>
                <Form className={classes.renameModal}>
                  <Typography
                    className={classes.renameHeader}
                    component="p"
                    variant="h5"
                  >{
                      isFolder
                        ? <Trans>Rename folder</Trans>
                        : <Trans>Rename file</Trans>
                    }
                  </Typography>
                  <FormikTextInput
                    label="Name"
                    className={classes.renameInput}
                    name="name"
                    placeholder={isFolder ? t`Please enter a folder name` : t`Please enter a file name`}
                    autoFocus
                  />
                  <footer className={classes.renameFooter}>
                    <Button
                      onClick={() => setEditingFile(undefined)}
                      size="medium"
                      className={classes.cancelButton}
                      variant="outline"
                      type="button"
                    >
                      <Trans>Cancel</Trans>
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      type="submit"
                      className={classes.okButton}
                      disabled={!formik.dirty}
                    >
                      <Trans>Update</Trans>
                    </Button>
                  </footer>
                </Form>
              </FormikProvider>
            </CustomModal>
            <Typography>{name}</Typography>
          </>
        )
      }
    </>
  )
}

export default FileSystemItem
