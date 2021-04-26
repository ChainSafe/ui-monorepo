import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useCallback, useEffect } from "react"
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
  CheckboxInput
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import { object, string } from "yup"
import EmptySvg from "../../../../Media/Empty.svg"
import clsx from "clsx"
import { t, Trans } from "@lingui/macro"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import { FileOperation, IFilesTableBrowserProps } from "../types"
import { FileSystemItem } from "../../../../Contexts/DriveContext"
import FileSystemItemRow from "./FileSystemItemRow"
import FilePreviewModal from "../../FilePreviewModal"
import UploadProgressModals from "../../UploadProgressModals"
import DownloadProgressModals from "../../DownloadProgressModals"
import CreateFolderModule from "../../CreateFolderModule"
import UploadFileModule from "../../UploadFileModule"
import MoveFileModule from "../MoveFileModal"
import FileInfoModal from "../FileInfoModal"
import { CONTENT_TYPES } from "../../../../Utils/Constants"
import { CSFTheme } from "../../../../Themes/types"
import MimeMatcher from "../../../../Utils/MimeMatcher"

interface IStyleProps {
  themeKey: string
}

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette, zIndex }: CSFTheme) => {
    const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
    const mobileGridSettings = "69px 3fr 45px !important"
    return createStyles({
      root: {
        position: "relative",
        [breakpoints.down("md")]: {
          marginLeft: constants.generalUnit * 2,
          marginRight: constants.generalUnit * 2
        },
        [breakpoints.up("md")]: {
          border: "1px solid transparent",
          padding: `0 ${constants.generalUnit}px`,
          borderRadius: constants.generalUnit / 4,
          minHeight: `calc(100vh - ${Number(constants.contentTopPadding)}px)`,
          "&.droppable": {
            borderColor: palette.additional["geekblue"][4]
          }
        }
        // transitionDuration: `${animation.transform}ms`,
      },
      header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit
        }
      },
      controls: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        "& > button": {
          marginLeft: constants.generalUnit
        }
      },
      breadCrumbContainer: {
        margin: `${constants.generalUnit * 2}px 0`,
        height: 22,
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit * 3,
          marginBottom: 0
        }
      },
      divider: {
        "&:before, &:after": {
          backgroundColor: palette.additional["gray"][4]
        },
        [breakpoints.up("md")]: {
          margin: `${constants.generalUnit * 3}px 0`
        },
        [breakpoints.down("md")]: {
          margin: `${constants.generalUnit * 3}px 0 0`
        }
      },
      noFiles: ({ themeKey }: IStyleProps) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "25vh",
        color: constants.filesTable.color,
        "& svg": {
          maxWidth: 180,
          marginBottom: constants.generalUnit * 3,
          "& path": {
            "&:first-child": {
              fill: themeKey === "dark" ? palette.additional.gray[2] : ""
            },
            "&:nth-child(2)": {
              stroke: themeKey === "dark" ? palette.additional.gray[2] : "",
              fill: themeKey === "dark" ? "transparent" : ""
            },
            "&:last-child": {
              fill: themeKey === "dark" ? palette.additional.gray[4] : "",
              stroke: themeKey === "dark" ? palette.additional.gray[2] : ""
            }
          }
        }
      }),
      tableRow: {
        border: "2px solid transparent",
        transitionDuration: `${animation.transform}ms`,
        [breakpoints.up("md")]: {
          gridTemplateColumns: desktopGridSettings
        },
        [breakpoints.down("md")]: {
          gridTemplateColumns: mobileGridSettings
        }
      },
      fileIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
          width: constants.generalUnit * 2.5
        }
      },
      progressIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      },
      dropdownIcon: {
        "& svg": {
          height: 20,
          width: 20
        }
      },
      dropdownOptions: {
        "& > *": {
          padding: 0
        }
      },
      mobileButton: {
        padding: `${constants.generalUnit * 2}px !important`,
        borderRadius: 0,
        justifyContent: "flex-start",
        "& > *:last-child": {
          display: "block",
          width: "calc(100% - 24px)",
          textAlign: "center"
        }
      },
      dropNotification: {
        display: "block",
        position: "fixed",
        zIndex: zIndex?.layer4,
        bottom: 0,
        transform: "translateX(-50%)",
        backgroundColor: palette.common.black.main,
        color: constants.filesTable.uploadText,
        opacity: 0,
        visibility: "hidden",
        transitionDuration: `${animation.transform}ms`,
        textAlign: "center",
        width: 260,
        padding: `${constants.generalUnit}px 0`,
        [breakpoints.up("md")]: {
          left: `calc(50% + ${Number(constants.navWidth) / 2}px)`
        },
        "&.active": {
          opacity: 1,
          visibility: "visible"
        }
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
          marginBottom: constants.generalUnit * 2
        }
      },
      showLoadingContainer: {
        visibility: "visible",
        opacity: 1
      },
      fadeOutLoading: {
        opacity: 0.2,
        transition: `opacity ${animation.transform * 3}ms`
      },
      tableHead: {
        marginTop: constants.generalUnit * 3
      },
      bulkOperations: {
        display: "flex",
        flexDirection: "row",
        marginTop: constants.generalUnit * 3,
        "& > *": {
          marginRight: constants.generalUnit
        }
      },
      confirmDeletionDialog: {
        top: "50%"
      }
    })
  }
)

// Sorting
const sortFoldersFirst = (a: FileSystemItem, b: FileSystemItem) =>
  a.isFolder && a.content_type !== b.content_type ? -1 : 1

const FilesTableView = ({
  heading,
  controls = true,
  sourceFiles,
  handleUploadOnDrop,
  bulkOperations,
  updateCurrentPath,
  crumbs,
  handleRename,
  handleMove,
  downloadFile,
  deleteFiles,
  recoverFile,
  viewFolder,
  currentPath,
  loadingCurrentPath,
  uploadsInProgress,
  showUploadsInTable,
  allowDropUpload,
  itemOperations,
  getPath,
  isSearch
}: IFilesTableBrowserProps) => {
  const { themeKey, desktop } = useThemeSwitcher()
  const classes = useStyles({ themeKey })
  const [editing, setEditing] = useState<string | undefined>()
  const [direction, setDirection] = useState<SortDirection>("descend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
  const [selectedCids, setSelectedCids] = useState<string[]>([])
  const [previewFileIndex, setPreviewFileIndex] = useState<number | undefined>()
  const items: FileSystemItem[] = useMemo(() => {
    switch (direction) {
    default: {
      // case "descend": {
      // case "name": {
      return sourceFiles
        .sort((a, b) =>
          a.name > b.name ? -1 : 1
        )
        .sort(sortFoldersFirst)
    }
    case "descend": {
      switch (column) {
      default: {
        // case "name": {
        return sourceFiles
          .sort((a, b) =>
            a.name > b.name ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      case "size": {
        return sourceFiles
          .sort((a, b) =>
            a.size > b.size ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      case "date_uploaded": {
        return sourceFiles
          .sort((a, b) =>
            a.created_at > b.created_at ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      }
    }
    case "ascend": {
      switch (column) {
      default: {
        // case "name": {
        return sourceFiles
          .sort((a, b) =>
            a.name < b.name ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      case "size": {
        return sourceFiles
          .sort((a, b) =>
            a.size < b.size ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      case "date_uploaded": {
        return sourceFiles
          .sort((a, b) =>
            a.created_at < b.created_at ? -1 : 1
          )
          .sort(sortFoldersFirst)
      }
      }
    }
    }
  }, [sourceFiles, direction, column])

  const files = useMemo(
    () => items.filter((i) => !i.isFolder)
    , [items]
  )

  const selectedFiles = useMemo(
    () => files.filter((file) => selectedCids.includes(file.cid))
    , [files, selectedCids]
  )

  const handleSortToggle = (
    targetColumn: "name" | "size" | "date_uploaded"
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
  const handleSelect = useCallback((cid: string) => {
    if (selectedCids.includes(cid)) {
      setSelectedCids(selectedCids.filter((selectedCid: string) => selectedCid !== cid))
    } else {
      setSelectedCids([...selectedCids, cid])
    }
  }, [selectedCids])

  const toggleAll = () => {
    if (selectedCids.length === items.length) {
      setSelectedCids([])
    } else {
      setSelectedCids([...items.map((file: FileSystemItem) => file.cid)])
    }
  }

  const invalidFilenameRegex = new RegExp("/")
  const renameSchema = object().shape({
    fileName: string()
      .min(1, "Please enter a file name")
      .max(65, "File name length exceeded")
      .test(
        "Invalid name",
        "File name cannot contain '/' character",
        (val: string | null | undefined) =>
          !invalidFilenameRegex.test(val || "")
      )
      .required("File name is required")
  })

  const [{ isOverUploadable, isOverBrowser }, dropBrowserRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        handleUploadOnDrop &&
          currentPath &&
          handleUploadOnDrop(item.files, item.items, currentPath)
      }
    },
    collect: (monitor) => ({
      isOverBrowser: monitor.isOver(),
      isOverUploadable: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  })

  // Modals
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isMoveFileModalOpen, setIsMoveFileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingFiles, setIsDeletingFiles] = useState(false)
  const [fileInfoPath, setFileInfoPath] = useState<string | undefined>(
    undefined
  )

  // Bulk operations
  const [validBulkOps, setValidBulkOps] = useState<FileOperation[]>([])
  useEffect(() => {
    if (bulkOperations) {
      let filteredList: FileOperation[] = [
        "delete",
        "download",
        "info",
        "move",
        "preview",
        "rename",
        "share"
      ]
      for (let i = 0; i < selectedCids.length; i++) {
        const contentType = items.find((item) => item.cid === selectedCids[i])
          ?.content_type

        if (contentType) {
          if (contentType === CONTENT_TYPES.Directory) {
            const validList = filteredList.filter(
              (op: FileOperation) =>
                bulkOperations[contentType].indexOf(op) >= 0
            )
            if (validList.length > 0) {
              filteredList = filteredList.filter(
                (existingOp: FileOperation) =>
                  validList.indexOf(existingOp) >= 0
              )
            }
          } else {
            const validList = filteredList.filter(
              (op: FileOperation) =>
                bulkOperations[CONTENT_TYPES.File].indexOf(op) >= 0
            )
            if (validList.length > 0) {
              filteredList = filteredList.filter(
                (existingOp: FileOperation) =>
                  validList.indexOf(existingOp) >= 0
              )
            }
          }
        } else {
          const validList = filteredList.filter(
            (op: FileOperation) =>
              bulkOperations[CONTENT_TYPES.File].indexOf(op) >= 0
          )
          if (validList.length > 0) {
            filteredList = filteredList.filter(
              (existingOp: FileOperation) => validList.indexOf(existingOp) >= 0
            )
          }
        }
      }
      setValidBulkOps(filteredList)
    }
  }, [selectedCids, items, bulkOperations])

  const handleDeleteFiles = useCallback(() => {
    if(!deleteFiles) return

    setIsDeletingFiles(true)
    deleteFiles(selectedCids)
      .catch(console.error)
      .finally(() => {
        setIsDeletingFiles(false)
        setSelectedCids([])
        setIsDeleteModalOpen(false)
      })
  }, [deleteFiles, selectedCids])

  const getItemOperations =  useCallback((contentType: string) => {
    const result = Object.keys(itemOperations).reduce((acc: FileOperation[], item: string) => {
      const matcher = new MimeMatcher(item)
      // Prevent Files options from being added to Directory options  
      if (!(contentType === CONTENT_TYPES.Directory && item === CONTENT_TYPES.File) && matcher.match(contentType)) {
        acc.push(...itemOperations[item])
      }
      return acc
    }, [])
    return [...new Set(result)]
  }, [itemOperations])

  const resetSelectedCids = useCallback(() => {
    setSelectedCids([])
  }, [])

  return (
    <article
      className={clsx(classes.root, {
        droppable: isOverUploadable && allowDropUpload
      })}
      ref={!isUploadModalOpen && allowDropUpload ? dropBrowserRef : null}
    >
      <div
        className={clsx(classes.dropNotification, { active: isOverBrowser })}
      >
        <Typography
          variant="h4"
          component="p"
        >
          <Trans>Drop to upload files</Trans>
        </Typography>
      </div>
      <div className={classes.breadCrumbContainer}>
        {crumbs ? (
          <Breadcrumb
            crumbs={crumbs}
            homeOnClick={() => updateCurrentPath("/", undefined, true)}
            showDropDown={!desktop}
          />
        ) : null}
      </div>
      <header className={classes.header}>
        <Typography
          variant="h1"
          component="h1"
        >
          {heading}
        </Typography>
        <div className={classes.controls}>
          {controls && desktop ? (
            <>
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
                onClick={() => setIsUploadModalOpen(true)}
                variant="outline"
                size="large"
              >
                <UploadIcon />
                <span>
                  <Trans>Upload</Trans>
                </span>
              </Button>
            </>
          ) : (
            controls &&
            !desktop && (
              <MenuDropdown
                classNames={{
                  icon: classes.dropdownIcon,
                  options: classes.dropdownOptions
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
                    )
                  },
                  {
                    contents: (
                      <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        variant="primary"
                        fullsize
                        className={classes.mobileButton}
                      >
                        <UploadIcon />
                        <span>
                          <Trans>Upload</Trans>
                        </span>
                      </Button>
                    )
                  }
                ]}
              />
            )
          )}
        </div>
      </header>
      <Divider className={classes.divider} />
      {selectedCids.length > 0 && validBulkOps.length > 0 && (
        <section className={classes.bulkOperations}>
          {validBulkOps.indexOf("move") >= 0 && (
            <Button
              onClick={() => setIsMoveFileModalOpen(true)}
              variant="outline"
            >
              <Trans>Move selected</Trans>
            </Button>
          )}
          {validBulkOps.indexOf("delete") >= 0 && (
            <Button
              onClick={() => {setIsDeleteModalOpen(true)}}
              variant="outline"
            >
              <Trans>Delete selected</Trans>
            </Button>
          )}
        </section>
      )}
      <div
        className={clsx(
          classes.loadingContainer,
          loadingCurrentPath && classes.showLoadingContainer
        )}
      >
        <Loading
          size={24}
          type="light"
        />
        <Typography
          variant="body2"
          component="p"
        >
          <Trans>One sec, getting files ready...</Trans>
        </Typography>
      </div>
      {(desktop && items.length === 0) ||
      (!desktop && items.length === 0 && uploadsInProgress?.length === 0) ? (
          <section
            className={clsx(
              classes.noFiles,
              loadingCurrentPath && classes.fadeOutLoading
            )}
          >
            <EmptySvg />
            <Typography
              variant="h4"
              component="h4"
            >
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
              <TableHead className={classes.tableHead}>
                <TableRow
                  type="grid"
                  className={classes.tableRow}
                >
                  <TableHeadCell>
                    <CheckboxInput
                      value={selectedCids.length === items.length}
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
              showUploadsInTable &&
              uploadsInProgress
                ?.filter(
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
                        ? t`Uploading ${uploadInProgress.noOfFiles} files`
                        : uploadInProgress.fileName}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              {items.map((file, index) => (
                <FileSystemItemRow
                  key={index}
                  index={index}
                  file={file}
                  files={files}
                  currentPath={currentPath}
                  updateCurrentPath={updateCurrentPath}
                  selected={selectedCids}
                  handleSelect={handleSelect}
                  editing={editing}
                  setEditing={setEditing}
                  renameSchema={renameSchema}
                  handleRename={async (path: string, newPath: string) => {
                    handleRename && (await handleRename(path, newPath))
                    setEditing(undefined)
                  }}
                  handleMove={handleMove}
                  deleteFile={() => {
                    setSelectedCids([file.cid])
                    setIsDeleteModalOpen(true)
                  }}
                  recoverFile={recoverFile}
                  downloadFile={downloadFile}
                  viewFolder={viewFolder}
                  handleUploadOnDrop={handleUploadOnDrop}
                  setPreviewFileIndex={setPreviewFileIndex}
                  moveFile={() => {
                    setSelectedCids([file.cid])
                    setIsMoveFileModalOpen(true)
                  }}
                  setFileInfoPath={setFileInfoPath}
                  itemOperations={getItemOperations(file.content_type)}
                  resetSelectedFiles={resetSelectedCids}
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
          path={isSearch && getPath ? getPath(files[previewFileIndex].cid) : undefined}
        />
      )}
      <Dialog
        active={isDeleteModalOpen}
        reject={() => setIsDeleteModalOpen(false)}
        accept={handleDeleteFiles}
        requestMessage={t`You are about to delete ${selectedCids.length} file(s).`}
        rejectText = {t`Cancel`}
        acceptText = {t`Confirm`}
        acceptButtonProps={{ loading: isDeletingFiles, disabled: isDeletingFiles }}
        rejectButtonProps={{ disabled: isDeletingFiles }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
      />
      <UploadProgressModals />
      <DownloadProgressModals />
      <CreateFolderModule
        modalOpen={createFolderModalOpen}
        close={() => setCreateFolderModalOpen(false)}
      />
      <UploadFileModule
        modalOpen={isUploadModalOpen}
        close={() => setIsUploadModalOpen(false)}
      />
      <MoveFileModule
        currentPath={currentPath}
        filesToMove={selectedFiles}
        modalOpen={isMoveFileModalOpen}
        onClose={() => {
          setIsMoveFileModalOpen(false)
          setSelectedCids([])
        }}
        onCancel={() => setIsMoveFileModalOpen(false)}
      />
      <FileInfoModal
        fileInfoPath={fileInfoPath}
        close={() => setFileInfoPath(undefined)}
      />
    </article>
  )
}

export default FilesTableView
