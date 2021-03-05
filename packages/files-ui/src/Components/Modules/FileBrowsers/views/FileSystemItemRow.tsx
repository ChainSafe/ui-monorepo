import React, { Fragment, useCallback } from "react"
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
import {
  makeStyles,
  createStyles,
  useDoubleClick,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import clsx from "clsx"
import { Formik, Form } from "formik"
import { FileSystemItem, BucketType } from "../../../../Contexts/DriveContext"
import CustomModal from "../../../Elements/CustomModal"
import { Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "../DragConstants"
import { NativeTypes } from "react-dnd-html5-backend"
import { FileOperation, IFileConfigured } from "../types"
import { CSFTheme } from "../../../../Themes/types"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 60px !important"
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
        // TODO: FILL
        fill: palette.additional.gray[9]
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
        borderBottomRightRadius: `${constants.generalUnit * 1.5}px`
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
      overflow: "hidden",
      textOverflow: "ellipsis"
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
    }
  })
})

interface IFileSystemItemRowProps {
  index: number
  file: IFileConfigured
  files: IFileConfigured[]
  currentPath?: string
  updateCurrentPath(
    path: string,
    newBucketType?: BucketType,
    showLoading?: boolean,
  ): void
  selected: string[]
  handleSelect(selected: string): void
  editing: string | undefined
  setEditing(editing: string | undefined): void
  RenameSchema: any
  handleRename?(path: string, newPath: string): Promise<void>
  handleMove?(path: string, newPath: string): Promise<void>
  deleteFile?(cid: string): void
  recoverFile?(cid: string): void
  viewFolder?(cid: string): void
  downloadFile?(cid: string): Promise<void>
  handleUploadOnDrop?(
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ): void
  setPreviewFileIndex(fileIndex: number | undefined): void
  setMoveFileData(moveFileData: {
    modal: boolean
    fileData: FileSystemItem | FileSystemItem[]
  }): void
  setFileInfoPath(path: string): void
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
  RenameSchema,
  handleRename,
  handleMove,
  deleteFile,
  recoverFile,
  downloadFile,
  viewFolder,
  handleUploadOnDrop,
  setPreviewFileIndex,
  setMoveFileData,
  setFileInfoPath,
  handleSelect
}) => {
  const {cid, name, isFolder, size, operations, content_type} = file;
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

  const { desktop, themeKey } = useThemeSwitcher()
  const classes = useStyles()

  const menuOptions: Record<FileOperation, IMenuItem> = {
    rename: {
      contents: (
        <Fragment>
          <EditSvg className={classes.menuIcon} />
          <span>
            <Trans>Rename</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => setEditing(cid),
    },
    delete: {
      contents: (
        <Fragment>
          <DeleteSvg className={classes.menuIcon} />
          <span>
            <Trans>Delete</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => deleteFile && deleteFile(cid),
    },
    download: {
      contents: (
        <Fragment>
          <DownloadSvg className={classes.menuIcon} />
          <span>
            <Trans>Download</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => downloadFile && downloadFile(cid),
    },
    move: {
      contents: (
        <Fragment>
          <ExportSvg className={classes.menuIcon} />
          <span>
            <Trans>Move</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => setMoveFileData({ modal: true, fileData: file })
    },
    share: {
      contents: (
        <Fragment>
          <ShareAltSvg className={classes.menuIcon} />
          <span>
            <Trans>Share</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => console.log
    },
    info: {
      contents: (
        <Fragment>
          <ExclamationCircleInverseSvg className={classes.menuIcon} />
          <span>
            <Trans>Info</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => setFileInfoPath(`${currentPath}${name}`),
    },
    recover: {
      contents: (
        <Fragment>
          <RecoverSvg className={classes.menuIcon} />
          <span>
            <Trans>Recover</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => recoverFile && recoverFile(cid),
    },
    preview: {
      contents: (
        <Fragment>
          <ZoomInSvg className={classes.menuIcon} />
          <span>
            <Trans>Preview</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => setPreviewFileIndex(files?.indexOf(file))
    },
    view_folder: {
      contents: (
        <Fragment>
          <EyeSvg className={classes.menuIcon} />
          <span>
            <Trans>View folder</Trans>
          </span>
        </Fragment>
      ),
      onClick: () => viewFolder && viewFolder(cid),
    },
  }

  const menuItems: IMenuItem[] = operations.map(
    (itemOperation) => menuOptions[itemOperation],
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
          `${currentPath}${name}/${item.payload.name}`,
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

  const onSingleClick = useCallback(() => { handleSelect(cid) }, [cid, handleSelect])
  const onDoubleClick = useCallback(() => {
    isFolder
      ? updateCurrentPath(`${currentPath}${name}`, undefined, true)
      : setPreviewFileIndex(files?.indexOf(file))
  }, [currentPath, file, files, isFolder, name, setPreviewFileIndex, updateCurrentPath])

  const { click } = useDoubleClick(onSingleClick,onDoubleClick)

  const onFolderOrFileClicks = desktop
    ? click
    : () => {
        isFolder
          ? updateCurrentPath(`${currentPath}${name}`, undefined, true)
          : setPreviewFileIndex(files?.indexOf(file))
      }

  return (
    <TableRow
      key={`files-${index}`}
      className={clsx(classes.tableRow, {
        droppable: isFolder && (isOverMove || isOverUpload),
        folder: isFolder,
      })}
      type="grid"
      rowSelectable={true}
      ref={attachRef}
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
        className={classes.filename}
        onClick={() => {
          if (!editing) {
            onFolderOrFileClicks()
          }
        }}
      >
        {editing === cid && desktop ? (
          <Formik
            initialValues={{
              fileName: name,
            }}
            validationSchema={RenameSchema}
            onSubmit={(values) => {
              handleRename &&
                handleRename(
                  `${currentPath}${name}`,
                  `${currentPath}${values.fileName}`,
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
                placeholder={`Please enter a ${
                  isFolder ? "folder" : "file"
                } name`}
                autoFocus={editing === cid}
              />
              <Button
                variant={themeKey === "dark" ? "outline" : "dashed"}
                size="small"
                type="submit"
              >
                <CheckSvg />
              </Button>
            </Form>
          </Formik>
        ) : editing === cid && !desktop ? (
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
                fileName: name,
              }}
              validationSchema={RenameSchema}
              onSubmit={(values) => {
                handleRename &&
                  handleRename(
                    `${currentPath}${name}`,
                    `${currentPath}${values.fileName}`,
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
        ) : (
          <Typography>{name}</Typography>
        )}
      </TableCell>
      {desktop && (
        <>
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
  )
}

export default FileSystemItemRow
