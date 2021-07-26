import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useCallback, useEffect } from "react"
import {
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
import EmptySvg from "../../../Media/Empty.svg"
import clsx from "clsx"
import { plural, t, Trans } from "@lingui/macro"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import { BrowserView, FileOperation, MoveModalMode } from "../../../Contexts/types"
import { FileSystemItem as FileSystemItemType } from "../../../Contexts/StorageContext"
import FileSystemItem from "../FileSystemItem/FileSystemItem"
import UploadProgressModals from "../UploadProgressModals"
import DownloadProgressModals from "../DownloadProgressModals"
import CreateFolderModal from "../CreateFolderModal/CreateFolderModal"
import UploadFileModule from "../UploadFileModal/UploadFileModal"
import MoveFileModal from "../MoveFileModal/MoveFileModal"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { CSSTheme } from "../../../Themes/types"
import MimeMatcher from "../../../Utils/MimeMatcher"
import { useLanguageContext } from "../../../Contexts/LanguageContext"
import { ISelectedFile, useFileBrowser } from "../../../Contexts/FileBrowserContext"
import SurveyBanner from "../SurveyBanner"

interface IStyleProps {
  themeKey: string
}

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette, zIndex }: CSSTheme) => {
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
      encryptionNotificationRoot: {
        backgroundColor: palette.additional["gray"][9],
        padding: constants.generalUnit,
        paddingLeft: constants.generalUnit * 2,
        marginTop: constants.generalUnit,
        borderRadius: 2,
        display: "flex"
      },
      banner: {
        color: "#FFFF00",
        fontWeight: 600,
        paddingRight: constants.generalUnit
      }
    })
  }
)

// Sorting
const sortFoldersFirst = (a: FileSystemItemType, b: FileSystemItemType) =>
  a.isFolder && a.content_type !== b.content_type ? -1 : 1

const FilesList = () => {
  const { themeKey, desktop } = useThemeSwitcher()

  const {
    heading,
    controls = true,
    sourceFiles,
    handleUploadOnDrop,
    bulkOperations,
    crumbs,
    renameItem: handleRename,
    deleteItems,
    viewFolder,
    currentPath,
    refreshContents,
    loadingCurrentPath,
    uploadsInProgress,
    showUploadsInTable,
    allowDropUpload,
    itemOperations,
    moduleRootPath,
    withSurvey
  } = useFileBrowser()
  const classes = useStyles({ themeKey })
  const [editing, setEditing] = useState<ISelectedFile | undefined>()
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
  const [selectedCids, setSelectedCids] = useState<ISelectedFile[]>([])
  const [, setPreviewFileIndex] = useState<number | undefined>()
  const { selectedLocale } = useLanguageContext()
  const { redirect } = useHistory()
  const [isSurveyBannerVisible, setIsSurveyBannerVisible] = useState(true)

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
    () => items.filter((file) => selectedCids.findIndex(item => item.name === file.name && item.cid === file.cid) >= 0),
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

  const onHideSurveyBanner = useCallback(() => {
    setIsSurveyBannerVisible(false)
  }, [setIsSurveyBannerVisible])

  // Selection logic
  const handleSelectCid = useCallback(
    (toSelect: ISelectedFile) => {
      if (selectedCids.findIndex(item => item.cid === toSelect.cid && item.name === toSelect.name) >= 0) {
        setSelectedCids([])
      } else {
        setSelectedCids([toSelect])
      }
    },
    [selectedCids]
  )

  const handleAddToSelectedCids = useCallback(
    (toSelect: ISelectedFile) => {
      if (selectedCids.findIndex(item => item.cid === toSelect.cid && item.name === toSelect.name) >= 0) {
        setSelectedCids(
          selectedCids.filter((selected: ISelectedFile) => selected.name !== toSelect.name)
        )
      } else {
        setSelectedCids([...selectedCids, toSelect])
      }
    },
    [selectedCids]
  )

  const toggleAll = useCallback(() => {
    if (selectedCids.length === items.length) {
      setSelectedCids([])
    } else {
      setSelectedCids([...items.map((file: FileSystemItemType) => ({
        name: file.name,
        cid: file.cid
      }))])
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isMoveFileModalOpen, setIsMoveFileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingFiles, setIsDeletingFiles] = useState(false)
  const [, setFileInfoPath] = useState<string | undefined>(
    undefined
  )
  const [moveModalMode, setMoveModalMode] = useState<MoveModalMode | undefined>()

  const [browserView, setBrowserView] = useState<BrowserView>("table")

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
        "share",
        "recover"
      ]
      for (let i = 0; i < selectedCids.length; i++) {
        const contentType = items.find((item) => item.cid === selectedCids[i].cid && item.name === selectedCids[i].name)
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
    if (!deleteItems) return

    setIsDeletingFiles(true)
    deleteItems(selectedCids)
      .catch(console.error)
      .finally(() => {
        setIsDeletingFiles(false)
        setSelectedCids([])
        setIsDeleteModalOpen(false)
      })
  }, [deleteItems, selectedCids])

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

  const handleViewFolder = useCallback((toView: ISelectedFile) => {
    viewFolder && viewFolder(toView)
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
        <Typography variant="h4"
          component="p">
          <Trans>Drop to upload files</Trans>
        </Typography>
      </div>
      <div className={classes.breadCrumbContainer}>
        {crumbs && moduleRootPath && (
          <Breadcrumb
            crumbs={crumbs}
            homeOnClick={() => redirect(moduleRootPath)}
            showDropDown={!desktop}
          />
        )}
      </div>
      <header
        className={classes.header}
        data-cy="header-bucket-item"
      >
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
                data-cy="button-new-folder"
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
                data-cy="button-bucket-upload"
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
      <div className={classes.encryptionNotificationRoot}>
        <Typography
          variant="body1"
          className={classes.banner}>
          <Trans>
            Chainsafe Storage Beta does not encrypt data. All data uploaded is publicly accessible.
          </Trans>
        </Typography>
      </div>
      { withSurvey && isSurveyBannerVisible &&
        <SurveyBanner onHide={onHideSurveyBanner}/>
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
              >
                <Trans>Recover selected</Trans>
              </Button>
            )}
            {validBulkOps.indexOf("delete") >= 0 && (
              <Button
                onClick={handleOpenDeleteDialog}
                variant="outline"
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
        <Loading size={24}
          type="light" />
        <Typography variant="body2"
          component="p">
          <Trans>One sec, getting files ready...</Trans>
        </Typography>
      </div>
      {(items.length === 0) ? (
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
      ) : browserView === "table" ? (
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
                index={index}
                file={file}
                files={files}
                selected={selectedCids}
                handleSelectCid={handleSelectCid}
                handleAddToSelectedCids={handleAddToSelectedCids}
                editing={editing}
                setEditing={setEditing}
                handleRename={async (toRename: ISelectedFile, newName: string) => {
                  handleRename && (await handleRename(toRename, newName))
                  setEditing(undefined)
                }}
                deleteFile={() => {
                  setSelectedCids([{
                    cid: file.cid,
                    name: file.name
                  }])
                  setIsDeleteModalOpen(true)
                }}
                viewFolder={handleViewFolder}
                setPreviewFileIndex={setPreviewFileIndex}
                moveFile={() => {
                  setSelectedCids([{
                    cid: file.cid,
                    name: file.name
                  }])
                  setIsMoveFileModalOpen(true)
                  setMoveModalMode("move")
                }}
                setFileInfoPath={setFileInfoPath}
                itemOperations={getItemOperations(file.content_type)}
                resetSelectedFiles={resetSelectedCids}
                browserView="table"
                recoverFile={() => {
                  setSelectedCids([{
                    cid: file.cid,
                    name: file.name
                  }])
                  setIsMoveFileModalOpen(true)
                  setMoveModalMode("recover")
                }}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <section
          className={clsx(
            classes.gridRoot,
            loadingCurrentPath && classes.fadeOutLoading
          )}
        >
          {items.map((file, index) => (
            <FileSystemItem
              key={index}
              index={index}
              file={file}
              files={files}
              selected={selectedCids}
              handleSelectCid={handleSelectCid}
              viewFolder={handleViewFolder}
              handleAddToSelectedCids={handleAddToSelectedCids}
              editing={editing}
              setEditing={setEditing}
              handleRename={async (toRename: ISelectedFile, newPath: string) => {
                handleRename && (await handleRename(toRename, newPath))
                setEditing(undefined)
              }}
              deleteFile={() => {
                setSelectedCids([{
                  cid: file.cid,
                  name: file.name
                }])
                setIsDeleteModalOpen(true)
              }}
              setPreviewFileIndex={setPreviewFileIndex}
              moveFile={() => {
                setSelectedCids([{
                  cid: file.cid,
                  name: file.name
                }])
                setIsMoveFileModalOpen(true)
                setMoveModalMode("move")
              }}
              setFileInfoPath={setFileInfoPath}
              itemOperations={getItemOperations(file.content_type)}
              resetSelectedFiles={resetSelectedCids}
              recoverFile={() => {
                setSelectedCids([{
                  cid: file.cid,
                  name: file.name
                }])
                setIsMoveFileModalOpen(true)
                setMoveModalMode("recover")
              }}
              browserView="grid"
            />
          ))}
        </section>
      )}
      {/* {files && previewFileIndex !== undefined && bucket && (
        <FilePreviewModal
          file={files[previewFileIndex]}
          closePreview={clearPreview}
          nextFile={
            previewFileIndex < files.length - 1 ? setNextPreview : undefined
          }
          previousFile={previewFileIndex > 0 ? setPreviousPreview : undefined}
          path={isSearch && getPath ? getPath(files[previewFileIndex].cid) : getPathWithFile(currentPath, files[previewFileIndex].name)}
        />
      )} */}
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
        acceptButtonProps={{ loading: isDeletingFiles, disabled: isDeletingFiles }}
        rejectButtonProps={{ disabled: isDeletingFiles }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
        onModalBodyClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
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
            <MoveFileModal
              filesToMove={selectedItems}
              modalOpen={isMoveFileModalOpen}
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
          </>
        )
      }
      {/* 
      <FileInfoModal
        fileInfoPath={fileInfoPath}
        close={() => setFileInfoPath(undefined)}
      /> */}
    </article>
  )
}

export default FilesList
