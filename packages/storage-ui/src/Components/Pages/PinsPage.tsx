import React, { useCallback } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { formatBytes, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden"
    },
    tableHead: {
      marginTop: 24
    }
  })
)

const PinsPage = () => {
  const classes = useStyles()
  const { pins, addPin } = useStorage()

  const onCreatePin = useCallback(() => {
    addPin("QmNbbff884cwp1pvH8muod4pNaUqHA2ph77nYXP7dps2Xw")
  }, [addPin])

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Pins</Typography>
      <button onClick={onCreatePin}>create pin with hardcoded cid</button>
      <Table
        fullWidth={true}
        striped={true}
        hover={true}
        className=""
      >
        <TableHead className={classes.tableHead}>
          <TableRow
            type="grid"
            className=""
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
            <TableRow
              key={index}
              type="grid"
              className=""
            >
              <TableCell>
                {pinObject.pin?.cid}
              </TableCell>
              <TableCell>
                {dayjs(pinObject.created).format("DD MMM YYYY h:mm a")}
              </TableCell>
              <TableCell>
                {/** as any needs to be removed when the api spec will be up to date */}
                {formatBytes((pinObject as any).info.size)}
              </TableCell>
              <TableCell>
                <a
                  href={`https://ipfs.infura.io:5001/api/v0/cat/${pinObject.pin?.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Trans>Open on Gateway</Trans>
                </a>
              </TableCell>
              <TableCell>

              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default PinsPage
