import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, Table, TableBody, TableHead, TableHeadCell, TableRow, TextInput, Typography } from "@chainsafe/common-components"
import { CSSTheme } from "../../Themes/types"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import BucketRow from "../Elements/BucketRow"
import CustomModal from "../Elements/CustomModal"

export const desktopGridSettings = "3fr 190px 190px 190px 70px !important"
export const mobileGridSettings = "3fr 190px 190px 190px 70px !important"

const useStyles = makeStyles(({ breakpoints, animation, constants }: CSSTheme) =>
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
    },
    modalFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    createBucketModal: {
      padding: constants.generalUnit * 4
    },
    modalInner: {
      [breakpoints.down("md")]: {
        bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    okButton: {
      marginLeft: constants.generalUnit
    },
    cancelButton: {
      [breakpoints.down("md")]: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: constants?.mobileButtonHeight
      }
    }
  })
)

const BucketsPage = () => {
  const classes = useStyles()
  const { storageBuckets, createBucket } = useStorage()
  const [createBucketModalOpen, setCreateBucketOpen] = useState(false)
  const [newBucketName, setNewBucketName] = useState("")

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Buckets</Typography>
      <Button onClick={() => setCreateBucketOpen(true)}>Create Bucket</Button>
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
              <Trans>Name</Trans>
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
            <TableHeadCell>{/* Menu */}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storageBuckets.map((bucket) =>
            <BucketRow
              bucket={bucket}
              key={bucket.id}
            />
          )}
        </TableBody>
      </Table>
      <CustomModal
        active={createBucketModalOpen}
        className={classes.createBucketModal}
        injectedClass={{
          inner: classes.modalInner
        }}
        closePosition="none"
      >
        <Typography>Bucket Name</Typography>
        <TextInput
          value={newBucketName}
          onChange={(val) => setNewBucketName(String(val))} />
        <footer className={classes.modalFooter}>
          <Button
            onClick={() => setCreateBucketOpen(false)}
            size="medium"
            className={classes.cancelButton}
            variant="outline"
            type="button"
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant="primary"
            size="medium"
            className={classes.okButton}
            onClick={() => {
              createBucket(newBucketName)
              setCreateBucketOpen(false)
            }}
          >
            <Trans>Create</Trans>
          </Button>
        </footer>
      </CustomModal>
    </div>
  )
}

export default BucketsPage
