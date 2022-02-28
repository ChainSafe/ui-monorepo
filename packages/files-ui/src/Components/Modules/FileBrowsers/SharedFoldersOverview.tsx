import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  SortDirection,
  Loading,
  Button,
  PlusIcon,
  useHistory,
  Dialog
} from "@chainsafe/common-components"
import { BucketKeyPermission, useFiles } from "../../../Contexts/FilesContext"
import { t, Trans } from "@lingui/macro"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { ROUTE_LINKS } from "../../FilesRoutes"
import SharedFolderRow from "./views/FileSystemItem/SharedFolderRow"
import SharingExplainerModal from "../../SharingExplainerModal"
import { useSharingExplainerModalFlag } from "./hooks/useSharingExplainerModalFlag"
import { usePageTrack } from "../../../Contexts/PosthogContext"
import RestrictedModeBanner from "../../Elements/RestrictedModeBanner"
import clsx from "clsx"
import CreateSharedFolderModal from "./CreateSharedFolderModal"
import CreateOrManageSharedFolderModal from "./ManageSharedFolderModal"
import { useLanguageContext } from "../../../Contexts/LanguageContext"

export const desktopSharedGridSettings = "50px 3fr 90px 140px 140px 45px !important"
export const mobileSharedGridSettings = "3fr 80px 45px !important"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette }: CSFTheme) => {
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
            borderColor: palette.additional["geekblue"][4]
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
      fadeOutLoading: {
        opacity: 0.2,
        transition: `opacity ${animation.transform * 3}ms`
      },
      tableHead: {
        marginTop: constants.generalUnit * 3
      },
      tableRow: {
        border: "2px solid transparent",
        transitionDuration: `${animation.transform}ms`,
        [breakpoints.up("md")]: {
          gridTemplateColumns: desktopSharedGridSettings
        },
        [breakpoints.down("md")]: {
          gridTemplateColumns: mobileSharedGridSettings
        }
      },
      loadingContainer: {
        position: "absolute",
        width: "100%",
        paddingTop: constants.generalUnit * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: `${animation.transform * 3}ms`,
        "& svg": {
          marginBottom: constants.generalUnit * 2
        }
      },
      confirmDeletionDialog: {
        top: "50%"
      },
      buttonWrap: {
        whiteSpace: "nowrap"
      }
    })
  }
)

type SortingType = "name" | "size"

const SharedFolderOverview = () => {
  const classes = useStyles()
  const { filesApiClient, accountRestricted } = useFilesApi()
  const { buckets, isLoadingBuckets, refreshBuckets } = useFiles()
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<SortingType>("name")
  const { redirect } = useHistory()
  const { desktop } = useThemeSwitcher()
  const [bucketToDelete, setBucketToDelete] = useState<BucketKeyPermission | undefined>(undefined)
  const [isDeleteBucketModalOpen, setIsDeleteBucketModalOpen] = useState(false)
  const [isDeletingSharedFolder, setIsDeletingSharedFolder] = useState(false)
  const bucketsToShow = useMemo(() => buckets.filter(b => b.type === "share" && b.status !== "deleting"), [buckets])
  const { hasSeenSharingExplainerModal, hideModal } = useSharingExplainerModalFlag()
  const [isSharedFolderCreationModalOpen, setIsSharedFolderCreationModalOpen] = useState(false)
  const [bucketToEdit, setBucketToEdit] = useState<BucketKeyPermission | undefined>(undefined)
  const { selectedLocale } = useLanguageContext()
  const sortedBuckets = useMemo(() => {
    let temp = bucketsToShow

    switch (column) {
      case "size": {
        temp = bucketsToShow.sort((a, b) => (a.size < b.size ? -1 : 1))
        break
      }
      // defaults to name sorting
      default: {
        temp = bucketsToShow.sort((a, b) => {
          if(!a.name || !b.name) return 0

          return a.name.localeCompare(b.name, selectedLocale, {
            sensitivity: "base"
          })
        })
      }
    }

    return direction === "descend"
      ? temp.reverse()
      : temp
  }, [bucketsToShow, column, direction, selectedLocale])

  usePageTrack()

  useEffect(() => {
    refreshBuckets(true)
  }, [refreshBuckets])

  const handleSortToggle = useCallback((targetColumn: SortingType) => {
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

  const handleRename = useCallback((bucket: BucketKeyPermission, newName: string) => {
    filesApiClient.updateBucket(bucket.id, {
      ...bucket,
      name: newName
    }).then(() => refreshBuckets(false))
      .catch(console.error)
  }, [filesApiClient, refreshBuckets])

  const handleDeleteBucket = useCallback((bucket: BucketKeyPermission) => {
    setIsDeletingSharedFolder(true)
    filesApiClient.removeBucket(bucket.id)
      .then(() => refreshBuckets(false))
      .catch(console.error)
      .finally(() => {
        setIsDeletingSharedFolder(false)
        setBucketToDelete(undefined)
        setIsDeleteBucketModalOpen(false)
      })
  }, [filesApiClient, refreshBuckets])

  const openSharedFolder = useCallback((bucketId: string) => {
    redirect(ROUTE_LINKS.SharedFolderExplorer(bucketId, "/"))
  }, [redirect])
  return (
    <>
      <article
        className={clsx(classes.root, {
          bottomBanner: accountRestricted
        })}
      >
        <header className={classes.header}>
          <Typography
            variant="h1"
            component="h1"
            data-cy="shared-overview-header"
          >
            <Trans>Shared folders</Trans>
          </Typography>
          <div className={classes.controls}>
            <Button
              variant='outline'
              onClick={() => setIsSharedFolderCreationModalOpen(true)}
              data-cy="button-create-a-shared-folder"
            >
              <PlusIcon />
              <span className={classes.buttonWrap}>
                <Trans>Create</Trans>
              </span>
            </Button>
          </div>
        </header>
        {isLoadingBuckets && (
          <div className={classes.loadingContainer}>
            <Loading
              size={24}
              type="initial"
            />
            <Typography
              variant="body2"
              component="p"
            >
              <Trans>Loading your shared folders…</Trans>
            </Typography>
          </div>
        )}
        {!isLoadingBuckets && (
          <Table
            fullWidth={true}
            striped={true}
            hover={true}
          >
            <TableHead className={classes.tableHead}>
              <TableRow
                type="grid"
                className={classes.tableRow}
              >
                {desktop &&
                <TableHeadCell>
                  {/* Icon */}
                </TableHeadCell>
                }
                <TableHeadCell
                  sortButtons={true}
                  align="left"
                  onSortChange={() => handleSortToggle("name")}
                  sortDirection={column === "name" ? direction : undefined}
                  sortActive={column === "name"}
                >
                  <Trans>Name</Trans>
                </TableHeadCell>
                {desktop &&
                  <TableHeadCell align="left">
                    <Trans>Owner</Trans>
                  </TableHeadCell>
                }
                <TableHeadCell align="left">
                  <Trans>Shared with</Trans>
                </TableHeadCell>
                {desktop &&
                  <TableHeadCell
                    sortButtons={true}
                    align="left"
                    onSortChange={() => handleSortToggle("size")}
                    sortDirection={column === "size" ? direction : undefined}
                    sortActive={column === "size"}
                  >
                    <Trans>Size</Trans>
                  </TableHeadCell>
                }
                <TableHeadCell>{/* Menu */}</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBuckets.map((bucket) =>
                <SharedFolderRow
                  key={bucket.id}
                  bucket={bucket}
                  handleRename={handleRename}
                  openSharedFolder={openSharedFolder}
                  onEditSharedFolder={() => setBucketToEdit(bucket)}
                  handleDeleteSharedFolder={() => {
                    setBucketToDelete(bucket)
                    setIsDeleteBucketModalOpen(true)
                  }}
                />
              )}
            </TableBody>
          </Table>
        )}
      </article>
      <SharingExplainerModal
        showModal={!hasSeenSharingExplainerModal}
        onHide={hideModal}
      />
      {isSharedFolderCreationModalOpen && <CreateSharedFolderModal onClose={() => setIsSharedFolderCreationModalOpen(false)}/>}
      <CreateOrManageSharedFolderModal
        onClose={() => setBucketToEdit(undefined)}
        bucketToEdit={bucketToEdit}
        isModalOpen={!!bucketToEdit}
      />

      <Dialog
        active={isDeleteBucketModalOpen}
        reject={() => setIsDeleteBucketModalOpen(false)}
        accept={() => bucketToDelete && handleDeleteBucket(bucketToDelete)}
        requestMessage={bucketToDelete?.permission === "owner"
          ? "You are about to delete a shared folder. Please make sure that you have backed up any necessary content"
          : "You will be removed from the shared folder. Only the owner of the folder can add you back."
        }
        rejectText = {t`Cancel`}
        acceptText = {t`Confirm`}
        acceptButtonProps={{ loading: isDeletingSharedFolder, disabled: isDeletingSharedFolder, testId: "confirm-deletion" }}
        rejectButtonProps={{ disabled: isDeletingSharedFolder, testId: "cancel-deletion" }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
        testId={bucketToDelete?.permission === "owner"
          ? "shared-folder-deletion"
          : "shared-folder-leave"
        }
      />
      {accountRestricted &&
        <RestrictedModeBanner />
      }
    </>
  )
}

export default SharedFolderOverview
