import React, { useCallback } from "react"
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
  useHistory
} from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import { Formik, Form } from "formik"
import CustomModal from "../../../../Elements/CustomModal"
import { Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "../../DragConstants"
import { NativeTypes } from "react-dnd-html5-backend"
import { BrowserView, FileOperation } from "../../types"
import { CSFTheme } from "../../../../../Themes/types"
import FileItemTableItem from "./FileSystemTableItem"
import FileItemGridItem from "./FileSystemGridItem"
import { FileSystemItem } from "../../../../../Contexts/DriveContext"
import { useFileBrowser } from "../../../../../Contexts/FileBrowserContext"

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

interface IFileSystemItemRowProps {
  index: number
  file: FileSystemItem
  files: FileSystemItem[]
  selected: string[]
  handleSelect(selected: string): void
  editing: string | undefined
  setEditing(editing: string | undefined): void
  renameSchema: any
  handleRename?: (path: string, newPath: string) => Promise<void>
  handleMove?: (path: string, newPath: string) => Promise<void>
  deleteFile?: () => void
  recoverFile?: (cid: string) => void
  viewFolder?: (cid: string) => void
  setPreviewFileIndex: (fileIndex: number | undefined) => void
  moveFile?: () => void
  setFileInfoPath: (path: string) => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
}

const FileSystemItemRow: React.FC<IFileSystemItemRowProps> = ({
  file,
  files,
  selected,
  editing,
  setEditing,
  renameSchema,
  handleRename,
  handleMove,
  deleteFile,
  recoverFile,
  viewFolder,
  setPreviewFileIndex,
  moveFile,
  setFileInfoPath,
  handleSelect,
  itemOperations,
  browserView
}) => {
  const { downloadFile, currentPath, handleUploadOnDrop, moduleRootPath} = useFileBrowser()
  const { cid, name, isFolder, content_type } = file
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

  const { redirect } = useHistory()

  const allMenuItems: Record<FileOperation, IMenuItem> = {
    rename: {
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span>
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
          <span>
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
          <span>
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
          <span>
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
          <span>
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
          <span>
            <Trans>Info</Trans>
          </span>
        </>
      ),
      onClick: () => setFileInfoPath(`${currentPath}${name}`)
    },
    recover: {
      contents: (
        <>
          <RecoverSvg className={classes.menuIcon} />
          <span>
            <Trans>Recover</Trans>
          </span>
        </>
      ),
      onClick: () => recoverFile && recoverFile(cid)
    },
    preview: {
      contents: (
        <>
          <ZoomInSvg className={classes.menuIcon} />
          <span>
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
          <span>
            <Trans>View folder</Trans>
          </span>
        </>
      ),
      onClick: () => viewFolder && viewFolder(cid)
    }
  }

  const menuItems: IMenuItem[] = itemOperations.map(
    (itemOperation) => allMenuItems[itemOperation]
  )

  const [, dragMoveRef, preview] = useDrag({
    item: { type: DragTypes.MOVABLE_FILE, payload: file }
  })

  const [{ isOverMove }, dropMoveRef] = useDrop({
    accept: DragTypes.MOVABLE_FILE,
    canDrop: () => isFolder,
    drop: async (item: {
      type: typeof DragTypes.MOVABLE_FILE
      payload: FileSystemItem
    }) => {
      handleMove &&
        (await handleMove(
          `${currentPath}${item.payload.name}`,
          `${currentPath}${name}/${item.payload.name}`
        ))
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

  function attachRef(el: any) {
    if (isFolder) {
      dropMoveRef(el)
      dropUploadRef(el)
    } else {
      dragMoveRef(el)
    }
  }

  const onFolderClick = useCallback(() => {
    if (!moduleRootPath) {
      console.debug("Module root path not set")
      return
    }
    const newPath = `${moduleRootPath}${currentPath}${encodeURI(name)}`
    redirect(newPath)
  }, [currentPath, name, redirect, moduleRootPath])

  const onFileClick = useCallback(() => {
    setPreviewFileIndex(files?.indexOf(file))
  }, [file, files, setPreviewFileIndex])

  const onSingleClick = useCallback(
    () => { handleSelect(cid) },
    [cid, handleSelect]
  )

  const onDoubleClick = useCallback(() => {
    isFolder
      ? onFolderClick()
      : onFileClick()
  }, [isFolder, onFileClick, onFolderClick])

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderOrFileClicks = desktop
    ? click
    : () => {
      isFolder
        ? onFolderClick()
        : onFileClick()
    }

  const itemProps = {
    attachRef,
    currentPath,
    editing,
    file,
    handleSelect,
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
    setEditing
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
              <Formik
                initialValues={{
                  fileName: name
                }}
                validationSchema={renameSchema}
                onSubmit={(values) => {
                  handleRename &&
                  handleRename(
                    `${currentPath}${name}`,
                    `${currentPath}${values.fileName}`
                  )
                  setEditing(undefined)
                }}
              >
                <Form className={classes.renameModal}>
                  <Typography
                    className={classes.renameHeader}
                    component="p"
                    variant="h5"
                  >
                    <Trans>Rename File/Folder</Trans>
                  </Typography>
                  <FormikTextInput
                    label="Name"
                    className={classes.renameInput}
                    name="fileName"
                    placeholder={`Please enter a ${
                      isFolder ? "folder" : "file"
                    } name`}
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
                    >
                      <Trans>Update</Trans>
                    </Button>
                  </footer>
                </Form>
              </Formik>
            </CustomModal>
            <Typography>{name}</Typography>
          </>
        )
      }
    </>
  )
}

export default FileSystemItemRow
