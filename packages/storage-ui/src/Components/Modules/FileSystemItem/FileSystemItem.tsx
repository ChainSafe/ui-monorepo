import React, { useCallback, useEffect, useMemo, useRef } from "react"
import {
  FormikTextInput,
  Typography,
  Button
} from "@chainsafe/common-components"
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
import { getFileNameAndExtension } from "../../../Utils/Helpers"
import { getItemMenuOptions } from "./itemOperations"

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
  selected: ISelectedFile[]
  handleSelectCid(selectedFile: ISelectedFile): void
  handleAddToSelectedCids(selectedFile: ISelectedFile): void
  handleSelectItemWithShift(selectedFile: ISelectedFile): void
  editingFile?: ISelectedFile
  setEditingFile(editingFile: ISelectedFile | undefined): void
  handleRename?: (item: ISelectedFile, newName: string) => Promise<void> | undefined
  deleteFile?: (toDelete: ISelectedFile) => void
  recoverFile?: (toRecover: ISelectedFile) => void
  viewFolder?: (toView: ISelectedFile) => void
  previewFile?: (file: FileSystemItemType) => void
  moveFile?: (toMove: ISelectedFile) => void
  showFileInfo: (toShow: ISelectedFile) => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
  handleContextMenuOnItem? : (e: React.MouseEvent, file: FileSystemItemType) => void
}

const FileSystemItem = ({
  file,
  selected,
  editingFile,
  setEditingFile,
  handleRename,
  deleteFile,
  viewFolder,
  previewFile,
  moveFile,
  showFileInfo,
  handleSelectCid,
  handleAddToSelectedCids,
  handleSelectItemWithShift,
  itemOperations,
  browserView,
  resetSelectedFiles,
  handleContextMenuOnItem
}: IFileSystemItemProps) => {
  const { downloadFile, currentPath, handleUploadOnDrop, moveItems } = useFileBrowser()
  const { cid, name, isFolder } = file

  const { desktop } = useThemeSwitcher()
  const classes = useStyles()

  const { fileName, extension } = useMemo(() => {
    return getFileNameAndExtension(name, isFolder)
  }, [name, isFolder])

  const formik = useFormik({
    initialValues: { name: fileName },
    validationSchema: nameValidator,
    onSubmit: (values: { name: string }) => {
      const newName = extension !== "" ? `${values.name.trim()}.${extension}` : values.name.trim()

      if (newName !== name && editingFile) {
        newName && handleRename && handleRename(editingFile, newName)
      } else {
        stopEditing()
      }
    },
    enableReinitialize: true
  })

  const stopEditing = useCallback(() => {
    setEditingFile(undefined)
    formik.resetForm()
  }, [formik, setEditingFile])

  const menuItems = useMemo(() => getItemMenuOptions(classes.menuIcon, file, {
    deleteFile,
    downloadFile,
    moveFile,
    setEditingFile,
    showFileInfo,
    previewFile,
    viewFolder
  }, itemOperations), [
    classes.menuIcon,
    file,
    itemOperations,
    deleteFile,
    downloadFile,
    previewFile,
    moveFile,
    setEditingFile,
    showFileInfo,
    viewFolder
  ])

  const [, dragMoveRef, preview] = useDrag({
    type: DragTypes.MOVABLE_FILE,
    canDrag: !editingFile,
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
    canDrop: (item) =>  isFolder &&
      item.selected.findIndex((s) => s.cid === file.cid && s.name === file.name) < 0,
    drop: (item: {selected: ISelectedFile[]}) => {
      moveItems && moveItems(item.selected, getPathWithFile(currentPath, name))
      resetSelectedFiles()
    },
    collect: (monitor) => ({
      isOverMove: monitor.isOver() &&
        monitor.getItem<{selected: ISelectedFile[]}>().selected.findIndex((s) => s.cid === file.cid && s.name === file.name) < 0
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
    if (editingFile) {
      fileOrFolderRef.current.draggable = false
    } else {
      fileOrFolderRef.current.draggable = true
    }
  }

  if (!editingFile && desktop) {
    dragMoveRef(fileOrFolderRef)
    if (isFolder) {
      dropMoveRef(fileOrFolderRef)
      dropUploadRef(fileOrFolderRef)
    }
  }

  const handleItemSelectOnCheck = useCallback((e: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      handleAddToSelectedCids({ cid, name })
    } else if (e && (e.shiftKey || e.metaKey)) {
      handleSelectItemWithShift({ cid, name })
    } else {
      handleAddToSelectedCids({ cid, name })
    }
  }, [handleAddToSelectedCids, handleSelectItemWithShift, cid, name])

  const onSingleClick = useCallback(
    (e) => {
      if (desktop) {
        // on desktop 
        if (e && (e.ctrlKey || e.metaKey)) {
          handleAddToSelectedCids({ cid, name })
        } else if (e && (e.shiftKey || e.metaKey)) {
          handleSelectItemWithShift({ cid, name })
        } else {
          handleSelectCid({ cid, name })
        }
      } else {
        // on mobile
        if (isFolder) {
          viewFolder && viewFolder({ cid, name })
        } else {
          previewFile && previewFile(file)
        }
      }
    },
    [
      cid,
      desktop,
      isFolder,
      handleAddToSelectedCids,
      handleSelectItemWithShift,
      handleSelectCid,
      viewFolder,
      name,
      previewFile,
      file
    ]
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
          previewFile && previewFile(file)
        }
      } else {
        // on mobile
        return
      }
    },
    [desktop, viewFolder, name, cid, previewFile, file, isFolder]
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
    resetSelectedFiles,
    handleItemSelectOnCheck,
    handleContextMenuOnItem: (e: React.MouseEvent) => {
      handleContextMenuOnItem && handleContextMenuOnItem(e, file)
    }
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
              active={!!editingFile}
              onClose={stopEditing}
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
