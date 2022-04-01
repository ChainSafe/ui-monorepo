import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles, debounce } from "@chainsafe/common-theme"
import { Button, PlusIcon, SearchBar, Table, TableBody, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { t, Trans } from "@lingui/macro"
import CidRow from "../Elements/CidRow"
import { CSSTheme } from "../../Themes/types"
import AddCIDModal from "../Modules/AddCIDModal"
import { PinStatus } from "@chainsafe/files-api-client"
import RestrictedModeBanner from "../Elements/RestrictedModeBanner"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"
import { cid as isCid } from "is-ipfs"

export const desktopGridSettings = "2fr 3fr 180px 110px 80px 20px 70px !important"
export const mobileGridSettings = "2fr 3fr 180px 110px 80px 20px 70px !important"

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

type SortColumn = "size" | "date_uploaded" | "name"
type SortDirection = "ascend" | "descend"

const CidsPage = () => {
  const classes = useStyles()
  const { pins, refreshPins } = useStorage()
  const { accountRestricted } = useStorageApi()
  const [addCIDOpen, setAddCIDOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<SortColumn>("date_uploaded")
  const [sortDirection, setSortDirection] = useState<SortDirection>("descend")
  const [searchQuery, setSearchQuery] = useState("")
  usePageTrack()

  useEffect(() => {
    refreshPins()
  }, [refreshPins])

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
      case "name": {
        temp = pins.sort((a, b) => a.pin.name?.localeCompare(b.pin.name || "") || 0)
        break
      }
      default: {
        temp = pins.sort((a, b) => (a.created < b.created ? -1 : 1))
        break
      }
    }
    return sortDirection === "descend" ? temp.reverse() : temp
  }, [pins, sortDirection, sortColumn])


  const onSearch = (searchString: string) => {
    isCid(searchString)
      ? refreshPins({ searchedCid: searchString.trim() })
      : refreshPins({ searchedName: searchString.trim() })

  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(onSearch, 400), [refreshPins])

  const onSearchChange = (searchString: string) => {
    setSearchQuery(searchString)
    debouncedSearch(searchString)
  }

  return (
    <>
      <Helmet>
        <title>{t`CIDs`} - Chainsafe Storage</title>
      </Helmet>
      <div className={classes.root}>
        <header
          className={classes.header}
          data-cy="header-cids"
        >
          <Typography
            variant="h1"
            component="h1"
          >
            <Trans>CIDs</Trans>
          </Typography>
          <div className={classes.controls}>
            <SearchBar
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              placeholder={t`Search by cid, name…`}
              testId = "cid-search-bar"
              value={searchQuery}
            />
            <Button
              data-cy="button-pin-cid"
              onClick={() => setAddCIDOpen(true)}
              variant="outline"
              size="large"
              disabled={accountRestricted}
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
                data-cy="table-header-name"
                sortButtons={true}
                align="center"
                onSortChange={() => handleSortToggle("name")}
                sortDirection={sortColumn === "name" ? sortDirection : undefined}
                sortActive={sortColumn === "name"}
              >
                <Trans>Name</Trans>
              </TableHeadCell>
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
      {accountRestricted &&
        <RestrictedModeBanner />
      }
    </>
  )
}

export default CidsPage
