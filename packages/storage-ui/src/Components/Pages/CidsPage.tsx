import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, PlusIcon, Table, TableBody, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import CidRow from "../Elements/CidRow"
import { CSSTheme } from "../../Themes/types"
import AddCIDModal from "../Modules/AddCIDModal"

export const desktopGridSettings = "3fr 190px 190px 190px 190px 70px !important"
export const mobileGridSettings = "3fr 190px 190px 190px 190px 70px !important"

const useStyles = makeStyles(({ animation, breakpoints, constants }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative",
      overflow: "hidden"
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

const CidsPage = () => {
  const classes = useStyles()
  const { pins } = useStorage()
  const [addCIDOpen, setAddCIDOpen] = useState(false)

  return (
    <>
      <div className={classes.root}>
        <header className={classes.header}>
          <Typography
            variant="h1"
            component="h1"
            data-cy="cids-header"
          >
            <Trans>
              Cids
            </Trans>
          </Typography>
          <div className={classes.controls}>
            <Button
              data-cy="add-cid-modal-button"
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
                sortButtons={false}
                align="center"
              >
                <Trans>Cid</Trans>
              </TableHeadCell>
              <TableHeadCell
                sortButtons={false}
                align="center"
              >
                <Trans>Created</Trans>
              </TableHeadCell>
              <TableHeadCell
                sortButtons={false}
                align="center"
              >
                <Trans>Size</Trans>
              </TableHeadCell>
              <TableHeadCell
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
            {pins.map((pinStatus, index) =>
              <CidRow
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
