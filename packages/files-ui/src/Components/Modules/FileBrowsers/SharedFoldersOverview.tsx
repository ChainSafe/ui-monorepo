import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation, Typography, Table, TableHead, TableRow, TableHeadCell, TableBody, SortDirection } from "@chainsafe/common-components"
import { useFiles, FileSystemItem } from "../../../Contexts/FilesContext"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useFilesApi } from "@chainsafe/common-contexts"
// import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
// import { DISMISSED_SURVEY_KEY } from "../../SurveyBanner"
import clsx from "clsx"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
// import { parseFileContentResponse } from "../../../Utils/Helpers"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette }: CSFTheme) => {
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
          gridTemplateColumns: desktopGridSettings
        },
        [breakpoints.down("md")]: {
          gridTemplateColumns: mobileGridSettings
        }
      }
    })
  }
)

const SharedFolderOverview = () => {
  const classes = useStyles()
  const { buckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
  const { pathname } = useLocation()

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
  console.log(buckets)

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
      {/* <div
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
      </div> */}
      <div
        onClick={() => {
          filesApiClient.listBuckets().then(console.log).catch(console.error)
          // filesApiClient.createBucket({
          //   name: "catBucket",
          //   encryption_key:"none",
          //   type: "share"
          // }).then(console.log)
          //   .catch(console.error)
        }}>
        Click me
      </div>
      <Table
        fullWidth={true}
        striped={true}
        hover={true}
        className={clsx(loadingCurrentPath && classes.fadeOutLoading)}
      >
        <TableHead className={classes.tableHead}>
          <TableRow type="grid"
            className={classes.tableRow}>
            {/* <TableHeadCell>
                    <CheckboxInput
                      value={selectedCids.length === items.length}
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

        <TableBody>
          <div>{bucketsToShow.length}</div>
        </TableBody>
      </Table>
    </article>
  )
}

export default SharedFolderOverview
