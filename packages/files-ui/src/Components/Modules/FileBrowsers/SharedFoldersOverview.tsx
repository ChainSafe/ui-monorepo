import React, { useCallback, useMemo, useState } from "react"
import { Typography, Table, TableHead, TableRow, TableHeadCell, TableBody, SortDirection, Loading } from "@chainsafe/common-components"
import { useFiles } from "../../../Contexts/FilesContext"
import { Trans } from "@lingui/macro"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import SharedFolderRowWrapper from "./SharedFolderRowWrapper"
import clsx from "clsx"
import { Bucket } from "@chainsafe/files-api-client"

export const desktopSharedGridSettings = "69px 3fr 190px 150px 45px !important"
export const mobileSharedGridSettings = "3fr 50px 45px !important"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette }: CSFTheme) => {

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
      }
    })
  }
)

const SharedFolderOverview = () => {
  const classes = useStyles()
  const { buckets, refreshBuckets, isLoadingBuckets } = useFiles()
  const { filesApiClient, encryptedEncryptionKey } = useFilesApi()
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
  const { desktop } = useThemeSwitcher()

  const bucketsToShow = useMemo(() => buckets.filter(b => b.type === "share"), [buckets])

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

  const handleRename = useCallback((bucket: Bucket, newName: string) => {
    filesApiClient.updateBucket(bucket.id, {
      name: newName
    }).then(() => refreshBuckets())
      .catch(console.error)
  }, [filesApiClient, refreshBuckets])

  return (
    <article
      className={classes.root}
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
        </div>
      </header>
      <button
        onClick={() => {
          !!encryptedEncryptionKey && filesApiClient.createBucket({
            name: `Cat Bucket ${Date.now()}`,
            encryption_key: encryptedEncryptionKey,
            type: "share"
          }).then(() => {
            refreshBuckets()
          })
            .catch(console.error)
        }}>
        Create a shared &quot;Cat Bucket&quot;
      </button>
      {isLoadingBuckets && (
        <div
          className={clsx(classes.loadingContainer)}
        >
          <Loading size={24}
            type="light" />
          <Typography variant="body2"
            component="p">
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
            <TableRow type="grid"
              className={classes.tableRow}>
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
            {bucketsToShow.map((bucket) =>
              <SharedFolderRowWrapper
                key={bucket.id}
                bucket={bucket}
                handleRename={handleRename}
              />
            )}
          </TableBody>
        </Table>
      )}
    </article>
  )
}

export default SharedFolderOverview
