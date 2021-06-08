import React, { useCallback } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Table, TableBody, TableHead, TableHeadCell, TableRow, Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import PinRow from "../Elements/PinRow"

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

const BucketsPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Buckets</Typography>
    </div>
  )
}

export default BucketsPage
