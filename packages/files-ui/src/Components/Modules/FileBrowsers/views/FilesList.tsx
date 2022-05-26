import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useCallback, useEffect, useRef } from "react"
import {
  Divider,
  PlusIcon,
  SortDirection,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography,
  Breadcrumb,
  Button,
  PlusCircleIcon,
  UploadIcon,
  Dialog,
  Loading,
  CheckboxInput,
  useHistory,
  GridIcon,
  TableIcon,
  UploadSvg,
  PlusCircleSvg,
  MoreIcon,
  SortIcon,
  CheckIcon,
  IMenuItem
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import EmptySvg from "../../../../Media/Empty.svg"
import clsx from "clsx"
import { plural, t, Trans } from "@lingui/macro"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import { BrowserView, FileOperation, MoveModalMode } from "../types"
import { FileSystemItem as FileSystemItemType, useFiles } from "../../../../Contexts/FilesContext"
import FileSystemItem from "./FileSystemItem/FileSystemItem"
import FilePreviewModal from "../../FilePreviewModal"
import CreateFolderModal from "../CreateFolderModal"
import UploadFileModule from "../UploadFileModal"
import MoveFileModal from "../MoveFileModal"
import FileInfoModal from "../FileInfoModal"
import { CONTENT_TYPES } from "../../../../Utils/Constants"
import { CSFTheme } from "../../../../Themes/types"
import MimeMatcher from "../../../../Utils/MimeMatcher"
import { useLanguageContext } from "../../../../Contexts/LanguageContext"
import SurveyBanner from "../../../SurveyBanner"
import { DragPreviewLayer } from "./DragPreviewLayer"
import { useFileBrowser } from "../../../../Contexts/FileBrowserContext"
import ReportFileModal from "../ReportFileModal"
import ShareModal from "../ShareModal"
import SharedUsers from "../../../Elements/SharedUsers"
import Menu from "../../../../UI-components/Menu"
import SharingExplainerModal from "../../../SharingExplainerModal"
import { useSharingExplainerModalFlag } from "../hooks/useSharingExplainerModalFlag"
import { ListItemIcon, ListItemText } from "@material-ui/core"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import RestrictedModeBanner from "../../../Elements/RestrictedModeBanner"
import { DragTypes } from "../DragConstants"
import FolderBreadcrumb from "./FolderBreadcrumb"
import AnchorMenu, { AnchoreMenuPosition } from "../../../../UI-components/AnchorMenu"
import { getItemMenuOptions } from "./FileSystemItem/itemOperations"
import { getPathWithFile } from "../../../../Utils/pathUtils"

const baseOperations: FileOperation[] = ["download", "info", "preview", "share"]
const readerOperations: FileOperation[] = [...baseOperations, "report"]
const ownerOperations: FileOperation[] = [...baseOperations, "delete", "move", "rename", "recover"]
const csfOperations: FileOperation[] = [...ownerOperations, "share"]
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
          marginRight: constants.generalUnit * 2,
          "&.bottomBanner": {
            paddingBottom: constants.bottomBannerMobileHeight
          }
        },
        [breakpoints.up("md")]: {
          border: "1px solid transparent",
          padding: `0 ${constants.generalUnit}px`,
          borderRadius: constants.generalUnit / 4,
          minHeight: `calc(100vh - ${Number(constants.contentTopPadding)}px)`,
          "&.droppable": {
            borderColor: palette.primary.main
          },
          "&.bottomBanner": {
            minHeight: `calc(100vh - ${Number(constants.contentTopPadding) + Number(constants.bottomBannerHeight)}px)`,
            paddingBottom: constants.bottomBannerHeight
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
          marginTop: constants.generalUnit * 3,
          marginBottom: 0
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
        width: 20,
        height: 20,
        position: "relative",
        fontSize: "unset",
        padding: `${constants.generalUnit * 0.5}px 0 0 ${constants.generalUnit * 1.5}px`,
        "& svg": {
          fill: constants.fileSystemItemRow.dropdownIcon,
          left: 0,
          width: 16,
          height: 16,
          position: "absolute"
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
        backgroundColor: palette.additional["gray"][10],
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
      bulkOperations: {
        display: "flex",
        flexDirection: "row",
        position: "sticky",
        top: "80px",
        backgroundColor: palette.additional["gray"][1],
        zIndex: zIndex?.layer0,
        minHeight: constants.generalUnit * 5 + 34,
        alignItems: "center",
        "& > *": {
          marginRight: constants.generalUnit
        },
        [breakpoints.up("md")]: {
          // prevent grid shadows overflow showing
          marginLeft: "-4px",
          paddingLeft: "4px"
        }
      },
      confirmDeletionDialog: {
        top: "50%"
      },
      gridRoot: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
        gridColumnGap: constants.generalUnit * 2,
        gridRowGap: constants.generalUnit * 2,
        marginBottom: constants.generalUnit * 4,
        [breakpoints.down("lg")]: {
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)"
        },
        [breakpoints.down("md")]: {
          margin: `${constants.generalUnit * 4}px 0`
        },
        [breakpoints.down("sm")]: {
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          margin: `${constants.generalUnit * 2}px 0`
        }
      },
      viewToggleButton: {
        marginRight: constants.generalUnit,
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
      },
      focusVisible: {
        backgroundColor: "transparent !important"
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: constants.previewModal.menuItemIconColor
      },
      fileNameHeader: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: constants.generalUnit * 2
      },
      buttonWrap: {
        whiteSpace: "nowrap"
      },
      checkIcon: {
        fill: palette.additional.gray[8]
      },
      tableHead: {
        position: "sticky",
        top: constants.generalUnit * 5 + 34 + 80,
        zIndex: zIndex?.layer0,
        [breakpoints.down("md")]: {
          top: 50
        }
      }
    })
  }
)

interface Props {
  isShared?: boolean
}

type SortByType = "name" | "size" | "date_uploaded"
// Sorting
const sortFoldersFirst = (a: FileSystemItemType, b: FileSystemItemType) =>
  a.isFolder && a.content_type !== b.content_type ? -1 : 1

const FilesList = ({ isShared = false }: Props) => {
  const { themeKey, desktop } = useThemeSwitcher()
  const [isReportFileModalOpen, setIsReportFileModalOpen] = useState(false)
  const [isFileInfoModalOpen, setIsFileInfoModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { accountRestricted } = useFilesApi()

  const {
    heading,
    controls = true,
    sourceFiles,
    handleUploadOnDrop,
    bulkOperations,
    crumbs,
    moveItems,
    downloadFile,
    renameItem: handleRename,
    deleteItems: deleteFiles,
    viewFolder,
    currentPath,
    refreshContents,
    loadingCurrentPath,
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
  const [column, setColumn] = useState<SortByType>("name")
  const [selectedItems, setSelectedItems] = useState<FileSystemItemType[]>([])
  const [fileIndex, setFileIndex] = useState<number | undefined>()
  const { selectedLocale } = useLanguageContext()
  const { redirect } = useHistory()
  const { downloadMultipleFiles } = useFiles()
  const { permission } = bucket || {}
  const { hasSeenSharingExplainerModal, hideModal } = useSharingExplainerModalFlag()
  const [hasClickedShare, setClickedShare] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<AnchoreMenuPosition | null>(null)
  const showExplainerBeforeShare = useMemo(() =>
    !hasSeenSharingExplainerModal && hasClickedShare
  , [hasClickedShare, hasSeenSharingExplainerModal]
  )
  const items: FileSystemItemType[] = useMemo(() => {
    let temp = []

    switch (column) {
      // defaults to name sorting
      default: {
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

  const selectedCids = useMemo(() =>
    selectedItems.map((item) => item.cid)
  , [selectedItems])

  const selectionContainsAFolder = useMemo(() =>
    selectedItems.some((item) => !!item.isFolder)
  , [selectedItems])

  const handleSortToggle = useCallback((targetColumn: SortByType) => {
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
  }, [column, direction])

  const toggleSortDirection = () => {
    if (direction === "ascend") {
      setDirection("descend")
    } else {
      setDirection("ascend")
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
  const handleSelectItem = useCallback(
    (item: FileSystemItemType) => {
      setSelectedItems([item])
    },
    []
  )

  const handleAddToSelectedItems = useCallback(
    (itemToAdd: FileSystemItemType) => {
      if (selectedCids.includes(itemToAdd.cid)) {
        setSelectedItems(
          selectedItems.filter((selectedItem: FileSystemItemType) => selectedItem.cid !== itemToAdd.cid)
        )
      } else {
        setSelectedItems([...selectedItems, itemToAdd])
      }
    },
    [selectedCids, selectedItems]
  )

  // select item with SHIFT pressed
  const handleSelectItemWithShift = useCallback(
    (item: FileSystemItemType) => {
      // item already selected
      const isItemAlreadySelected = selectedItems.includes(item)
      if (isItemAlreadySelected) return

      const lastIndex = selectedItems.length
        ? items.findIndex((i) => i.cid === selectedItems[selectedItems.length - 1].cid)
        : -1

      // first item
      if (lastIndex === -1) {
        setSelectedItems([item])
        return
      }

      const currentIndex = items.findIndex((i) => i.cid === item.cid)
      // unavailable item
      if (currentIndex === -1) return

      // new item, with selected items 
      let countIndex = lastIndex
      let mySelectedItems = selectedItems
      while (
        (currentIndex > lastIndex && countIndex <= currentIndex) ||
        (currentIndex < lastIndex && countIndex >= currentIndex)
      ) {
        // filter out if item already selected
        const currentCID = items[countIndex].cid
        mySelectedItems = mySelectedItems.filter((s) => s.cid !== currentCID)
        mySelectedItems.push(items[countIndex])
        if (currentIndex > lastIndex) countIndex++
        else countIndex--
      }
      setSelectedItems([...mySelectedItems])
    },
    [selectedItems, items]
  )

  const toggleAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items)
    }
  }, [selectedItems.length, items])

  const [{ isOverBrowserOnlyAndUploadable, isOverBrowser }, dropBrowserRef] = useDrop({
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
      isOverBrowserOnlyAndUploadable: monitor.isOver({ shallow: true })
    })
  })

  const [{ isOverUploadHomeBreadcrumb }, dropUploadHomeBreadcrumbRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: {
      files: File[]
      items:DataTransferItemList
    }) => {
      handleUploadOnDrop && handleUploadOnDrop(item.files, item.items, "/")
    },
    collect: (monitor) => ({
      isOverUploadHomeBreadcrumb: monitor.isOver()
    })
  })

  const [{ isOverMoveHomeBreadcrumb }, dropMoveHomeBreadcrumbRef] = useDrop({
    accept: DragTypes.MOVABLE_FILE,
    canDrop: () => currentPath !== "/",
    drop: (item: { ids: string[]}) => {
      moveItems && moveItems(item.ids, "/")
      setSelectedItems([])
    },
    collect: (monitor) => ({
      isOverMoveHomeBreadcrumb: monitor.isOver() && currentPath !== "/"
    })
  })

  const homeBreadcrumbRef  =  useRef<HTMLDivElement>(null)
  dropMoveHomeBreadcrumbRef(homeBreadcrumbRef)
  dropUploadHomeBreadcrumbRef(homeBreadcrumbRef)

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

      switch (permission) {
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
            (op: FileOperation) => bulkOperations[contentType].includes(op)
          )
          if (validList.length > 0) {
            fileOperations = fileOperations.filter(
              (existingOp: FileOperation) => validList.includes(existingOp)
            )
          }
        } else {
          const validList = fileOperations.filter(
            (op: FileOperation) => bulkOperations[CONTENT_TYPES.File].includes(op)
          )
          if (validList.length > 0) {
            fileOperations = fileOperations.filter(
              (existingOp: FileOperation) => validList.includes(existingOp)
            )
          }
        }
      } else {
        const validList = fileOperations.filter(
          (op: FileOperation) => bulkOperations[CONTENT_TYPES.File].includes(op)
        )
        if (validList.length > 0) {
          fileOperations = fileOperations.filter(
            (existingOp: FileOperation) => validList.includes(existingOp)
          )
        }
      }
    }
    setValidBulkOps(fileOperations)
  }, [selectedCids, items, bulkOperations, isShared, permission])

  const onEditFile = useCallback((file: FileSystemItemType | undefined) => {
    setEditing(file?.cid)
  }, [])

  const onDeleteFile = useCallback((file: FileSystemItemType) => {
    setSelectedItems([file])
    setIsDeleteModalOpen(true)
  }, [])

  const onMoveFile = useCallback((file: FileSystemItemType) => {
    setSelectedItems([file])
    setIsMoveFileModalOpen(true)
    setMoveModalMode("move")
  }, [])

  const onRecoverFile = useCallback((file: FileSystemItemType) => {
    setSelectedItems([file])
    setIsMoveFileModalOpen(true)
    setMoveModalMode("recover")
  }, [])

  const onShowFileInfo = useCallback((file: FileSystemItemType) => {
    const filePath = getPathWithFile(currentPath, file.name)
    setFilePath(filePath)
    setIsFileInfoModalOpen(true)
  }, [currentPath])

  const onShowPreview = useCallback((file: FileSystemItemType) => {
    const fileIndex = files.indexOf(file)
    setFileIndex(fileIndex)
    setIsPreviewOpen(true)
  }, [files])

  const onDownloadFile = useCallback((file: FileSystemItemType) => {
    if (file.isFolder) {
      bucket && downloadMultipleFiles([file], currentPath, bucket.id)
    } else {
      downloadFile && downloadFile(file.cid)
    }
  }, [bucket, currentPath, downloadFile, downloadMultipleFiles])

  const onReportFile = useCallback((file: FileSystemItemType) => {
    const filePath = getPathWithFile(currentPath, file.name)
    setFilePath(filePath)
    setIsReportFileModalOpen(true)
  }, [currentPath])

  const handleDeleteFiles = useCallback(() => {
    if (!deleteFiles) return

    setIsDeletingFiles(true)
    deleteFiles(selectedCids)
      .catch(console.error)
      .finally(() => {
        setIsDeletingFiles(false)
        setSelectedItems([])
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

  const resetSelectedItems = useCallback(() => {
    setSelectedItems([])
  }, [])

  useEffect(() => {
    setSelectedItems([])
  }, [currentPath])

  const onHideSurveyBanner = useCallback(() => {
    setIsSurveyBannerVisible(false)
  }, [setIsSurveyBannerVisible])

  const handleViewFolder = useCallback((file: FileSystemItemType) => {
    !loadingCurrentPath && viewFolder && viewFolder(file.cid)
  }, [viewFolder, loadingCurrentPath])

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

  const handleOpenShareDialog = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setClickedShare(true)
    setIsShareModalOpen(true)
  }, [])

  const onShare = useCallback((fileSystemItem: FileSystemItemType) => {
    setSelectedItems([fileSystemItem])
    handleOpenShareDialog()
  }, [handleOpenShareDialog])

  const browserOptions = useMemo(() => [
    {
      contents: (
        <>
          <PlusCircleSvg className={classes.menuIcon} />
          <span>
            <Trans>New folder</Trans>
          </span>
        </>
      ),
      onClick: () => setCreateFolderModalOpen(true),
      disabled: accountRestricted
    },
    {
      contents: (
        <>
          <UploadSvg className={classes.menuIcon} />
          <span>
            <Trans>Upload</Trans>
          </span>
        </>
      ),
      onClick: () => setIsUploadModalOpen(true),
      disabled: accountRestricted
    }
  ],
  [classes.menuIcon, accountRestricted])

  const bulkActions = useMemo(() => {
    const menuOptions: IMenuItem[] = []

    validBulkOps.includes("download") && (selectedItems.length > 1 || selectionContainsAFolder) &&
      menuOptions.push({
        contents: (
          <>
            <span>
              <Trans>Download as zip</Trans>
            </span>
          </>
        ),
        onClick: () => {
          bucket && downloadMultipleFiles(selectedItems, currentPath, bucket.id)
          resetSelectedItems()
        }
      })

    validBulkOps.includes("move") &&
      menuOptions.push({
        contents: (
          <>
            <span>
              <Trans>Move</Trans>
            </span>
          </>
        ),
        onClick: (e: React.MouseEvent) => {
          handleOpenMoveFileDialog(e)
          setMoveModalMode("move")
        }
      })

    validBulkOps.includes("recover") &&
      menuOptions.push({
        contents: (
          <>
            <span>
              <Trans>Recover</Trans>
            </span>
          </>
        ),
        onClick: (e: React.MouseEvent) => {
          handleOpenMoveFileDialog(e)
          setMoveModalMode("recover")
        }
      })

    validBulkOps.includes("delete") &&
      menuOptions.push({
        contents: (
          <>
            <span>
              <Trans>Delete</Trans>
            </span>
          </>
        ),
        onClick: handleOpenDeleteDialog
      })
    validBulkOps.includes("share") &&
      menuOptions.push({
        contents: (
          <>
            <span>
              <Trans>Share</Trans>
            </span>
          </>
        ),
        onClick: handleOpenShareDialog
      })

    return menuOptions
  }, [
    validBulkOps,
    bucket,
    currentPath,
    downloadMultipleFiles,
    handleOpenDeleteDialog,
    handleOpenMoveFileDialog,
    handleOpenShareDialog,
    resetSelectedItems,
    selectedItems,
    selectionContainsAFolder
  ])

  const handleContextMenuOnBrowser = useCallback((e: React.MouseEvent) => {
    if (!controls) return
    e.preventDefault()
    // reset selected files if context menu was open
    setSelectedItems([])
    setContextMenuPosition({
      left: e.clientX - 2,
      top: e.clientY - 4
    })
  }, [controls])

  const handleContextMenuOnItem = useCallback((e: React.MouseEvent, item: FileSystemItemType) => {
    e.preventDefault()
    e.stopPropagation()
    // only keep current item selected if not in selected
    if (!selectedItems.includes(item)) {
      setSelectedItems([item])
    }
    setContextMenuPosition({
      left: e.clientX - 2,
      top: e.clientY - 4
    })
  }, [selectedItems])

  const itemFunctions = useMemo(() => ({
    deleteFile: onDeleteFile,
    downloadFile: onDownloadFile,
    handleShare: onShare,
    moveFile: onMoveFile,
    recoverFile: onRecoverFile,
    reportFile: onReportFile,
    viewFolder: handleViewFolder,
    showFileInfo: onShowFileInfo,
    previewFile: onShowPreview,
    editFile: onEditFile
  }), [
    handleViewFolder,
    onDeleteFile,
    onDownloadFile,
    onMoveFile,
    onRecoverFile,
    onReportFile,
    onShowFileInfo,
    onShowPreview,
    onShare,
    onEditFile
  ])

  const contextMenuOptions: IMenuItem[] = useMemo(() => {
    if (selectedItems.length > 1) {
      // bulk operations
      return bulkActions
    } else if (selectedItems.length === 1) {
      // single item operations
      const inSharedFolder = bucket?.type === "share"
      const item  = selectedItems[0]
      return getItemMenuOptions({
        file: item,
        inSharedFolder,
        itemOperations: getItemOperations(item.content_type),
        menuIconClass: classes.menuIcon,
        ...itemFunctions
      })
    } else {
      return browserOptions
    }
  }, [
    browserOptions,
    selectedItems,
    bucket,
    classes.menuIcon,
    getItemOperations,
    itemFunctions,
    bulkActions
  ])

  return (
    <>
      <article
        className={clsx(classes.root, {
          droppable: isOverBrowserOnlyAndUploadable && allowDropUpload
        }, {
          bottomBanner: accountRestricted
        }
        )}
        onContextMenu={handleContextMenuOnBrowser}
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
        {contextMenuPosition && (
          <AnchorMenu
            options={contextMenuOptions}
            onClose={() => setContextMenuPosition(null)}
            anchorPosition={contextMenuPosition}
          />
        )}
        <DragPreviewLayer
          items={sourceFiles}
          previewType={browserView}
        />
        <div
          className={classes.breadCrumbContainer}
          data-cy="breadcrumb-folder-navigation"
          onContextMenu={(e) => e.stopPropagation()}
        >
          {crumbs && moduleRootPath && (
            <Breadcrumb
              crumbs={crumbs.map((crumb, i) => ({
                ...crumb,
                component: (i < crumbs.length - 1)
                  ? <FolderBreadcrumb
                    folderName={crumb.text}
                    onClick={crumb.onClick}
                    handleMove={(item) => {
                      moveItems && crumb.path && moveItems(item.ids, crumb.path)
                      setSelectedItems([])
                    }}
                    handleUpload={(item) => handleUploadOnDrop &&
                  crumb.path &&
                  handleUploadOnDrop(item.files, item.items, crumb.path)}
                  />
                  : null
              }))}
              homeOnClick={() => redirect(moduleRootPath)}
              homeRef={homeBreadcrumbRef}
              homeActive={isOverUploadHomeBreadcrumb || isOverMoveHomeBreadcrumb}
              showDropDown
              maximumCrumbs={desktop ? 5 : 3}
            />
          )}
        </div>
        <header className={classes.header}>
          <Typography
            variant="h1"
            component="h1"
            data-cy="label-files-app-header"
            className={classes.fileNameHeader}
          >
            {heading}
          </Typography>
          {isShared && bucket && (
            <div className={classes.users}>
              <SharedUsers
                bucket={bucket}
                showOwners={true}
              />
            </div>
          )}
          <div
            className={classes.controls}
            onContextMenu={(e) => e.stopPropagation()}
          >
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
                        data-cy="button-new-folder"
                        onClick={() => setCreateFolderModalOpen(true)}
                        variant="outline"
                        size="large"
                        disabled={accountRestricted}
                      >
                        <PlusCircleIcon />
                        <span className={classes.buttonWrap}>
                          <Trans>New folder</Trans>
                        </span>
                      </Button>
                      <Button
                        data-cy="button-upload-file"
                        onClick={() => setIsUploadModalOpen(true)}
                        variant="outline"
                        size="large"
                        disabled={accountRestricted}
                      >
                        <UploadIcon />
                        <span className={classes.buttonWrap}>
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
                  <Menu
                    testId='mobileMenu'
                    icon={<PlusIcon className={classes.dropdownIcon} />}
                    options={browserOptions}
                    style={{ focusVisible: classes.focusVisible }}
                  />
                </>
              )
            )}
          </div>
        </header>
        {withSurvey && !isShared && isSurveyBannerVisible
          ? <SurveyBanner onHide={onHideSurveyBanner} />
          : <Divider className={classes.divider} />
        }
        {desktop && (
          <section className={classes.bulkOperations}>
            {selectedItems.length > 0 &&
            <>
              {validBulkOps.includes("download") && (selectedItems.length > 1 || selectionContainsAFolder) && (
                <Button
                  onClick={() => {
                    bucket && downloadMultipleFiles(selectedItems, currentPath, bucket.id)
                    resetSelectedItems()
                  }}
                  variant="outline"
                  testId="download-selected-file"
                >
                  <Trans>Download as zip</Trans>
                </Button>
              )}
              {validBulkOps.includes("move") && (
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
              {validBulkOps.includes("recover") && (
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
              {validBulkOps.includes("delete") && (
                <Button
                  onClick={handleOpenDeleteDialog}
                  variant="outline"
                  testId="delete-selected-file"
                >
                  <Trans>Delete selected</Trans>
                </Button>
              )}
              {validBulkOps.includes("share") && (
                <Button
                  onClick={handleOpenShareDialog}
                  variant="outline"
                  testId="share-selected-file"
                >
                  <Trans>Share selected</Trans>
                </Button>
              )}
            </>
            }
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
            type="initial"
          />
          <Typography
            variant="body2"
            component="p"
          >
            <Trans>One sec, getting files ready…</Trans>
          </Typography>
        </div>
        {!items.length
          ? (
            <section
              className={clsx(
                classes.noFiles,
                loadingCurrentPath && classes.fadeOutLoading
              )}
              data-cy="container-no-files-data-state"
            >
              <EmptySvg />
              <Typography
                variant="h4"
                component="h4"
              >
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
                testId="home"
              >
                {desktop ? (
                  <TableHead className={classes.tableHead}>
                    <TableRow
                      type="grid"
                      className={classes.tableRow}
                    >
                      <TableHeadCell>
                        <CheckboxInput
                          value={selectedItems.length === items.length}
                          indeterminate={selectedItems.length > 0}
                          onChange={toggleAll}
                          testId="select-all"
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
                ) : (
                  <TableHead className={classes.tableHead}>
                    <TableRow
                      type="grid"
                      className={classes.tableRow}
                    >
                      <TableHeadCell>
                        <CheckboxInput
                          value={selectedItems.length === items.length}
                          indeterminate={selectedItems.length > 0}
                          onChange={toggleAll}
                          testId="select-all"
                        />
                      </TableHeadCell>
                      {selectedItems.length === 0
                        ? <>
                          <TableHeadCell
                            align='left'
                            onSortChange={toggleSortDirection}
                            sortButtons
                            sortDirection={direction}
                          >
                            {t`Name`}
                          </TableHeadCell>
                          <TableHeadCell align='right'>
                            <Menu
                              testId='file-item-kebab'
                              icon={<SortIcon className={classes.dropdownIcon} />}
                              options={[{
                                contents: (
                                  <ListItemText inset>
                                    <b><Trans>Sort By:</Trans></b>
                                  </ListItemText>
                                )
                              }, {
                                contents: (
                                  <>
                                    {column === "name" && <ListItemIcon><CheckIcon className={classes.checkIcon} /></ListItemIcon>}
                                    <ListItemText inset={column !== "name"}>
                                      <Trans>Name</Trans>
                                    </ListItemText>
                                  </>
                                ),
                                onClick: () => setColumn("name")
                              }, {
                                contents: (
                                  <>
                                    {column === "date_uploaded" && <ListItemIcon><CheckIcon className={classes.checkIcon} /></ListItemIcon>}
                                    <ListItemText inset={column !== "date_uploaded"}>
                                      <Trans>Date Uploaded</Trans>
                                    </ListItemText>
                                  </>
                                ),
                                onClick: () => setColumn("date_uploaded")
                              }, {
                                contents: (
                                  <>
                                    {column === "size" && <ListItemIcon><CheckIcon className={classes.checkIcon} /></ListItemIcon>}
                                    <ListItemText inset={column !== "size"}>
                                      <Trans>Size</Trans>
                                    </ListItemText>
                                  </>
                                ),
                                onClick: () => setColumn("size")
                              }]}
                              style={{ focusVisible: classes.focusVisible }}
                            />
                          </TableHeadCell>
                        </>
                        : <>
                          <TableHeadCell align='left'>
                            <b><Trans>({selectedItems.length}) items selected</Trans></b>
                          </TableHeadCell>
                          <TableHeadCell align='right'>
                            <Menu
                              testId='bulkActionsDropdown'
                              icon={<MoreIcon className={classes.dropdownIcon} />}
                              options={bulkActions}
                              style={{ focusVisible: classes.focusVisible }}
                            />
                          </TableHeadCell>
                        </>
                      }
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {items.map((file, index) => (
                    <FileSystemItem
                      key={index}
                      browserView="table"
                      file={file}
                      selectedCids={selectedCids}
                      handleSelectItem={handleSelectItem}
                      handleAddToSelectedItems={handleAddToSelectedItems}
                      handleSelectItemWithShift={handleSelectItemWithShift}
                      editing={editing}
                      handleRename={(cid: string, newName: string) => {
                        setEditing(undefined)
                        return handleRename && handleRename(cid, newName)
                      }}
                      itemOperations={getItemOperations(file.content_type)}
                      resetSelectedFiles={resetSelectedItems}
                      handleContextMenuOnItem={handleContextMenuOnItem}
                      {...itemFunctions}
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
                    browserView="grid"
                    file={file}
                    selectedCids={selectedCids}
                    handleSelectItem={handleSelectItem}
                    handleAddToSelectedItems={handleAddToSelectedItems}
                    handleSelectItemWithShift={handleSelectItemWithShift}
                    editing={editing}
                    handleRename={(path: string, newPath: string) => {
                      setEditing(undefined)
                      return handleRename && handleRename(path, newPath)
                    }}
                    itemOperations={getItemOperations(file.content_type)}
                    resetSelectedFiles={resetSelectedItems}
                    handleContextMenuOnItem={handleContextMenuOnItem}
                    {...itemFunctions}
                  />
                ))}
              </section>
            )}
      </article>
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
        rejectText={t`Cancel`}
        acceptText={t`Confirm`}
        acceptButtonProps={{ loading: isDeletingFiles, disabled: isDeletingFiles, testId: "confirm-deletion" }}
        rejectButtonProps={{ disabled: isDeletingFiles, testId: "cancel-deletion" }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
        onModalBodyClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        testId="file-deletion"
      />
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
                  setSelectedItems([])
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
          filePath={isSearch && getPath ? getPath(files[fileIndex].cid) : currentPath}
        />
      )}
      {filePath && isReportFileModalOpen &&
        <ReportFileModal
          filePath={filePath}
          close={() => {
            setIsReportFileModalOpen(false)
            setFilePath(undefined)
          }}
        />
      }
      {filePath && isFileInfoModalOpen &&
        <FileInfoModal
          filePath={filePath}
          close={() => {
            setIsFileInfoModalOpen(false)
            setFilePath(undefined)
          }}
        />
      }
      {!showExplainerBeforeShare && isShareModalOpen && selectedItems.length &&
        <ShareModal
          onClose={() => {
            setIsShareModalOpen(false)
            setFilePath(undefined)
          }}
          fileSystemItems={selectedItems}
        />
      }
      {accountRestricted &&
        <RestrictedModeBanner />
      }
      <SharingExplainerModal
        showModal={showExplainerBeforeShare}
        onHide={hideModal}
      />
    </>
  )
}

export default FilesList