import React, { useCallback } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"
import { useStorage } from "../../Contexts/StorageContext"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden"
    }
  })
)

const PinsPage = () => {
  const classes = useStyles()
  const { pins, addPin } = useStorage()

  const onCreatePin = useCallback(() => {
    addPin("QmZnxeGKi2ALzDeywikKCpNPbFfA8EkUsZPTrvsjyjGLA9")
  }, [addPin])

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Pins</Typography>
      <div onClick={onCreatePin}>create pin</div>
    </div>
  )
}

export default PinsPage
