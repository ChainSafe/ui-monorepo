import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Button,
  Grid,
  PlusIcon,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import { CSSTheme } from "../../Themes/types"
import { useStorage } from "../../Contexts/StorageContext"
import { Trans } from "@lingui/macro"
import BucketRow from "../Elements/BucketRow"
import CustomModal from "../Elements/CustomModal"

export const desktopGridSettings = "3fr 190px 70px !important"
export const mobileGridSettings = "3fr 190px 70px !important"

const useStyles = makeStyles(({ breakpoints, animation, constants, typography }: CSSTheme) =>
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
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    modalRoot: {
      padding: constants.generalUnit * 4,
      flexDirection: "column"
    },
    input: {
      marginBottom: constants.generalUnit * 2
    },
    heading: {
      color: constants.createFolder.color,
      fontWeight: typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: constants.generalUnit * 4
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
      <header className={classes.header}>
        <Typography variant='h1'>
          <Trans>
          Buckets
          </Trans>
        </Typography>
        <div className={classes.controls}>
          <Button
            onClick={() => setCreateBucketOpen(true)}
            variant="outline"
          >
            <PlusIcon />
            <Trans>Create Bucket</Trans>
          </Button>
        </div>
      </header>
      <Table
        fullWidth={true}
        striped={true}
        hover={true}
      >
        <TableHead className={classes.tableHead}>
          <TableRow
            type="grid"
            className={classes.tableRow}
          >
            <TableHeadCell
              sortButtons={false}
              align="left"
            >
              <Trans>Name</Trans>
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
        <div className={classes.modalRoot}>
          <Grid
            item
            xs={12}
            sm={12}
          >
            <Typography
              className={classes.heading}
              variant="h5"
              component="h5"
            >
              <Trans>Create Bucket</Trans>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            className={classes.input}
          >
            <Typography><Trans>Bucket Name</Trans></Typography>
            <TextInput
              value={newBucketName}
              onChange={(val) => setNewBucketName(String(val))} />
          </Grid>
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
        </div>
      </CustomModal>
    </div>
  )
}

export default BucketsPage
