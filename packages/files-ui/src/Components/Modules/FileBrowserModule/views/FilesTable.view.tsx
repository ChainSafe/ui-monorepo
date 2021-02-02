import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@chainsafe/common-theme"
import React, { Fragment } from "react"
import {
  Divider,
  MenuDropdown,
  PlusIcon,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography,
  Breadcrumb,
  CircularProgressBar,
  Button,
  PlusCircleIcon,
  UploadIcon,
  Dialog,
  Loading,
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import { object, string } from "yup"
import EmptySvg from "../../../../Media/Empty.svg"
import clsx from "clsx"
import { t, Trans } from "@lingui/macro"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import { IFileConfigured, IFilesTableBrowserProps } from "../types"
import { FileSystemItem, useDrive } from "../../../../Contexts/DriveContext"
import FileSystemItemRow from "./FileSystemItemRow"
import FilePreviewModal from "../../FilePreviewModal"
import UploadProgressModals from "../../UploadProgressModals"
import DownloadProgressModals from "../../DownloadProgressModals"
import CreateFolderModule from "../../CreateFolderModule"
import UploadFileModule from "../../UploadFileModule"
import MoveFileModule from "../MoveFileModal"
import FileInfoModal from "../FileInfoModal"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette, zIndex }: ITheme) => {
    // const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
    const desktopGridSettings = "50px 3fr 190px 60px !important"
    const mobileGridSettings = "69px 3fr 45px !important"
    return createStyles({
      root: {
        position: "relative",
        [breakpoints.down("md")]: {
          paddingLeft: constants.generalUnit * 2,
          paddingRight: constants.generalUnit * 2,
        },
        [breakpoints.up("md")]: {
          border: `1px solid transparent`,
          padding: `0 ${constants.generalUnit}px`,
          borderRadius: constants.generalUnit / 4,
          minHeight: `calc(100vh - ${constants.contentTopPadding as number}px)`,
          "&.droppable": {
            borderColor: palette.additional["geekblue"][4],
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
      mobileButton: {
        padding: `${constants.generalUnit * 2}px !important`,
        borderRadius: 0,
        justifyContent: "flex-start",
        "& > *:last-child": {
          display: "block",
          width: `calc(100% - 24px)`,
          textAlign: "center",
        },
      },
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
      loadingContainer: {
        position: "absolute",
        width: "100%",
        paddingTop: constants.generalUnit * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 0,
        visibility: "hidden",
        transition: `opacity ${animation.transform * 3}ms`,
        "& svg": {
          marginBottom: constants.generalUnit * 2,
        },
      },
      showLoadingContainer: {
        visibility: "visible",
        opacity: 1,
      },
      fadeOutLoading: {
        opacity: 0.2,
        transition: `opacity ${animation.transform * 3}ms`,
      },
    })
  },
)

const FilesTableView: React.FC<IFilesTableBrowserProps> = ({
  heading = "My Files",
  controls = true,
  fileOperations,
  folderOperations,
  sourceFiles,
  handleUploadOnDrop,
  updateCurrentPath,
  crumbs,
  handleRename,
  handleMove,
  downloadFile,
  deleteFile,
  currentPath,
}: IFilesTableBrowserProps) => {
  const classes = useStyles()
  const { uploadsInProgress, loadingCurrentPath } = useDrive()
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
  const sortFoldersFirst = (a: FileSystemItem, b: FileSystemItem) =>
    a.isFolder && a.content_type !== b.content_type ? -1 : 1

  const items: IFileConfigured[] = useMemo(() => {
    if (!sourceFiles) return []

    switch (direction) {
      default: {
        // case "descend": {
        // case "name": {
        return sourceFiles
          .sort((a: IFileConfigured, b: IFileConfigured) =>
            a.name > b.name ? -1 : 1,
          )
          .sort(sortFoldersFirst)
      }
      case "descend": {
        switch (column) {
          default: {
            // case "name": {
            return sourceFiles
              .sort((a: IFileConfigured, b: IFileConfigured) =>
                a.name > b.name ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
          case "size": {
            return sourceFiles
              .sort((a: FileSystemItem, b: FileSystemItem) =>
                a.size > b.size ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
          // case "date_uploaded": {
          //   return sourceFiles
          //     .sort((a: IFileConfigured, b: IFileConfigured) =>
          //       a.date_uploaded > b.date_uploaded ? -1 : 1,
          //     )
          //     .sort(sortFoldersFirst)
          // }
        }
      }
      case "ascend": {
        switch (column) {
          default: {
            // case "name": {
            return sourceFiles
              .sort((a: IFileConfigured, b: IFileConfigured) =>
                a.name < b.name ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
          case "size": {
            return sourceFiles
              .sort((a: IFileConfigured, b: IFileConfigured) =>
                a.size < b.size ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
          // case "date_uploaded": {
          //   return sourceFiles
          //     .sort((a: IFileConfigured, b: IFileConfigured) =>
          //       a.date_uploaded < b.date_uploaded ? -1 : 1,
          //     )
          //     .sort(sortFoldersFirst)
          // }
        }
      }
    }
  }, [sourceFiles, direction, column])

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

  // const toggleAll = () => {
  //   if (selected.length === items.length) {
  //     setSelected([])
  //   } else {
  //     setSelected([...items.map((file: IFile) => file.cid)])
  //   }
  // }

  const invalidFilenameRegex = new RegExp("/")
  const RenameSchema = object().shape({
    fileName: string()
      .min(1, "Please enter a file name")
      .max(65, "File name length exceeded")
      .test(
        "Invalid name",
        "File name cannot contain '/' character",
        (val: string | null | undefined) =>
          !invalidFilenameRegex.test(val || ""),
      )
      .required("File name is required"),
  })

  // Media queries
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  const [{ isOverUploadable, isOverBrowser }, dropBrowserRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        handleUploadOnDrop(item.files, item.items, currentPath)
      }
    },
    collect: (monitor) => ({
      isOverBrowser: monitor.isOver(),
      isOverUploadable: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })

  // Modals
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [moveFileData, setMoveFileData] = useState<
    { modal: boolean; file: FileSystemItem } | undefined
  >(undefined)
  const [deleteDialogOpen, setDeleteDialog] = useState<() => void | undefined>()
  const [fileInfoPath, setFileInfoPath] = useState<string | undefined>(
    undefined,
  )

  return (
    <article
      className={clsx(classes.root, { droppable: isOverUploadable })}
      ref={!uploadModalOpen ? dropBrowserRef : null}
    >
      <div
        className={clsx(classes.dropNotification, { active: isOverBrowser })}
      >
        <Typography variant="h4" component="p">
          <Trans>Drop to upload files</Trans>
        </Typography>
      </div>
      <div className={classes.breadCrumbContainer}>
        {/* {crumbs.length > 0 && ( */}
        <Breadcrumb
          crumbs={crumbs}
          homeOnClick={() => updateCurrentPath("/")}
          showDropDown={!desktop}
        />
        {/* )} */}
      </div>
      <header className={classes.header}>
        <Typography variant="h1" component="h1">
          {heading}
        </Typography>
        <div className={classes.controls}>
          {controls && desktop ? (
            <Fragment>
              <Button
                onClick={() => setCreateFolderModalOpen(true)}
                variant="outline"
                size="large"
              >
                <PlusCircleIcon />
                <span>
                  <Trans>New folder</Trans>
                </span>
              </Button>
              <Button
                onClick={() => setUploadModalOpen(true)}
                variant="outline"
                size="large"
              >
                <UploadIcon />
                <span>
                  <Trans>Upload</Trans>
                </span>
              </Button>
            </Fragment>
          ) : (
            controls &&
            !desktop && (
              <MenuDropdown
                classNames={{
                  icon: classes.dropdownIcon,
                  options: classes.dropdownOptions,
                }}
                autoclose={true}
                anchor="bottom-right"
                animation="none"
                indicator={PlusIcon}
                menuItems={[
                  {
                    contents: (
                      <Button
                        onClick={() => setCreateFolderModalOpen(true)}
                        variant="primary"
                        size="large"
                        className={classes.mobileButton}
                        fullsize
                      >
                        <PlusCircleIcon />
                        <span>
                          <Trans>Create folder</Trans>
                        </span>
                      </Button>
                    ),
                  },
                  {
                    contents: (
                      <Button
                        onClick={() => setUploadModalOpen(true)}
                        variant="primary"
                        fullsize
                        className={classes.mobileButton}
                      >
                        <UploadIcon />
                        <span>
                          <Trans>Upload</Trans>
                        </span>
                      </Button>
                    ),
                  },
                ]}
              />
            )
          )}
        </div>
      </header>
      <Divider className={classes.divider} />
      <div
        className={clsx(
          classes.loadingContainer,
          loadingCurrentPath && classes.showLoadingContainer,
        )}
      >
        <Loading size={24} type="light" />
        <Typography variant="body2" component="p">
          <Trans>One sec, getting files ready...</Trans>
        </Typography>
      </div>
      {(desktop && items.length === 0) ||
      (!desktop && items.length === 0 && uploadsInProgress.length === 0) ? (
        <section
          className={clsx(
            classes.noFiles,
            loadingCurrentPath && classes.fadeOutLoading,
          )}
        >
          <EmptySvg />
          <Typography variant="h4" component="h4">
            <Trans>No files to show</Trans>
          </Typography>
        </section>
      ) : (
        <Table
          fullWidth={true}
          striped={true}
          hover={true}
          className={clsx(loadingCurrentPath && classes.fadeOutLoading)}
        >
          {desktop && (
            <TableHead>
              <TableRow type="grid" className={classes.tableRow}>
                {/* <TableHeadCell>
                  <CheckboxInput
                    value={selected.length === items.length}
                    disabled
                    onChange={() => toggleAll()}
                  />
                </TableHeadCell> */}
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
                {/* <TableHeadCell
                  sortButtons={true}
                  align="left"
                  onSortChange={() => handleSortToggle("date_uploaded")}
                  sortDirection={
                    column === "date_uploaded" ? direction : undefined
                  }
                  sortActive={column === "date_uploaded"}
                >
                  <Trans>Date uploaded</Trans>
                </TableHeadCell> */}
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
            {items.map((file: IFileConfigured, index: number) => (
              <FileSystemItemRow
                key={index}
                index={index}
                file={file}
                files={files}
                currentPath={currentPath}
                updateCurrentPath={updateCurrentPath}
                selected={selected}
                handleSelect={handleSelect}
                editing={editing}
                setEditing={setEditing}
                RenameSchema={RenameSchema}
                handleRename={async (path: string, newPath: string) => {
                  await handleRename(path, newPath)
                  setEditing(undefined)
                }}
                handleMove={handleMove}
                deleteFile={(cid: string) =>
                  setDeleteDialog(() => () => {
                    deleteFile(cid)
                    setDeleteDialog(undefined)
                  })
                }
                downloadFile={downloadFile}
                handleUploadOnDrop={handleUploadOnDrop}
                setPreviewFileIndex={setPreviewFileIndex}
                setMoveFileData={setMoveFileData}
                setFileInfoPath={setFileInfoPath}
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
      <Dialog
        active={deleteDialogOpen !== undefined}
        reject={() => setDeleteDialog(undefined)}
        accept={() => deleteDialogOpen && deleteDialogOpen()}
        requestMessage={t`Are you sure you wish to delete?`}
      />
      <UploadProgressModals />
      <DownloadProgressModals />
      <CreateFolderModule
        modalOpen={createFolderModalOpen}
        close={() => setCreateFolderModalOpen(false)}
      />
      <UploadFileModule
        modalOpen={uploadModalOpen}
        close={() => setUploadModalOpen(false)}
      />
      <MoveFileModule
        currentPath={currentPath}
        file={moveFileData?.file}
        modalOpen={moveFileData ? moveFileData.modal : false}
        close={() => setMoveFileData(undefined)}
      />
      <FileInfoModal
        fileInfoPath={fileInfoPath}
        close={() => setFileInfoPath(undefined)}
      />
    </article>
  )
}

export default FilesTableView
