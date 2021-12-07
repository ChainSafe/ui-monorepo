import { Button, Loading, MenuDropdown, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { NonceResponse, NonceResponsePermission } from "@chainsafe/files-api-client"
import { t, Trans } from "@lingui/macro"
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { CSFTheme } from "../../../../Themes/types"
import SharingLink from "./SharingLink"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) => {
    return createStyles({
      root: {
        padding: 2 * constants.generalUnit
      },
      options: {
        backgroundColor: constants.header.optionsBackground,
        color: constants.header.optionsTextColor,
        border: `1px solid ${constants.header.optionsBorder}`,
        minWidth: 145
      },
      menuItem: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: constants.header.menuItemTextColor,
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit,
          fill: palette.additional["gray"][7],
          stroke: palette.additional["gray"][7]
        }
      },
      icon: {
        "& svg": {
          fill: constants.header.iconColor
        }
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: constants.fileSystemItemRow.menuIcon
      },
      permissionDropdown: {
        padding: `0px ${constants.generalUnit}px`,
        backgroundColor: palette.additional["gray"][1],
        marginLeft: constants.generalUnit,
        borderColor: palette.additional["gray"][5],
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "4px"
      },
      rightsText: {
        display: "inline-block"
      },
      createLinkButton: {
        width: "100%"
      },
      dropdownTitle: {
        padding: `${constants.generalUnit * 0.75}px ${constants.generalUnit}px`
      },
      heading : {
        marginBottom: constants.generalUnit
      },
      loadingContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      },
      grayWrapper: {
        backgroundColor: palette.additional["gray"][3],
        borderRadius: "4px",
        display: "flex",
        padding: constants.generalUnit * 2,
        flexDirection: "column"
      },
      creationWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        margin: "auto"
      },
      rightSelection: {
        marginBottom: constants.generalUnit
      },
      loader: {
        textAlign: "center"
      },
      activeLinks: {
        marginBottom: constants.generalUnit
      }
    })
  }
)

const MAX_LINKS = 2

interface Props {
  bucketId: string
  bucketEncryptionKey: string
}

interface LinkMenuItems {
  id: NonceResponsePermission
  onClick: () => void
  contents: ReactNode
}

const readRights = t`view-only`
const editRights = t`can-edit`
export const translatedPermission = (permission: NonceResponsePermission) => permission === "read" ? readRights : editRights

const LinkList = ({ bucketId, bucketEncryptionKey }: Props) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [nonces, setNonces] = useState<NonceResponse[]>([])
  const [isLoadingNonces, setIsLoadingNonces] = useState(false)
  const [isLoadingCreation, setIsLoadingCreation] = useState(false)
  const hasAReadNonce = useMemo(() => !!nonces.find(n => n.permission === "read"), [nonces])
  const [newLinkPermission, setNewLinkPermission] = useState<NonceResponsePermission | undefined>(undefined)
  const menuItems: LinkMenuItems[] = useMemo(() => [
    {
      id: "read",
      onClick: () => setNewLinkPermission("read"),
      contents: (
        <div
          data-cy="menu-read"
          className={classes.menuItem}
        >
          {readRights}
        </div>
      )
    },
    {
      id: "write",
      onClick: () => setNewLinkPermission("write"),
      contents: (
        <div
          data-cy="menu-write"
          className={classes.menuItem}
        >
          {editRights}
        </div>
      )
    }
  ], [classes.menuItem])

  const displayedItems = useMemo(() => nonces.length === 0
    ? menuItems
    : hasAReadNonce
      ? menuItems.filter(i => i.id === "write")
      : menuItems.filter(i => i.id === "read")
  , [hasAReadNonce, menuItems, nonces.length]
  )

  useEffect(() => {
    setNewLinkPermission(displayedItems[0].id)
  }, [displayedItems])

  const refreshNonces = useCallback(() => {
    setIsLoadingNonces(true)
    filesApiClient.getAllNonces()
      .then((res) => {
        const noncesForCurrentBucket = res.filter(n => n.bucket_id === bucketId)
        setNonces(noncesForCurrentBucket)
      })
      .catch(console.error)
      .finally(() => setIsLoadingNonces(false))
  }, [bucketId, filesApiClient])

  useEffect(() => {
    refreshNonces()
  }, [filesApiClient, refreshNonces])

  const onCreateNonce = useCallback(() => {

    if (!newLinkPermission) {
      console.error("Permission not set")
      return
    }

    setIsLoadingCreation(true)

    return filesApiClient
      .createNonce({ bucket_id: bucketId, permission: newLinkPermission })
      .catch(console.error)
      .finally(() => {
        setIsLoadingCreation(false)
        refreshNonces()
      })
  }, [bucketId, filesApiClient, newLinkPermission, refreshNonces])

  return (
    <div className={classes.root}>
      {!!nonces.length && !isLoadingNonces && (
        <div className={classes.activeLinks}>
          <Typography
            component="h4"
            variant="h4"
            className={classes.heading}
          >
            <Trans>Active links</Trans>
          </Typography>
          <div className={classes.grayWrapper}>
            { nonces.map((nonce) =>
              <SharingLink
                key={nonce.id}
                refreshNonces={refreshNonces}
                bucketEncryptionKey={bucketEncryptionKey}
                nonce={nonce}
              />
            )}
          </div>
        </div>
      )}
      {isLoadingNonces && (
        <Typography
          component="p"
          className={classes.loader}
        >
          <Loading
            type="initial"
            size={24}
          />
        </Typography>
      )}
      {nonces.length < MAX_LINKS && (
        <>
          <Typography
            component="h4"
            variant="h4"
            className={classes.heading}
          >
            <Trans>Create a sharing link</Trans>
          </Typography>
          <div className={classes.grayWrapper}>
            <div className={classes.creationWrapper}>
              <div className={classes.rightSelection}>
                <Typography
                  component="h5"
                  variant="h5"
                  className={classes.rightsText}
                >
                  <Trans>Anyone with the link can: </Trans>
                </Typography>
                <MenuDropdown
                  title={(newLinkPermission && translatedPermission(newLinkPermission)) || ""}
                  anchor="bottom-right"
                  className={classes.permissionDropdown}
                  classNames={{
                    icon: classes.icon,
                    options: classes.options,
                    title: classes.dropdownTitle
                  }}
                  testId="permission"
                  menuItems={displayedItems}
                />
              </div>
              <Button
                className={classes.createLinkButton}
                onClick={onCreateNonce}
                variant="secondary"
                disabled={isLoadingCreation}
                loading={isLoadingCreation}
                data-cy="button-create-link"
              >
                <Trans>Create link</Trans>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LinkList
