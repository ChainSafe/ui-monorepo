import React, { useCallback, useEffect, useRef } from "react"
import {
  FormikTextInput,
  Typography,
  Button,
  DownloadSvg,
  DeleteSvg,
  EditSvg,
  IMenuItem,
  RecoverSvg,
  EyeSvg,
  ExportSvg,
  ShareAltSvg,
  ExclamationCircleInverseSvg,
  ZoomInSvg,
  InfoCircleSvg
} from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher, useLongPress } from "@chainsafe/common-theme"
import { Form, FormikProvider, useFormik } from "formik"
import CustomModal from "../../../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "../../DragConstants"
import { getEmptyImage, NativeTypes } from "react-dnd-html5-backend"
import { BrowserView, FileOperation } from "../../types"
import { CSFTheme } from "../../../../../Themes/types"
import FileItemTableItem from "./FileSystemTableItem"
import FileItemGridItem from "./FileSystemGridItem"
import { FileSystemItem as FileSystemItemType, useFiles } from "../../../../../Contexts/FilesContext"
import { useFileBrowser } from "../../../../../Contexts/FileBrowserContext"
import { getPathWithFile } from "../../../../../Utils/pathUtils"
import { BucketUser } from "@chainsafe/files-api-client"
import { useMemo } from "react"
import { nameValidator } from "../../../../../Utils/validationSchema"
import CustomButton from "../../../../Elements/CustomButton"
import { getIconForItem } from "../../../../../Utils/getItemIcon"

const useStyles = makeStyles(({ breakpoints, constants }: CSFTheme) => {
  return createStyles({
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0
      }
    },
    modalRoot: {
      [breakpoints.down("md")]: {
        paddingBottom: Number(constants?.mobileButtonHeight)
      }
    },
    modalInner: {
      [breakpoints.down("md")]: {
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    renameModal: {
      padding: constants.generalUnit * 4
    },
    renameHeader: {
      textAlign: "center"
    },
    renameInputWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`
      },
      "& > span": {
        display: "block",
        fontSize: 16,
        lineHeight: "20px",
        marginLeft: constants.generalUnit / 2,
        marginBottom: (constants.generalUnit * 2.50),
        transform: "translateY(50%)"
      }
    },
    renameFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    okButton: {
      marginLeft: constants.generalUnit
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      fill: constants.fileSystemItemRow.menuIcon
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    }
  })
})

interface IFileSystemItemProps {
  file: FileSystemItemType
  files: FileSystemItemType[]
  selectedCids: string[]
  owners?: BucketUser[]
  handleSelectItem(selectedItem: FileSystemItemType): void
  handleAddToSelectedItems(selectedItems: FileSystemItemType): void
  editing: string | undefined
  setEditing(editing: string | undefined): void
  handleRename?: (cid: string, newName: string) => Promise<void> | undefined
  handleMove?: (cid: string, newPath: string) => Promise<void>
  deleteFile?: () => void
  recoverFile?: () => void
  viewFolder?: (cid: string) => void
  moveFile?: () => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
  reportFile?: (path: string) => void
  showFileInfo?: (path: string) => void
  handleShare?: (file: FileSystemItemType) => void
  showPreview?: (fileIndex: number) => void
}

const FileSystemItem = ({
  file,
  files,
  selectedCids,
  owners,
  editing,
  setEditing,
  handleRename,
  deleteFile,
  recoverFile,
  viewFolder,
  moveFile,
  handleSelectItem,
  handleAddToSelectedItems,
  itemOperations,
  browserView,
  resetSelectedFiles,
  reportFile,
  showFileInfo,
  handleShare,
  showPreview
}: IFileSystemItemProps) => {
  const { bucket, downloadFile, currentPath, handleUploadOnDrop, moveItems } = useFileBrowser()
  const { downloadMultipleFiles } = useFiles()
  const { cid, name, isFolder } = file
  const inSharedFolder = useMemo(() => bucket?.type === "share", [bucket])

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
    initialValues: {
      name: fileName
    },
    validationSchema: nameValidator,
    onSubmit: (values: { name: string }) => {
      const newName = extension !== "" ? `${values.name.trim()}.${extension}` : values.name.trim()

      if (newName !== name) {
        newName && handleRename && handleRename(file.cid, newName)
      } else {
        stopEditing()
      }
    },
    enableReinitialize: true
  })

  const stopEditing = useCallback(() => {
    setEditing(undefined)
    formik.resetForm()
  }, [formik, setEditing])

  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const filePath = useMemo(() => getPathWithFile(currentPath, name), [currentPath, name])

  const onFilePreview = useCallback(() => {
    showPreview && showPreview(files.indexOf(file))
  }, [file, files, showPreview])

  const allMenuItems: Record<FileOperation, IMenuItem> = useMemo(() => ({
    rename: {
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setEditing(cid)
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
            {file.isFolder ? <Trans>Download as zip</Trans> : <Trans>Download</Trans>}
          </span>
        </>
      ),
      onClick: () => {
        if (file.isFolder) {
          bucket && downloadMultipleFiles([file], currentPath, bucket.id)
        } else {
          downloadFile && downloadFile(cid)
        }
      }
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
          <InfoCircleSvg className={classes.menuIcon} />
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
          <RecoverSvg className={classes.menuIcon} />
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
          <ZoomInSvg className={classes.menuIcon} />
          <span data-cy="menu-preview">
            <Trans>Preview</Trans>
          </span>
        </>
      ),
      onClick: () => onFilePreview()
    },
    view_folder: {
      contents: (
        <>
          <EyeSvg className={classes.menuIcon} />
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
          <ExclamationCircleInverseSvg className={classes.menuIcon} />
          <span data-cy="menu-report">
            <Trans>Report</Trans>
          </span>
        </>
      ),
      onClick: () => reportFile && reportFile(filePath)
    }
  }),
  [
    classes.menuIcon,
    file,
    setEditing,
    cid,
    deleteFile,
    bucket,
    downloadMultipleFiles,
    currentPath,
    downloadFile,
    moveFile,
    handleShare,
    filePath,
    showFileInfo,
    recoverFile,
    onFilePreview,
    viewFolder,
    reportFile,
    inSharedFolder
  ])

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  const [, dragMoveRef, preview] = useDrag({
    type: DragTypes.MOVABLE_FILE,
    canDrag: !editing,
    item: () => {
      if (selectedCids.includes(file.cid)) {
        return { ids: selectedCids }
      } else {
        return { ids: [...selectedCids, file.cid] }
      }
    }
  })

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
    canDrop: (item) => isFolder && !item.ids.includes(file.cid),
    drop: (item: { ids: string[]}) => {
      moveItems && moveItems(item.ids, getPathWithFile(currentPath, name))
    },
    collect: (monitor) => ({
      isOverMove: monitor.isOver() && !monitor.getItem<{ids: string[]}>().ids.includes(file.cid)
    })
  })

  const [{ isOverUpload }, dropUploadRef] = useDrop({
    accept: [NativeTypes.FILE],
    canDrop: () => isFolder,
    drop: (item: any) => {
      handleUploadOnDrop &&
        handleUploadOnDrop(item.files, item.items, getPathWithFile(currentPath, name))
    },
    collect: (monitor) => ({
      isOverUpload: monitor.isOver()
    })
  })

  const fileOrFolderRef = useRef<any>()

  if (fileOrFolderRef?.current) {
    if (editing) {
      fileOrFolderRef.current.draggable = false
    } else {
      fileOrFolderRef.current.draggable = true
    }
  }

  if (!editing && desktop) {
    dragMoveRef(fileOrFolderRef)
    if (isFolder) {
      dropMoveRef(fileOrFolderRef)
      dropUploadRef(fileOrFolderRef)
    }
  }

  const onSingleClick = useCallback(
    (e) => {
      if (desktop) {
        // on desktop 
        if (e && (e.ctrlKey || e.metaKey)) {
          handleAddToSelectedItems(file)
        } else {
          handleSelectItem(file)
        }
      } else {
        // on mobile
        if (selectedCids.length) {
          handleAddToSelectedItems(file)
        } else {
          if (isFolder) {
            viewFolder && viewFolder(file.cid)
          } else {
            onFilePreview()
          }
        }
      }
    },
    [desktop, handleAddToSelectedItems, file, handleSelectItem, isFolder, viewFolder, onFilePreview, selectedCids.length]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
        if (isFolder) {
          viewFolder && viewFolder(file.cid)
        } else {
          onFilePreview()
        }
      } else {
        // on mobile
        return
      }
    },
    [desktop, viewFolder, file, onFilePreview, isFolder]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const longPressEvents = useLongPress(() => handleSelectItem(file), onSingleClick)

  const onFolderOrFileClicks = (e?: React.MouseEvent) => {
    e?.persist()
    if (!desktop) {
      return null
    } else {
      click(e)
    }
  }

  const Icon = getIconForItem(file)

  const itemProps = {
    ref: fileOrFolderRef,
    owners,
    currentPath,
    editing,
    file,
    handleAddToSelectedItems,
    handleRename,
    icon: <Icon />,
    isFolder,
    isOverMove,
    isOverUpload,
    menuItems,
    onFolderOrFileClicks,
    preview,
    selectedCids,
    setEditing,
    resetSelectedFiles,
    longPressEvents: !desktop ? longPressEvents : undefined
  }

  return (
    <>
      {
        browserView === "table"
          ? <FileItemTableItem {...itemProps} />
          : <FileItemGridItem {...itemProps} />
      }
      {
        editing === cid && !desktop && (
          <>
            <CustomModal
              className={classes.modalRoot}
              injectedClass={{
                inner: classes.modalInner
              }}
              closePosition="none"
              active={editing === cid}
              onClose={() => stopEditing()}
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
                  <div className={classes.renameInputWrapper}>
                    <FormikTextInput
                      label="Name"
                      className={classes.renameInput}
                      name="name"
                      placeholder={isFolder ? t`Please enter a folder name` : t`Please enter a file name`}
                      autoFocus
                    />
                    {
                      !isFolder && extension !== ""  && (
                        <Typography component="span">
                          { `.${extension}` }
                        </Typography>
                      )
                    }
                  </div>
                  <footer className={classes.renameFooter}>
                    <CustomButton
                      onClick={() => setEditing("")}
                      size="medium"
                      variant="gray"
                      type="button"
                    >
                      <Trans>Cancel</Trans>
                    </CustomButton>
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
