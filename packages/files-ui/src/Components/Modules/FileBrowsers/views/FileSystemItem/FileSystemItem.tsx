import React, { useCallback, useEffect, useRef } from "react"
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
  ZoomInSvg,
  InfoCircleSvg } from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
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
import { FileSystemItem as FileSystemItemType } from "../../../../../Contexts/FilesContext"
import { useFileBrowser } from "../../../../../Contexts/FileBrowserContext"
import { getPathWithFile } from "../../../../../Utils/pathUtils"
import { BucketUser } from "@chainsafe/files-api-client"
import { useMemo } from "react"

const useStyles = makeStyles(({ breakpoints, constants }: CSFTheme) => {
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
  file: FileSystemItemType
  files: FileSystemItemType[]
  selected: string[]
  owners?: BucketUser[]
  handleSelectCid(selectedCid: string): void
  handleAddToSelectedCids(selectedCid: string): void
  editing: string | undefined
  setEditing(editing: string | undefined): void
  renameSchema: any
  handleRename?: (cid: string, newName: string) => Promise<void>
  handleMove?: (cid: string, newPath: string) => Promise<void>
  deleteFile?: () => void
  recoverFile?: () => void
  viewFolder?: (cid: string) => void
  setPreviewFileIndex: (fileIndex: number | undefined) => void
  moveFile?: () => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
  reportFile?: (path: string) => void
  showFileInfo?: (path: string) => void
  share?: (path: string) => void
}

const FileSystemItem = ({
  file,
  files,
  selected,
  owners,
  editing,
  setEditing,
  renameSchema,
  handleRename,
  deleteFile,
  recoverFile,
  viewFolder,
  setPreviewFileIndex,
  moveFile,
  handleSelectCid,
  handleAddToSelectedCids,
  itemOperations,
  browserView,
  resetSelectedFiles,
  reportFile,
  showFileInfo,
  share
}: IFileSystemItemProps) => {
  const { downloadFile, currentPath, handleUploadOnDrop, moveItems } = useFileBrowser()
  const { cid, name, isFolder, content_type } = file
  const formik = useFormik({
    initialValues:{
      fileName: name
    },
    validationSchema:renameSchema,
    onSubmit:(values) => {
      handleRename &&
      handleRename(
        file.cid,
        values.fileName
      )
    }
  })
  let Icon
  if (isFolder) {
    Icon = FolderFilledSvg
  } else if (content_type.includes("image")) {
    Icon = FileImageSvg
  } else if (content_type.includes("pdf")) {
    Icon = FilePdfSvg
  } else {
    Icon = FileTextSvg
  }

  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const filePath = useMemo(() => `${currentPath}${name}`, [currentPath, name])


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
            <Trans>Download</Trans>
          </span>
        </>
      ),
      onClick: () => downloadFile && downloadFile(cid)
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
      onClick: () => share && share(filePath)
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
  [cid,
    classes.menuIcon,
    deleteFile,
    downloadFile,
    file,
    filePath,
    files,
    moveFile,
    recoverFile,
    reportFile,
    setEditing,
    setPreviewFileIndex,
    showFileInfo,
    viewFolder,
    share
  ])

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  const [, dragMoveRef, preview] = useDrag(() =>
    ({ type: DragTypes.MOVABLE_FILE,
      item: () => {
        if (selected.includes(file.cid)) {
          return { ids: selected }
        } else {
          return { ids: [...selected, file.cid] }
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
    drop: (item: {ids: string[]}) => {
      moveItems && moveItems(item.ids, getPathWithFile(currentPath, name))
    },
    collect: (monitor) => ({
      isOverMove: monitor.isOver()
    })
  })

  const [{ isOverUpload }, dropUploadRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any) => {
      handleUploadOnDrop &&
        handleUploadOnDrop(item.files, item.items, `${currentPath}${name}`)
    },
    collect: (monitor) => ({
      isOverUpload: monitor.isOver()
    })
  })

  const fileOrFolderRef = useRef<any>()

  if (!editing && isFolder) {
    dropMoveRef(fileOrFolderRef)
    dropUploadRef(fileOrFolderRef)
  }

  if (!editing && !isFolder) {
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
          handleAddToSelectedCids(cid)
        } else {
          handleSelectCid(cid)
        }
      } else {
        // on mobile
        if (isFolder) {
          viewFolder && viewFolder(file.cid)
        } else {
          onFilePreview()
        }
      }
    },
    [cid, handleSelectCid, handleAddToSelectedCids, desktop, isFolder, viewFolder, file, onFilePreview]
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

  const onFolderOrFileClicks = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  const itemProps = {
    ref: fileOrFolderRef,
    owners,
    currentPath,
    editing,
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
    renameSchema,
    selected,
    setEditing,
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
        editing === cid && !desktop && (
          <>
            <CustomModal
              className={classes.modalRoot}
              injectedClass={{
                inner: classes.modalInner
              }}
              closePosition="none"
              active={editing === cid}
              setActive={() => setEditing("")}
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
                    name="fileName"
                    placeholder={isFolder ? t`Please enter a folder name` : t`Please enter a file name`}
                    autoFocus={editing === cid}
                  />
                  <footer className={classes.renameFooter}>
                    <Button
                      onClick={() => setEditing("")}
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
