import React, { useMemo, useState } from "react"
import { Typography, Table, TableHead, TableRow, TableHeadCell, TableBody, SortDirection } from "@chainsafe/common-components"
import { useFiles } from "../../../Contexts/FilesContext"
import { Trans } from "@lingui/macro"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import SharedFolderRowWrapper from "./SharedFolderRowWrapper"

export const desktopSharedGridSettings = "69px 3fr 190px 150px 69px !important"
export const mobileSharedGridSettings = "69px 3fr 45px !important"

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
      }
    })
  }
)

const SharedFolderOverview = () => {
  const classes = useStyles()
  const { buckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")

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
          filesApiClient.createBucket({
            name: "Cat Bucket",
            // eslint-disable-next-line max-len
            encryption_key:"dc19f9579902e949fd5d517951d6cf2203526b233dc25ca7323e5d56932237e5ed4369871f81015f921decc6d5b5e1b5cf60af9ffaeba4fde2d2969b5dfa131a195bb7b828c6dc2a8434e43f497ce6529d897f09f812f53d4e9f9f3c0f6bce31afd390943e6ae189c820783698521ce2b8f446f557e1c78185c8e8a0ae54370b88",
            type: "share"
          }).then(console.log)
            .catch(console.error)
        }}>
        create shared bucket (hardcoded encryption key!)
      </button>
      <Table
        fullWidth={true}
        striped={true}
        hover={true}
      >
        <TableHead className={classes.tableHead}>
          <TableRow type="grid"
            className={classes.tableRow}>
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
            <TableHeadCell align="left">
              <Trans>Shared with</Trans>
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
              <Trans>Size</Trans>
            </TableHeadCell>
            <TableHeadCell>{/* Menu */}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bucketsToShow.map((bucket) =>
            <SharedFolderRowWrapper
              key={bucket.id}
              bucket={bucket}
            />
          )}
        </TableBody>
      </Table>
    </article>
  )
}

export default SharedFolderOverview
