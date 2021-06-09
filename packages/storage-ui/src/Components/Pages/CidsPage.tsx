import React, { useCallback } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Table, TableBody, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import CidRow from "../Elements/CidRow"
import { CSFTheme } from "../../Themes/types"

export const desktopGridSettings = "3fr 190px 190px 190px 70px !important"
export const mobileGridSettings = "3fr 190px 190px 190px 70px !important"

const useStyles = makeStyles(({ animation, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden"
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
  const { pins, addPin } = useStorage()

  const onCreateHardcodedPin = useCallback(() => {
    addPin("QmNbbff884cwp1pvH8muod4pNaUqHA2ph77nYXP7dps2Xw")
  }, [addPin])

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Cids</Typography>
      <button onClick={onCreateHardcodedPin}>create pin with hardcoded cid</button>
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
            <TableHeadCell>{/* IPFS Gateway */}</TableHeadCell>
            <TableHeadCell>{/* Menu */}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pins.map((pinObject, index) =>
            <CidRow
              pinObject={pinObject}
              key={index}
            />
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CidsPage
