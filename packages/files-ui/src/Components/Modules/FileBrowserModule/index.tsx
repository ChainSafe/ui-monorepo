import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@chainsafe/common-theme"
import React, { Fragment, useCallback, useEffect } from "react"
import {
  CheckboxInput,
  Divider,
  MenuDropdown,
  PlusIcon,
  // ShareAltIcon,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography,
  Breadcrumb,
  Crumb,
  CircularProgressBar,
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import { useDrive, IFile } from "../../../Contexts/DriveContext"
import { object, string } from "yup"
import EmptySvg from "../../../Media/Empty.svg"
import CreateFolderModule from "../CreateFolderModule"
import UploadFileModule from "../UploadFileModule"
import FilePreviewModal from "../FilePreviewModal"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import UploadProgressModals from "../UploadProgressModals"
import { useDropzone } from "react-dropzone"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import FileOrFolderView from "./FileOrFolderView"
import { DndProvider, useDrag } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DragTypes } from "./DragConstants"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette, zIndex }: ITheme) => {
    const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
    const mobileGridSettings = "69px 3fr 45px !important"
    return createStyles({
      root: {
        [breakpoints.down("md")]: {
          paddingLeft: constants.generalUnit * 2,
          paddingRight: constants.generalUnit * 2,
        },
        [breakpoints.up("md")]: {
          border: `1px solid transparent`,
          padding: `0 ${constants.generalUnit}px`,
          borderRadius: constants.generalUnit / 4,
          minHeight: `calc(100vh - ${constants.contentTopPadding as number}px)`,
          "&.dragging": {
            borderColor: palette.additional["geekblue"][4],
            "& .folder.hovered": {
              borderColor: palette.additional["geekblue"][4],
            },
          },
        },
        // transitionDuration: `${animation.transform}ms`,
      },
      header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit,
        },
      },
      controls: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        "& > button": {
          marginLeft: constants.generalUnit,
        },
      },
      breadCrumbContainer: {
        margin: `${constants.generalUnit * 2}px 0`,
        height: 22,
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit * 3,
          marginBottom: 0,
        },
      },
      divider: {
        "&:before, &:after": {
          backgroundColor: palette.additional["gray"][4],
        },
        [breakpoints.up("md")]: {
          margin: `${constants.generalUnit * 4.5}px 0`,
        },
        [breakpoints.down("md")]: {
          margin: `${constants.generalUnit * 4.5}px 0 0`,
        },
      },
      noFiles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "25vh",
        "& svg": {
          maxWidth: 180,
          marginBottom: constants.generalUnit * 3,
        },
      },
      tableRow: {
        border: `2px solid transparent`,
        transitionDuration: `${animation.transform}ms`,
        [breakpoints.up("md")]: {
          gridTemplateColumns: desktopGridSettings,
        },
        [breakpoints.down("md")]: {
          gridTemplateColumns: mobileGridSettings,
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
      progressIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      dropdownIcon: {
        "& svg": {
          height: 20,
          width: 20,
        },
      },
      dropdownOptions: {
        "& > *": {
          padding: 0,
        },
      },
      mobileButton: {},
      dropNotification: {
        display: "block",
        position: "fixed",
        zIndex: zIndex?.layer4,
        bottom: 0,

        transform: "translateX(-50%)",
        backgroundColor: palette.common.black.main,
        color: palette.additional["gray"][2],
        opacity: 0,
        visibility: "hidden",
        transitionDuration: `${animation.transform}ms`,
        textAlign: "center",
        width: 260,
        padding: `${constants.generalUnit}px 0`,
        [breakpoints.up("md")]: {
          left: `calc(50% + ${(constants.navWidth as number) / 2}px)`,
        },
        "&.active": {
          opacity: 1,
          visibility: "visible",
        },
      },
    })
  },
)

export interface IFileBrowserProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
}

const FileBrowserModule: React.FC<IFileBrowserProps> = ({
  heading = "My Files",
  controls = true,
}: IFileBrowserProps) => {
  const classes = useStyles()
  const {
    deleteFile,
    downloadFile,
    renameFile,
    moveFile,
    currentPath,
    updateCurrentPath,
    pathContents,
    uploadsInProgress,
    uploadFiles,
  } = useDrive()
  const [editing, setEditing] = useState<string | undefined>()
  const [direction, setDirection] = useState<SortDirection>("descend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">(
    "name",
  )
  const [selected, setSelected] = useState<string[]>([])

  const [previewFileIndex, setPreviewFileIndex] = useState<number | undefined>(
    undefined,
  )

  // Sorting
  const sortFoldersFirst = (a: IFile, b: IFile) =>
    a.isFolder && a.content_type !== b.content_type ? -1 : 1

  const items: IFile[] = useMemo(() => {
    if (!pathContents) return []

    switch (direction) {
      default: {
        // case "descend": {
        // case "name": {
        return pathContents
          .sort((a: IFile, b: IFile) => (a.name > b.name ? -1 : 1))
          .sort(sortFoldersFirst)
      }
      case "descend": {
        switch (column) {
          default: {
            // case "name": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.name > b.name ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "size": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.size > b.size ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return pathContents
              .sort((a: IFile, b: IFile) =>
                a.date_uploaded > b.date_uploaded ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
        }
      }
      case "ascend": {
        switch (column) {
          default: {
            // case "name": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.name < b.name ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "size": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.size < b.size ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return pathContents
              .sort((a: IFile, b: IFile) =>
                a.date_uploaded < b.date_uploaded ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
        }
      }
    }
  }, [pathContents, direction, column])

  const handleSortToggle = (
    targetColumn: "name" | "size" | "date_uploaded",
  ) => {
    if (column !== targetColumn) {
      setColumn(targetColumn)
      setDirection("descend")
    } else {
      if (direction === "ascend") {
        setDirection("descend")
      } else {
        setDirection("ascend")
      }
    }
  }

  const files = useMemo(() => {
    return items.filter((i) => !i.isFolder)
  }, [items])

  // Previews
  const setNextPreview = () => {
    if (
      files &&
      previewFileIndex !== undefined &&
      previewFileIndex < files.length - 1
    ) {
      setPreviewFileIndex(previewFileIndex + 1)
    }
  }

  const setPreviousPreview = () => {
    if (files && previewFileIndex !== undefined && previewFileIndex > 0) {
      setPreviewFileIndex(previewFileIndex - 1)
    }
  }

  const clearPreview = () => {
    setPreviewFileIndex(undefined)
  }

  // Selection logic
  const handleSelect = (cid: string) => {
    if (selected.includes(cid)) {
      setSelected(selected.filter((selectedCid: string) => selectedCid !== cid))
    } else {
      setSelected([...selected, cid])
    }
  }

  const toggleAll = () => {
    if (selected.length === items.length) {
      setSelected([])
    } else {
      setSelected([...items.map((file: IFile) => file.cid)])
    }
  }

  // Rename
  const handleRename = async (path: string, new_path: string) => {
    // TODO set loading
    await renameFile({
      path: path,
      new_path: new_path,
    })
    setEditing(undefined)
  }

  // Rename
  const handleMove = async (path: string, new_path: string) => {
    // TODO set loading
    await moveFile({
      path: path,
      new_path: new_path,
    })
  }

  const RenameSchema = object().shape({
    fileName: string()
      .min(1, "Please enter a file name")
      .max(65, "File name length exceeded")
      .required("File name is required"),
  })

  // Breadcrumbs/paths
  const arrayOfPaths = getArrayOfPaths(currentPath)
  const crumbs: Crumb[] = arrayOfPaths.map((path, index) => ({
    text: path,
    onClick: () =>
      updateCurrentPath(getPathFromArray(arrayOfPaths.slice(0, index + 1))),
  }))

  // Media queries
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  // Upload logic
  const [dropActive, setDropActive] = useState<number>(-1)
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  const displayUpload = useCallback(() => {
    if (dropActive > 0) {
      clearTimeout(dropActive)
    }
    const timer = setTimeout(() => {
      setDropActive(-1)
      setUploadTarget(currentPath)
    }, 2000)
    setDropActive(timer)
    return () => {
      clearTimeout(timer)
      setUploadTarget(currentPath)
    }
  }, [dropActive])

  const [uploadTarget, setUploadTarget] = useState<string>(currentPath)

  useEffect(() => {
    setUploadTarget(currentPath)
  }, [currentPath])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      uploadFiles(acceptedFiles, uploadTarget)
      setDropActive(-1)
    },
    [uploadTarget],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: false,
    noClick: true,
    noKeyboard: false,
    multiple: true,
  })

  console.log(isDraggingFile)

  return (
    <DndProvider backend={HTML5Backend}>
      <article
        {...getRootProps()}
        onDragEnter={!isDraggingFile ? displayUpload : () => undefined}
        className={clsx(classes.root, {
          dragging: !isDraggingFile && dropActive > -1,
        })}
      >
        <input {...getInputProps()} />
        <div
          className={clsx(classes.dropNotification, {
            active: !isDraggingFile && dropActive > -1,
          })}
        >
          <Typography variant="h4" component="p">
            <Trans>Drop to upload files</Trans>
          </Typography>
        </div>
        <div className={classes.breadCrumbContainer}>
          {crumbs.length > 0 && (
            <Breadcrumb
              crumbs={crumbs}
              homeOnClick={() => updateCurrentPath("/")}
              showDropDown={!desktop}
            />
          )}
        </div>
        <header className={classes.header}>
          <Typography variant="h1" component="h1">
            {heading}
          </Typography>
          <div className={classes.controls}>
            {controls && desktop ? (
              <Fragment>
                <CreateFolderModule />
                <UploadFileModule />
              </Fragment>
            ) : (
              controls &&
              !desktop && (
                <MenuDropdown
                  classNames={{
                    icon: classes.dropdownIcon,
                    options: classes.dropdownOptions,
                  }}
                  autoclose={false}
                  anchor="bottom-right"
                  animation="none"
                  indicator={PlusIcon}
                  menuItems={[
                    {
                      contents: (
                        <CreateFolderModule
                          variant="primary"
                          fullsize
                          classNames={{
                            button: classes.mobileButton,
                          }}
                        />
                      ),
                    },
                    {
                      contents: (
                        <UploadFileModule
                          variant="primary"
                          fullsize
                          classNames={{
                            button: classes.mobileButton,
                          }}
                        />
                      ),
                    },
                  ]}
                />
              )
            )}
          </div>
        </header>
        <Divider className={classes.divider} />
        {items.length === 0 ? (
          <section className={classes.noFiles}>
            <EmptySvg />
            <Typography variant="h4" component="h4">
              <Trans>No files to show</Trans>
            </Typography>
          </section>
        ) : (
          <Table
            fullWidth={true}
            // dense={true}
            striped={true}
            hover={true}
          >
            {desktop && (
              <TableHead>
                <TableRow
                  onDragEnter={() => {
                    if (uploadTarget !== currentPath) {
                      setUploadTarget(currentPath)
                    }
                  }}
                  type="grid"
                  className={classes.tableRow}
                >
                  <TableHeadCell>
                    <CheckboxInput
                      value={selected.length === items.length}
                      onChange={() => toggleAll()}
                    />
                  </TableHeadCell>
                  <TableHeadCell>
                    {/* 
                        Icon
                      */}
                  </TableHeadCell>
                  <TableHeadCell
                    sortButtons={true}
                    align="left"
                    onSortChange={() => handleSortToggle("name")}
                    sortDirection={column === "name" ? direction : undefined}
                    sortActive={column === "name"}
                  >
                    <Trans>Name</Trans>
                  </TableHeadCell>
                  <TableHeadCell
                    sortButtons={true}
                    align="left"
                    onSortChange={() => handleSortToggle("date_uploaded")}
                    sortDirection={
                      column === "date_uploaded" ? direction : undefined
                    }
                    sortActive={column === "date_uploaded"}
                  >
                    <Trans>Date uploaded</Trans>
                  </TableHeadCell>
                  <TableHeadCell
                    sortButtons={true}
                    align="left"
                    onSortChange={() => handleSortToggle("size")}
                    sortDirection={column === "size" ? direction : undefined}
                    sortActive={column === "size"}
                  >
                    <Trans>Size</Trans>
                  </TableHeadCell>
                  <TableHeadCell>{/* Menu */}</TableHeadCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {!desktop &&
                uploadsInProgress
                  .filter(
                    (uploadInProgress) =>
                      uploadInProgress.path === currentPath &&
                      !uploadInProgress.complete &&
                      !uploadInProgress.error,
                  )
                  .map((uploadInProgress) => (
                    <TableRow
                      key={uploadInProgress.id}
                      className={classes.tableRow}
                      type="grid"
                    >
                      <TableCell className={classes.progressIcon}>
                        <CircularProgressBar
                          progress={uploadInProgress.progress}
                          size="small"
                          width={15}
                        />
                      </TableCell>
                      <TableCell align="left">
                        {uploadInProgress.noOfFiles > 1
                          ? `Uploading ${uploadInProgress.noOfFiles} files`
                          : uploadInProgress.fileName}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
              {items.map((file: IFile, index: number) => (
                <FileOrFolderView
                  key={index}
                  index={index}
                  file={file}
                  files={files}
                  uploadTarget={uploadTarget}
                  currentPath={currentPath}
                  dropActive={dropActive}
                  setIsDraggingFile={setIsDraggingFile}
                  setUploadTarget={setUploadTarget}
                  updateCurrentPath={updateCurrentPath}
                  selected={selected}
                  handleSelect={handleSelect}
                  editing={editing}
                  setEditing={setEditing}
                  RenameSchema={RenameSchema}
                  handleRename={handleRename}
                  handleMove={handleMove}
                  deleteFile={deleteFile}
                  downloadFile={downloadFile}
                  setPreviewFileIndex={setPreviewFileIndex}
                  desktop={desktop}
                />
              ))}
            </TableBody>
          </Table>
        )}
        {files && previewFileIndex !== undefined && (
          <FilePreviewModal
            file={files[previewFileIndex]}
            closePreview={clearPreview}
            nextFile={
              previewFileIndex < files.length - 1 ? setNextPreview : undefined
            }
            previousFile={previewFileIndex > 0 ? setPreviousPreview : undefined}
          />
        )}
        <UploadProgressModals />
      </article>
    </DndProvider>
  )
}

export default FileBrowserModule
