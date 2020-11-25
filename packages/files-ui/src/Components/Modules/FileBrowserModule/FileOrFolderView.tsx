import {
  TableRow,
  TableCell,
  CheckboxInput,
  FormikTextInput,
  Typography,
  Button,
  standardlongDateFormat,
  formatBytes,
  MenuDropdown,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  MoreIcon,
  FileImageSvg,
  FilePdfSvg,
  FileTextSvg,
  FolderSvg,
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Formik, Form } from "formik"
import React, { Fragment } from "react"
import { IFile } from "../../../Contexts/DriveContext"
import CustomModal from "../../Elements/CustomModal"
import { Trans } from "@lingui/macro"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "./DragConstants"
import { NativeTypes } from "react-dnd-html5-backend"

const useStyles = makeStyles(({ breakpoints, constants, palette }: ITheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
  const mobileGridSettings = "69px 3fr 45px !important"
  return createStyles({
    tableRow: {
      border: `2px solid transparent`,
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings,
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings,
      },
      "&.droppable": {
        border: `2px solid ${palette.additional["geekblue"][6]}`,
      },
    },
    fileIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
      },
    },
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0,
      },
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`,
      },
    },
    modalRoot: {
      [breakpoints.down("md")]: {},
    },
    modalInner: {
      [breakpoints.down("md")]: {
        bottom:
          (constants?.mobileButtonHeight as number) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomRightRadius: `${constants.generalUnit * 1.5}px`,
      },
    },
    renameHeader: {
      textAlign: "center",
    },
    renameFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    renameModal: {
      padding: constants.generalUnit * 4,
    },
    okButton: {
      marginLeft: constants.generalUnit,
      color: palette.common.white.main,
      backgroundColor: palette.common.black.main,
    },
    cancelButton: {
      [breakpoints.down("md")]: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: constants?.mobileButtonHeight,
      },
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
    },
  })
})

interface IFileOrFolderProps {
  index: number
  file: IFile
  files: IFile[]
  currentPath: string
  updateCurrentPath(path: string): void
  selected: string[]
  handleSelect(selected: string): void
  editing: string | undefined
  setEditing(editing: string | undefined): void
  RenameSchema: any
  handleRename(path: string, newPath: string): Promise<void>
  handleMove(path: string, newPath: string): Promise<void>
  deleteFile(cid: string): Promise<void>
  downloadFile(name: string): Promise<void>
  handleUploadOnDrop(
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ): void
  setPreviewFileIndex(fileIndex: number | undefined): void
  desktop: boolean
}

const FileOrFolderView: React.FC<IFileOrFolderProps> = ({
  index,
  file,
  files,
  currentPath,
  updateCurrentPath,
  selected,
  handleSelect,
  editing,
  setEditing,
  RenameSchema,
  handleRename,
  handleMove,
  deleteFile,
  downloadFile,
  handleUploadOnDrop,
  setPreviewFileIndex,
  desktop,
}) => {
  let Icon
  if (file.isFolder) {
    Icon = FolderSvg
  } else if (file.content_type.includes("image")) {
    Icon = FileImageSvg
  } else if (file.content_type.includes("pdf")) {
    Icon = FilePdfSvg
  } else {
    Icon = FileTextSvg
  }

  const classes = useStyles()

  const [, dragMoveRef] = useDrag({
    item: { type: DragTypes.MOVABLE_FILE, payload: file },
  })

  const [{ isOverMove }, dropMoveRef] = useDrop({
    accept: DragTypes.MOVABLE_FILE,
    canDrop: () => file.isFolder,
    drop: async (item: {
      type: typeof DragTypes.MOVABLE_FILE
      payload: IFile
    }) => {
      await handleMove(
        `${currentPath}${item.payload.name}`,
        `${currentPath}${file.name}/${item.payload.name}`,
      )
    },
    collect: (monitor) => ({
      isOverMove: monitor.isOver(),
    }),
  })

  const [{ isOverUpload }, dropUploadRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any) => {
      handleUploadOnDrop(item.files, item.items, `${currentPath}${file.name}`)
    },
    collect: (monitor) => ({
      isOverUpload: monitor.isOver(),
    }),
  })

  function attachRef(el: any) {
    if (file.isFolder) {
      dropMoveRef(el)
      dropUploadRef(el)
    } else {
      dragMoveRef(el)
    }
  }

  return (
    <TableRow
      key={`files-${index}`}
      className={clsx(classes.tableRow, {
        droppable: file.isFolder && (isOverMove || isOverUpload),
        folder: file.isFolder,
      })}
      type="grid"
      rowSelectable={true}
      ref={attachRef}
      selected={selected.includes(file.cid)}
    >
      {desktop && (
        <TableCell>
          <CheckboxInput
            value={selected.includes(file.cid)}
            onChange={() => handleSelect(file.cid)}
          />
        </TableCell>
      )}
      <TableCell
        className={classes.fileIcon}
        onClick={() => {
          file.isFolder && updateCurrentPath(`${currentPath}${file.name}`)
        }}
      >
        <Icon />
      </TableCell>
      <TableCell
        align="left"
        onClick={() => {
          if (!editing) {
            file.isFolder
              ? updateCurrentPath(`${currentPath}${file.name}`)
              : setPreviewFileIndex(files?.indexOf(file))
          }
        }}
      >
        {editing === file.cid && desktop ? (
          <Formik
            initialValues={{
              fileName: file.name,
            }}
            validationSchema={RenameSchema}
            onSubmit={(values, actions) => {
              handleRename(
                `${currentPath}${file.name}`,
                `${currentPath}${values.fileName}`,
              )
              setEditing(undefined)
            }}
          >
            <Form>
              <FormikTextInput
                className={classes.renameInput}
                name="fileName"
                inputVariant="minimal"
                placeholder="Please enter a file name"
                autoFocus={editing === file.cid}
              />
            </Form>
          </Formik>
        ) : editing === file.cid && !desktop ? (
          <CustomModal
            className={classes.modalRoot}
            injectedClass={{
              inner: classes.modalInner,
            }}
            closePosition="none"
            active={editing === file.cid}
            setActive={() => setEditing("")}
          >
            <Formik
              initialValues={{
                fileName: file.name,
              }}
              validationSchema={RenameSchema}
              onSubmit={(values, actions) => {
                handleRename(
                  `${currentPath}${file.name}`,
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
                  placeholder="Please enter a file name"
                  autoFocus={editing === file.cid}
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
          file.name
        )}
      </TableCell>
      {desktop && (
        <Fragment>
          <TableCell align="left">
            {standardlongDateFormat(new Date(file.date_uploaded), true)}
          </TableCell>
          <TableCell align="left">{formatBytes(file.size)}</TableCell>
        </Fragment>
      )}
      <TableCell align="right">
        <MenuDropdown
          animation="none"
          anchor={desktop ? "bottom-center" : "bottom-right"}
          menuItems={[
            // {
            //   contents: (
            //     <Fragment>
            //       <ExportIcon className={classes.menuIcon} />
            //       <span>Move</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <Fragment>
            //       <ShareAltIcon className={classes.menuIcon} />
            //       <span>Share</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            {
              contents: (
                <Fragment>
                  <EditIcon className={classes.menuIcon} />
                  <span>
                    <Trans>Rename</Trans>
                  </span>
                </Fragment>
              ),
              onClick: () => setEditing(file.cid),
            },
            {
              contents: (
                <Fragment>
                  <DeleteIcon className={classes.menuIcon} />
                  <span>
                    <Trans>Delete</Trans>
                  </span>
                </Fragment>
              ),
              onClick: () => deleteFile(file.cid),
            },
            {
              contents: (
                <Fragment>
                  <DownloadIcon className={classes.menuIcon} />
                  <span>
                    <Trans>Download</Trans>
                  </span>
                </Fragment>
              ),
              onClick: () => downloadFile(file.name),
            },
          ]}
          indicator={MoreIcon}
        />
      </TableCell>
    </TableRow>
  )
}

export default FileOrFolderView
