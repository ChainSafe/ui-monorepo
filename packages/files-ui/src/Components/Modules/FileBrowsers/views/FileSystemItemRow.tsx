import React, { useCallback } from "react"
import {
  TableRow,
  TableCell,
  FormikTextInput,
  Typography,
  Button,
  formatBytes,
  MenuDropdown,
  MoreIcon,
  FileImageSvg,
  FilePdfSvg,
  FileTextSvg,
  FolderFilledSvg,
  DownloadSvg,
  DeleteSvg,
  EditSvg,
  IMenuItem,
  CheckSvg,
  RecoverSvg,
  CheckboxInput,
  EyeSvg,
  ExportSvg,
  ShareAltSvg,
  ExclamationCircleInverseSvg,
  ZoomInSvg
} from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Formik, Form } from "formik"
import { FileSystemItem, BucketType } from "../../../../Contexts/DriveContext"
import CustomModal from "../../../Elements/CustomModal"
import { Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "../DragConstants"
import { NativeTypes } from "react-dnd-html5-backend"
import { BrowserView, FileOperation } from "../types"
import { CSFTheme } from "../../../../Themes/types"
import dayjs from "dayjs"
import { t } from "@lingui/macro"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
  const mobileGridSettings = "69px 3fr 45px !important"

  return createStyles({
    tableRow: {
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      },
      "&.droppable": {
        border: `2px solid ${palette.additional["geekblue"][6]}`
      }
    },
    fileIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
        fill: constants.fileSystemItemRow.icon
      }
    },
    folderIcon: {
      "& svg": {
        fill: palette.additional.gray[9]
      }
    },
    gridIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: constants.generalUnit * 28,
      border: `1px solid ${palette.additional["gray"][6]}`,
      boxShadow: constants.filesTable.gridItemShadow,
      "& svg": {
        width: "30%"
      },
      [breakpoints.down("lg")]: {
        height: constants.generalUnit * 20
      },
      [breakpoints.down("sm")]: {
        height: constants.generalUnit * 16
      },
      "&.highlighted": {
        border: `1px solid ${palette.additional["geekblue"][6]}`
      }
    },
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
    desktopRename: {
      display: "flex",
      flexDirection: "row",
      "& svg": {
        width: 20,
        height: 20
      }
    },
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      "&.editing": {
        overflow: "visible"
      }
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    },
    dropdownOptions: {
      backgroundColor: constants.fileSystemItemRow.optionsBackground,
      color: constants.fileSystemItemRow.optionsColor,
      border: `1px solid ${constants.fileSystemItemRow.optionsBorder}`
    },
    dropdownItem: {
      backgroundColor: constants.fileSystemItemRow.itemBackground,
      color: constants.fileSystemItemRow.itemColor
    },
    gridViewContainer: {
      display: "flex",
      flex: 1
    },
    gridFolderName: {
      textAlign: "center",
      wordBreak: "break-all",
      overflowWrap: "break-word",
      padding: constants.generalUnit
    },
    gridViewIconNameBox: {
      display: "flex",
      flexDirection: "column"
    },
    menuTitleGrid: {
      padding: `0 ${constants.generalUnit * 0.5}px`,
      [breakpoints.down("md")]: {
        padding: 0
      }
    }
  })
})

interface IFileSystemItemRowProps {
  index: number
  file: FileSystemItem
  files: FileSystemItem[]
  currentPath?: string
  updateCurrentPath: (path: string, newBucketType?: BucketType, showLoading?: boolean) => void
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
  downloadFile?: (cid: string) => Promise<void>
  handleUploadOnDrop?: (files: File[], fileItems: DataTransferItemList, path: string,) => void
  setPreviewFileIndex: (fileIndex: number | undefined) => void
  moveFile?: () => void
  setFileInfoPath: (path: string) => void
  itemOperations: FileOperation[]
  resetSelectedFiles: () => void
  browserView: BrowserView
}

const FileSystemItemRow: React.FC<IFileSystemItemRowProps> = ({
  index,
  file,
  files,
  currentPath,
  updateCurrentPath,
  selected,
  editing,
  setEditing,
  renameSchema,
  handleRename,
  handleMove,
  deleteFile,
  recoverFile,
  downloadFile,
  viewFolder,
  handleUploadOnDrop,
  setPreviewFileIndex,
  moveFile,
  setFileInfoPath,
  handleSelect,
  itemOperations,
  resetSelectedFiles,
  browserView
}) => {
  const { cid, name, isFolder, size, content_type, created_at } = file
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
    updateCurrentPath(`${currentPath}${name}`, undefined, true)
    resetSelectedFiles()
  }, [currentPath, name, resetSelectedFiles, updateCurrentPath])

  const onFileClick = useCallback(() => {
    setPreviewFileIndex(files?.indexOf(file))
  }, [file, files, setPreviewFileIndex])

  const onSingleClick = useCallback(() => { handleSelect(cid) },
    [cid, handleSelect])
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

  return (
    <>
      {
        browserView === "table" ? (
          <TableRow
            key={`files-${index}`}
            className={clsx(classes.tableRow, {
              droppable: isFolder && (isOverMove || isOverUpload)
            })}
            type="grid"
            rowSelectable={true}
            ref={!editing ? attachRef : null}
            selected={selected.includes(cid)}
          >
            {desktop && (
              <TableCell>
                <CheckboxInput
                  value={selected.includes(cid)}
                  onChange={() => handleSelect(cid)}
                />
              </TableCell>
            )}
            <TableCell
              className={clsx(classes.fileIcon, isFolder && classes.folderIcon)}
              onClick={onFolderOrFileClicks}
            >
              <Icon />
            </TableCell>
            <TableCell
              ref={preview}
              align="left"
              className={clsx(classes.filename, desktop && editing === cid && "editing")}
              onClick={() => !editing && onFolderOrFileClicks()}
            >
              {editing === cid && desktop ? (
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
                  <Form className={classes.desktopRename}>
                    <FormikTextInput
                      className={classes.renameInput}
                      name="fileName"
                      inputVariant="minimal"
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setEditing(undefined)
                        }
                      }}
                      placeholder = {isFolder
                        ? t`Please enter a file name`
                        : t`Please enter a folder name`
                      }
                      autoFocus={editing === cid}
                    />
                    <Button
                      variant="dashed"
                      size="small"
                      type="submit"
                    >
                      <CheckSvg />
                    </Button>
                  </Form>
                </Formik>
              ) : (
                <Typography>{name}</Typography>
              )}
            </TableCell>
            {desktop && (
              <>
                <TableCell align="left">
                  {
                    dayjs.unix(created_at).format("DD MMM YYYY h:mm a")
                  }
                </TableCell>
                <TableCell align="left">
                  {!isFolder && formatBytes(size)}
                </TableCell>
              </>
            )}
            <TableCell align="right">
              <MenuDropdown
                animation="none"
                anchor={desktop ? "bottom-center" : "bottom-right"}
                menuItems={menuItems}
                classNames={{
                  icon: classes.dropdownIcon,
                  options: classes.dropdownOptions,
                  item: classes.dropdownItem
                }}
                indicator={MoreIcon}
              />
            </TableCell>
          </TableRow>
        ) : (
          <div className={classes.gridViewContainer}>
            <div className={clsx(classes.gridViewIconNameBox)}
              ref={!editing ? attachRef : null}
              onClick={onFolderOrFileClicks}
            >
              <div
                className={clsx(
                  classes.fileIcon,
                  isFolder && classes.folderIcon,
                  classes.gridIcon,
                  (isOverMove || isOverUpload || selected.includes(cid)) && "highlighted"
                )}
              >
                <Icon />
              </div>
              {editing === cid && desktop ? (
                <Formik
                  initialValues={{
                    fileName: name
                  }}
                  validationSchema={renameSchema}
                  onSubmit={(values) => {
                    handleRename && handleRename(
                      `${currentPath}${name}`,
                      `${currentPath}${values.fileName}`
                    )
                    setEditing(undefined)
                  }}
                >
                  <Form className={classes.desktopRename}>
                    <FormikTextInput
                      className={classes.renameInput}
                      name="fileName"
                      inputVariant="minimal"
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setEditing(undefined)
                        }
                      }}
                      placeholder = {isFolder
                        ? t`Please enter a file name`
                        : t`Please enter a folder name`
                      }
                      autoFocus={editing === cid}
                    />
                  </Form>
                </Formik>
              ) : (
                <div className={classes.gridFolderName}>{name}</div>
              )}
            </div>
            <div>
              <MenuDropdown
                animation="none"
                anchor="bottom-right"
                menuItems={menuItems}
                classNames={{
                  icon: classes.dropdownIcon,
                  options: classes.dropdownOptions,
                  item: classes.dropdownItem,
                  title: classes.menuTitleGrid
                }}
                indicator={MoreIcon}
              />
            </div>
          </div>
        )
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
