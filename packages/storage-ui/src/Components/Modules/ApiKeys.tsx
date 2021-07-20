import React, { useEffect, useState, useCallback } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { AccessKey } from "@chainsafe/files-api-client"
import {
  Typography,
  Button,
  PlusIcon,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
  MenuDropdown,
  DeleteSvg,
  MoreIcon } from "@chainsafe/common-components"
import { CSSTheme } from "../../Themes/types"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import SecretField from "../Elements/SecretField"

export const desktopGridSettings = "2fr 2fr 1fr 1.5fr 30px !important"
export const mobileGridSettings = "2fr 2fr 1fr 1.5fr 30px !important"

const useStyles = makeStyles(({ constants, breakpoints, animation }: CSSTheme) =>
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
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    },
    dropdownOptions: {
      backgroundColor: constants.fileSystemItemRow.optionsBackground,
      color: constants.fileSystemItemRow.optionsColor,
      border: `1px solid ${constants.fileSystemItemRow.optionsBorder}`
    },
    dropdownItem: {
      backgroundColor: constants.fileSystemItemRow.itemBackground,
      color: constants.fileSystemItemRow.itemColor
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      "& svg": {
        fill: constants.fileSystemItemRow.menuIcon
      }
    }
  })
)

const ApiKeys = () => {
  const classes = useStyles()
  const { storageApiClient } = useStorageApi()
  const [keys, setKeys] = useState<AccessKey[]>([])

  const fetchAccessKeys = useCallback(() => {
    storageApiClient.listAccessKeys()
      .then(result => setKeys(result))
      .catch(console.error)
  }, [storageApiClient])

  const createStorageAccessKey = useCallback(() => {
    storageApiClient.createAccessKey({ type: "storage" })
      .then(fetchAccessKeys)
      .catch(console.error)
  }, [fetchAccessKeys, storageApiClient])

  const createS3AccessKey = useCallback(() => {
    storageApiClient.createAccessKey({ type: "s3" })
      .then(fetchAccessKeys)
      .catch(console.error)
  }, [fetchAccessKeys, storageApiClient])

  const deleteAccessKey = useCallback((id: string) => {
    storageApiClient.deleteAccessKey(id)
      .then(fetchAccessKeys)
      .catch(console.error)
  }, [storageApiClient, fetchAccessKeys])

  useEffect(() => {
    fetchAccessKeys()
  }, [fetchAccessKeys])

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <Typography
          variant="h1"
          component="h1"
          data-cy="api-keys-header"
        >
          <Trans>
            API Keys
          </Trans>
        </Typography>
        <div className={classes.controls}>
          <Button
            data-cy="add-s3-api-key-button"
            onClick={createS3AccessKey}
            variant="outline"
            size="large"
            // disabled={keys.length > 0}
          >
            <PlusIcon />
            <span>
              <Trans>Add S3 Key</Trans>
            </span>
          </Button>
          <Button
            data-cy="add-storage-api-key-button"
            onClick={createStorageAccessKey}
            variant="outline"
            size="large"
            disabled={keys.filter(k => k.type === "storage").length > 0}
          >
            <PlusIcon />
            <span>
              <Trans>Add API Key</Trans>
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
              <Trans>Id</Trans>
            </TableHeadCell>
            <TableHeadCell
              sortButtons={false}
              align="center"
            >
              <Trans>Type</Trans>
            </TableHeadCell>
            <TableHeadCell
              sortButtons={false}
              align="center"
            >
              <Trans>Status</Trans>
            </TableHeadCell>
            <TableHeadCell
              sortButtons={false}
              align="center"
            >
              <Trans>Created At</Trans>
            </TableHeadCell>
            <TableHeadCell>{/* Menu */}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map(k =>
            <TableRow
              key={k.id}
              type='grid'
              className={classes.tableRow}>
              <TableCell align='left'>
                <Typography>
                  {k.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {k.type}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {k.status}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {dayjs(k.created_at).format("DD MMM YYYY h:mm a")}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <MenuDropdown
                  animation="none"
                  anchor={"bottom-right"}
                  menuItems={[{
                    contents: (
                      <>
                        <DeleteSvg className={classes.menuIcon} />
                        <span data-cy="menu-share">
                          <Trans>Delete Key</Trans>
                        </span>
                      </>
                    ),
                    onClick: () => deleteAccessKey(k.id)
                  }]}
                  classNames={{
                    icon: classes.dropdownIcon,
                    options: classes.dropdownOptions,
                    item: classes.dropdownItem
                  }}
                  indicator={MoreIcon}
                />
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>
  )
}

export default ApiKeys
