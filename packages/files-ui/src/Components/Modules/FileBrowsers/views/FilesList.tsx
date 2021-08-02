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
  CheckboxInput,
  useHistory,
  GridIcon,
  TableIcon
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import EmptySvg from "../../../../Media/Empty.svg"
import clsx from "clsx"
import { plural, t, Trans } from "@lingui/macro"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import { BrowserView, FileOperation, MoveModalMode } from "../types"
import { FileSystemItem as FileSystemItemType } from "../../../../Contexts/FilesContext"
import FileSystemItem from "./FileSystemItem/FileSystemItem"
import FilePreviewModal from "../../FilePreviewModal"
import UploadProgressModals from "../../UploadProgressModals"
import DownloadProgressModals from "../../DownloadProgressModals"
import CreateFolderModal from "../CreateFolderModal"
import UploadFileModule from "../../UploadFileModule"
import MoveFileModal from "../MoveFileModal"
import FileInfoModal from "../FileInfoModal"
import { CONTENT_TYPES } from "../../../../Utils/Constants"
import { CSFTheme } from "../../../../Themes/types"
import MimeMatcher from "../../../../Utils/MimeMatcher"
import { useLanguageContext } from "../../../../Contexts/LanguageContext"
import { getPathWithFile } from "../../../../Utils/pathUtils"
import SurveyBanner from "../../../SurveyBanner"
import { DragPreviewLayer } from "./DragPreviewLayer"
import { useFileBrowser } from "../../../../Contexts/FileBrowserContext"
import ReportFileModal from "../ReportFileModal"
import CopyToSharedFolderModal from "../CopyToSharedFolderModal"
import SharedUsers from "../../../Elements/SharedUsers"

const baseOperations:  FileOperation[] = ["download", "info", "preview"]
const readerOperations: FileOperation[] = [...baseOperations, "report"]
const ownerOperations: FileOperation[] = [...baseOperations, "delete", "move", "rename"]
const csfOperations:  FileOperation[] = [...ownerOperations, "share"]
const writerOperations: FileOperation[] = [...ownerOperations, "report"]

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
            borderColor: palette.primary.main
          }
        }
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
          width: 20,
          fill: palette.text.primary
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
        minHeight: constants.generalUnit * 4.2, // reserve space for buttons for the interface not to jump when they get visible
        "& > *": {
          marginRight: constants.generalUnit
        }
      },
      confirmDeletionDialog: {
        top: "50%"
      },
      gridRoot: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
        gridColumnGap: constants.generalUnit * 2,
        gridRowGap: constants.generalUnit * 2,
        marginBottom: constants.generalUnit * 4,
        marginTop: constants.generalUnit * 4,
        [breakpoints.down("lg")]: {
          gridTemplateColumns: "1fr 1fr 1fr 1fr"
        },
        [breakpoints.down("md")]: {
          margin: `${constants.generalUnit * 4}px 0`
        },
        [breakpoints.down("sm")]: {
          gridTemplateColumns: "1fr 1fr",
          margin: `${constants.generalUnit * 2}px 0`
        }
      },
      viewToggleButton: {
        border: "none",
        "& svg": {
          marginTop: "2px",
          width: "20px",
          height: "20px"
        }
      },
      users: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end"
      }
    })
  }
)

// Sorting
const sortFoldersFirst = (a: FileSystemItemType, b: FileSystemItemType) =>
  a.isFolder && a.content_type !== b.content_type ? -1 : 1

  interface Props {
    isShared?: boolean
  }
const FilesList = ({ isShared = false }: Props) => {
  const { themeKey, desktop } = useThemeSwitcher()
  const [isReportFileModalOpen, setIsReportFileModalOpen] = useState(false)
  const [isFileInfoModalOpen, setIsFileInfoModalOpen] = useState(false)
  const [isCopyToSharedFolerModalOpen, setIsCopyToSharedFolerModalOpen] = useState(false)

  const {
    heading,
    controls = true,
    sourceFiles,
    handleUploadOnDrop,
    bulkOperations,
    crumbs,
    renameItem: handleRename,
    deleteItems: deleteFiles,
    viewFolder,
    currentPath,
    refreshContents,
    loadingCurrentPath,
    uploadsInProgress,
    showUploadsInTable,
    allowDropUpload,
    itemOperations,
    getPath,
    moduleRootPath,
    isSearch,
    withSurvey,
    bucket
  } = useFileBrowser()
  const classes = useStyles({ themeKey })
  const [editing, setEditing] = useState<string | undefined>()
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [isSurveyBannerVisible, setIsSurveyBannerVisible] = useState(true)
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
  const [selectedCids, setSelectedCids] = useState<string[]>([])
  const [fileIndex, setFileIndex] = useState<number | undefined>()
  const { selectedLocale } = useLanguageContext()
  const { redirect } = useHistory()
  const { permission } = bucket || {}
  const items: FileSystemItemType[] = useMemo(() => {
    let temp = []

    switch (column) {
    default: {
      // case "name": {
      temp = sourceFiles.sort((a, b) => {
        return a.name.localeCompare(b.name, selectedLocale, {
          sensitivity: "base"
        })
      })
      break
    }
    case "size": {
      temp = sourceFiles
        .sort((a, b) => (a.size < b.size ? -1 : 1))
        .sort(sortFoldersFirst)
      break
    }
    case "date_uploaded": {
      temp = sourceFiles
        .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
        .sort(sortFoldersFirst)
      break
    }
    }
    return direction === "descend"
      ? temp.reverse().sort(sortFoldersFirst)
      : temp.sort(sortFoldersFirst)
  }, [sourceFiles, direction, column, selectedLocale])

  const files = useMemo(() => items.filter((i) => !i.isFolder), [items])

  const selectedItems = useMemo(
    () => items.filter((file) => selectedCids.includes(file.cid)),
    [selectedCids, items]
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
      fileIndex !== undefined &&
      fileIndex < files.length - 1
    ) {
      setFileIndex(fileIndex + 1)
    }
  }

  const setPreviousPreview = () => {
    if (files && fileIndex !== undefined && fileIndex > 0) {
      setFileIndex(fileIndex - 1)
    }
  }

  const closePreview = () => {
    setFileIndex(undefined)
    setIsPreviewOpen(false)
  }

  // Selection logic
  const handleSelectCid = useCallback(
    (cid: string) => {
      if (selectedCids.includes(cid)) {
        setSelectedCids([])
      } else {
        setSelectedCids([cid])
      }
    },
    [selectedCids]
  )

  const handleAddToSelectedCids = useCallback(
    (cid: string) => {
      if (selectedCids.includes(cid)) {
        setSelectedCids(
          selectedCids.filter((selectedCid: string) => selectedCid !== cid)
        )
      } else {
        setSelectedCids([...selectedCids, cid])
      }
    },
    [selectedCids]
  )

  const toggleAll = useCallback(() => {
    if (selectedCids.length === items.length) {
      setSelectedCids([])
    } else {
      setSelectedCids([...items.map((file: FileSystemItemType) => file.cid)])
    }
  }, [setSelectedCids, items, selectedCids])

  const [{ isOverUploadable, isOverBrowser }, dropBrowserRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: any, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        handleUploadOnDrop &&
          currentPath &&
          handleUploadOnDrop(item.files, item.items, currentPath)
        refreshContents && refreshContents()
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isMoveFileModalOpen, setIsMoveFileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingFiles, setIsDeletingFiles] = useState(false)
  const [filePath, setFilePath] = useState<string | undefined>()
  const [moveModalMode, setMoveModalMode] = useState<MoveModalMode | undefined>()

  const [browserView, setBrowserView] = useState<BrowserView>("table")

  // Bulk operations
  const [validBulkOps, setValidBulkOps] = useState<FileOperation[]>([])

  useEffect(() => {
    if (!bulkOperations) return
    let fileOperations: FileOperation[] = csfOperations

    if (!!permission && isShared) {

      switch(permission) {
      case "owner":
        fileOperations = ownerOperations
        break
      case "writer":
        fileOperations = writerOperations
        break
      case "reader":
        fileOperations = readerOperations
        break
      }
    }

    for (let i = 0; i < selectedCids.length; i++) {
      const contentType = items.find((item) => item.cid === selectedCids[i])
        ?.content_type

      if (contentType) {
        if (contentType === CONTENT_TYPES.Directory) {
          const validList = fileOperations.filter(
            (op: FileOperation) =>
              bulkOperations[contentType].indexOf(op) >= 0
          )
          if (validList.length > 0) {
            fileOperations = fileOperations.filter(
              (existingOp: FileOperation) =>
                validList.indexOf(existingOp) >= 0
            )
          }
        } else {
          const validList = fileOperations.filter(
            (op: FileOperation) =>
              bulkOperations[CONTENT_TYPES.File].indexOf(op) >= 0
          )
          if (validList.length > 0) {
            fileOperations = fileOperations.filter(
              (existingOp: FileOperation) =>
                validList.indexOf(existingOp) >= 0
            )
          }
        }
      } else {
        const validList = fileOperations.filter(
          (op: FileOperation) =>
            bulkOperations[CONTENT_TYPES.File].indexOf(op) >= 0
        )
        if (validList.length > 0) {
          fileOperations = fileOperations.filter(
            (existingOp: FileOperation) => validList.indexOf(existingOp) >= 0
          )
        }
      }
    }
    setValidBulkOps(fileOperations)
  }, [selectedCids, items, bulkOperations, isShared, permission])

  const handleDeleteFiles = useCallback(() => {
    if (!deleteFiles) return

    setIsDeletingFiles(true)
    deleteFiles(selectedCids)
      .catch(console.error)
      .finally(() => {
        setIsDeletingFiles(false)
        setSelectedCids([])
        setIsDeleteModalOpen(false)
      })
  }, [deleteFiles, selectedCids])

  const getItemOperations = useCallback(
    (contentType: string) => {
      const result = Object.keys(itemOperations).reduce(
        (acc: FileOperation[], item: string) => {
          const matcher = new MimeMatcher(item)
          // Prevent Files options from being added to Directory options
          if (
            !(
              contentType === CONTENT_TYPES.Directory &&
              item === CONTENT_TYPES.File
            ) &&
            matcher.match(contentType)
          ) {
            acc.push(...itemOperations[item])
          }
          return acc
        },
        []
      )
      return [...new Set(result)]
    },
    [itemOperations]
  )

  const resetSelectedCids = useCallback(() => {
    setSelectedCids([])
  }, [])

  useEffect(() => {
    setSelectedCids([])
  }, [currentPath])

  const onHideSurveyBanner = useCallback(() => {
    setIsSurveyBannerVisible(false)
  }, [setIsSurveyBannerVisible])

  const handleViewFolder = useCallback((cid: string) => {
    viewFolder && viewFolder(cid)
  }, [viewFolder])

  const handleOpenMoveFileDialog = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMoveFileModalOpen(true)
  }, [])

  const handleOpenDeleteDialog = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteModalOpen(true)
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
      <DragPreviewLayer
        items={sourceFiles}
        previewType={browserView}
      />
      <div className={classes.breadCrumbContainer}>
        {crumbs && moduleRootPath && (
          <Breadcrumb
            crumbs={crumbs}
            homeOnClick={() => redirect(moduleRootPath)}
            showDropDown={!desktop}
          />
        )}
      </div>
      <header className={classes.header}>
        <Typography
          variant="h1"
          component="h1"
          data-cy="files-app-header"
        >
          {heading}
        </Typography>
        {isShared && bucket && (
          <div className={classes.users}>
            <SharedUsers bucket={bucket}/>
          </div>
        )}
        <div className={classes.controls}>
          {controls && desktop ? (
            <>
              <Button
                onClick={() =>
                  setBrowserView(browserView === "grid" ? "table" : "grid")
                }
                variant="outline"
                size="large"
                className={classes.viewToggleButton}
              >
                {browserView === "table" ? <GridIcon /> : <TableIcon />}
              </Button>
              {
                permission !== "reader" && (
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
                      data-cy="upload-modal-button"
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
                )
              }
            </>
          ) : (
            controls && !desktop && (
              <>
                <Button
                  onClick={() =>
                    setBrowserView(browserView === "grid" ? "table" : "grid")
                  }
                  variant="outline"
                  size="large"
                  className={classes.viewToggleButton}
                >
                  {browserView === "table" ? <GridIcon /> : <TableIcon />}
                </Button>
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
              </>
            )
          )}
        </div>
      </header>
      { withSurvey && !isShared && isSurveyBannerVisible
        ? <SurveyBanner onHide={onHideSurveyBanner}/>
        : <Divider className={classes.divider} />
      }

      <section className={classes.bulkOperations}>
        {selectedCids.length > 0 && (
          <>
            {validBulkOps.indexOf("move") >= 0 && (
              <Button
                onClick={(e) => {
                  handleOpenMoveFileDialog(e)
                  setMoveModalMode("move")
                }}
                variant="outline"
                testId="move-selected-file"
              >
                <Trans>Move selected</Trans>
              </Button>
            )}
            {validBulkOps.indexOf("recover") >= 0 && (
              <Button
                onClick={(e) => {
                  handleOpenMoveFileDialog(e)
                  setMoveModalMode("recover")
                }}
                variant="outline"
                testId="recover-selected-file"
              >
                <Trans>Recover selected</Trans>
              </Button>
            )}
            {validBulkOps.indexOf("delete") >= 0 && (
              <Button
                onClick={handleOpenDeleteDialog}
                variant="outline"
                testId="delete-selected-file"
              >
                <Trans>Delete selected</Trans>
              </Button>
            )}
          </>
        )}
      </section>
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
          <Trans>One sec, getting files ready…</Trans>
        </Typography>
      </div>
      {(desktop && items.length === 0) || (!desktop && items.length === 0 && uploadsInProgress?.length === 0)
        ? (
          <section
            className={clsx(
              classes.noFiles,
              loadingCurrentPath && classes.fadeOutLoading
            )}
          >
            <EmptySvg />
            <Typography variant="h4"
              component="h4">
              <Trans>No files to show</Trans>
            </Typography>
          </section>
        )
        : browserView === "table"
          ? (
            <Table
              fullWidth={true}
              striped={true}
              hover={true}
              className={clsx(loadingCurrentPath && classes.fadeOutLoading)}
            >
              {desktop && (
                <TableHead className={classes.tableHead}>
                  <TableRow type="grid"
                    className={classes.tableRow}>
                    <TableHeadCell>
                      <CheckboxInput
                        value={selectedCids.length === items.length}
                        onChange={() => toggleAll()}
                      />
                    </TableHeadCell>
                    <TableHeadCell>
                      {/* Icon */}
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
                {!desktop && showUploadsInTable &&
                uploadsInProgress?.filter(
                  (uploadInProgress) =>
                    uploadInProgress.path === currentPath &&
                    !uploadInProgress.complete &&
                    !uploadInProgress.error
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
                  <FileSystemItem
                    key={index}
                    file={file}
                    files={files}
                    selected={selectedCids}
                    handleSelectCid={handleSelectCid}
                    handleAddToSelectedCids={handleAddToSelectedCids}
                    editing={editing}
                    setEditing={setEditing}
                    handleRename={async (cid: string, newName: string) => {
                      handleRename && (await handleRename(cid, newName))
                      setEditing(undefined)
                    }}
                    deleteFile={() => {
                      setSelectedCids([file.cid])
                      setIsDeleteModalOpen(true)
                    }}
                    viewFolder={handleViewFolder}
                    moveFile={() => {
                      setSelectedCids([file.cid])
                      setIsMoveFileModalOpen(true)
                      setMoveModalMode("move")
                    }}
                    itemOperations={getItemOperations(file.content_type)}
                    resetSelectedFiles={resetSelectedCids}
                    browserView="table"
                    recoverFile={() => {
                      setSelectedCids([file.cid])
                      setIsMoveFileModalOpen(true)
                      setMoveModalMode("recover")
                    }}
                    reportFile={(filePath: string) => {
                      setFilePath(filePath)
                      setIsReportFileModalOpen(true)}
                    }
                    showFileInfo={(filePath: string) => {
                      setFilePath(filePath)
                      setIsFileInfoModalOpen(true)
                    }}
                    showPreview={(fileIndex: number) => {
                      setFileIndex(fileIndex)
                      setIsPreviewOpen(true)
                    }}
                    share={(filePath: string, fileIndex: number) => {
                      setFilePath(filePath)
                      setFileIndex(fileIndex)
                      setIsCopyToSharedFolerModalOpen(true)
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          )
          : (
            <section
              className={clsx(
                classes.gridRoot,
                loadingCurrentPath && classes.fadeOutLoading
              )}
            >
              {items.map((file, index) => (
                <FileSystemItem
                  key={index}
                  file={file}
                  files={files}
                  selected={selectedCids}
                  handleSelectCid={handleSelectCid}
                  viewFolder={handleViewFolder}
                  handleAddToSelectedCids={handleAddToSelectedCids}
                  editing={editing}
                  setEditing={setEditing}
                  handleRename={async (path: string, newPath: string) => {
                    handleRename && (await handleRename(path, newPath))
                    setEditing(undefined)
                  }}
                  deleteFile={() => {
                    setSelectedCids([file.cid])
                    setIsDeleteModalOpen(true)
                  }}
                  moveFile={() => {
                    setSelectedCids([file.cid])
                    setIsMoveFileModalOpen(true)
                    setMoveModalMode("move")
                  }}
                  itemOperations={getItemOperations(file.content_type)}
                  resetSelectedFiles={resetSelectedCids}
                  recoverFile={() => {
                    setSelectedCids([file.cid])
                    setIsMoveFileModalOpen(true)
                    setMoveModalMode("recover")
                  }}
                  browserView="grid"
                  reportFile={(fileInfoPath: string) => {
                    setFilePath(fileInfoPath)
                    setIsReportFileModalOpen(true)}
                  }
                  showFileInfo={(fileInfoPath: string) => {
                    setFilePath(fileInfoPath)
                    setIsFileInfoModalOpen(true)
                  }}
                  share={(fileInfoPath: string, fileIndex: number) => {
                    setFilePath(fileInfoPath)
                    setFileIndex(fileIndex)
                    setIsCopyToSharedFolerModalOpen(true)
                  }}
                  showPreview={(fileIndex: number) => {
                    setFileIndex(fileIndex)
                    setIsPreviewOpen(true)
                  }}
                />
              ))}
            </section>
          )}
      <Dialog
        active={isDeleteModalOpen}
        reject={() => setIsDeleteModalOpen(false)}
        accept={handleDeleteFiles}
        requestMessage={
          plural(selectedCids.length, {
            one: `You are about to delete ${selectedCids.length} item.`,
            other: `You are about to delete ${selectedCids.length} items.`
          })
        }
        rejectText = {t`Cancel`}
        acceptText = {t`Confirm`}
        acceptButtonProps={{ loading: isDeletingFiles, disabled: isDeletingFiles, testId: "confirm-deletion" }}
        rejectButtonProps={{ disabled: isDeletingFiles, testId: "cancel-deletion" }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
        onModalBodyClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        testId="file-deletion"
      />
      <UploadProgressModals />
      <DownloadProgressModals />
      {
        refreshContents && (
          <>
            <CreateFolderModal
              modalOpen={createFolderModalOpen}
              close={() => setCreateFolderModalOpen(false)}
            />
            <UploadFileModule
              modalOpen={isUploadModalOpen}
              close={() => setIsUploadModalOpen(false)}
            />
            {isMoveFileModalOpen && (
              <MoveFileModal
                filesToMove={selectedItems}
                onClose={() => {
                  setIsMoveFileModalOpen(false)
                  setSelectedCids([])
                  setMoveModalMode(undefined)
                }}
                onCancel={() => {
                  setIsMoveFileModalOpen(false)
                  setMoveModalMode(undefined)
                }}
                mode={moveModalMode}
              />
            )}
          </>
        )
      }
      {isPreviewOpen && files.length && fileIndex !== undefined && (
        <FilePreviewModal
          file={files[fileIndex]}
          closePreview={closePreview}
          nextFile={fileIndex < files.length - 1 ? setNextPreview : undefined}
          previousFile={fileIndex > 0 ? setPreviousPreview : undefined}
          filePath={isSearch && getPath ? getPath(files[fileIndex].cid) : getPathWithFile(currentPath, files[fileIndex].name)}
        />
      )}
      { filePath && isReportFileModalOpen &&
        <ReportFileModal
          filePath={filePath}
          close={() => {
            setIsReportFileModalOpen(false)
            setFilePath(undefined)
          }}
        />
      }
      { filePath && isFileInfoModalOpen &&
        <FileInfoModal
          filePath={filePath}
          close={() => {
            setIsFileInfoModalOpen(false)
            setFilePath(undefined)
          }}
        />
      }
      { isCopyToSharedFolerModalOpen && filePath && fileIndex !== undefined &&
        <CopyToSharedFolderModal
          file={files[fileIndex]}
          close={() => {
            setIsCopyToSharedFolerModalOpen(false)
            setFilePath(undefined)
          }}
          filePath={filePath}
        />
      }
    </article>
  )
}

export default FilesList
