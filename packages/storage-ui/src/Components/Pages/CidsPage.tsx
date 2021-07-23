import React, { useMemo, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, PlusIcon, Table, TableBody, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import CidRow from "../Elements/CidRow"
import { CSSTheme } from "../../Themes/types"
import AddCIDModal from "../Modules/AddCIDModal"
import { PinStatus } from "@chainsafe/files-api-client"

export const desktopGridSettings = "3fr 160px 120px 120px 140px 70px !important"
export const mobileGridSettings = "3fr 160px 120px 120px 140px 70px !important"

const useStyles = makeStyles(({ animation, breakpoints, constants }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative"
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
    tableHead: {
      marginTop: 24
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
)

type SortColumn = "size" | "date_uploaded"
type SortDirection = "ascend" | "descend"

const CidsPage = () => {
  const classes = useStyles()
  const { pins } = useStorage()
  const [addCIDOpen, setAddCIDOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<SortColumn>("date_uploaded")
  const [sortDirection, setSortDirection] = useState<SortDirection>("descend")

  const handleSortToggle = (
    targetColumn: SortColumn
  ) => {
    if (sortColumn !== targetColumn) {
      setSortColumn(targetColumn)
      setSortDirection("descend")
    } else {
      if (sortDirection === "ascend") {
        setSortDirection("descend")
      } else {
        setSortDirection("ascend")
      }
    }
  }

  const sortedPins: PinStatus[] = useMemo(() => {
    let temp = []

    switch (sortColumn) {
    case "size": {
      temp = pins.sort((a, b) => (a.info?.size < b.info?.size ? -1 : 1))
      break
    }
    default: {
      temp = pins.sort((a, b) => (a.created < b.created ? -1 : 1))
      break
    }
    }
    return sortDirection === "descend" ? temp.reverse() : temp
  }, [pins, sortDirection, sortColumn])

  return (
    <>
      <div className={classes.root}>
        <header
          className={classes.header}
          data-cy="header-cids"
        >
          <Typography
            variant="h1"
            component="h1"
          >
            <Trans>
              Cids
            </Trans>
          </Typography>
          <div className={classes.controls}>
            <Button
              data-cy="button-pin-cid"
              onClick={() => setAddCIDOpen(true)}
              variant="outline"
              size="large"
            >
              <PlusIcon />
              <span>
                <Trans>Pin CID</Trans>
              </span>
            </Button>
          </div>
        </header>
        <Table
          fullWidth={true}
          striped={true}
          hover={true}
          className=""
        >
          <TableHead className={classes.tableHead}>
            <TableRow
              type="grid"
              className={classes.tableRow}
            >
              <TableHeadCell
                data-cy="table-header-cid"
                sortButtons={false}
                align="center"
              >
                <Trans>Cid</Trans>
              </TableHeadCell>
              <TableHeadCell
                data-cy="table-header-created"
                sortButtons={true}
                onSortChange={() => handleSortToggle("date_uploaded")}
                sortDirection={sortColumn === "date_uploaded" ? sortDirection : undefined}
                sortActive={sortColumn === "date_uploaded"}
                align="center"
              >
                <Trans>Created</Trans>
              </TableHeadCell>
              <TableHeadCell
                data-cy="table-header-size"
                sortButtons={true}
                onSortChange={() => handleSortToggle("size")}
                sortDirection={sortColumn === "size" ? sortDirection : undefined}
                sortActive={sortColumn === "size"}
                align="center"
              >
                <Trans>Size</Trans>
              </TableHeadCell>
              <TableHeadCell
                data-cy="table-header-status"
                sortButtons={false}
                align="center"
              >
                <Trans>Status</Trans>
              </TableHeadCell>
              <TableHeadCell>{/* IPFS Gateway */}</TableHeadCell>
              <TableHeadCell>{/* Menu */}</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPins.map((pinStatus, index) =>
              <CidRow
                data-cy="row-pin-status"
                pinStatus={pinStatus}
                key={index}
              />
            )}
          </TableBody>
        </Table>
      </div>
      <AddCIDModal
        close={() => setAddCIDOpen(false)}
        modalOpen={addCIDOpen}
      />
    </>
  )
}

export default CidsPage
