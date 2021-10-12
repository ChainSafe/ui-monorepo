import { Button, Loading, MenuDropdown } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { NonceResponse, NonceResponsePermission } from "@chainsafe/files-api-client"
import { t, Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { CSFTheme } from "../../../../Themes/types"
import SharingLink from "./SharingLink"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) => {
    return createStyles({
      root: {
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
        backgroundColor: palette.additional["gray"][5],
        marginLeft: constants.generalUnit
      },
      createLink: {
        display: "flex",
        alignItems: "center",
        margin: `${constants.generalUnit * 2.5}px 0`
      },
      createLinkButton: {
        marginRight: constants.generalUnit
      },
      dropdownTitle: {
        padding: `${constants.generalUnit * 0.75}px ${constants.generalUnit}px`
      }
    })
  }
)

interface Props {
  bucketId: string
  bucketEncryptionKey: string
}

export const readMenu = t`read rights`
export const editMenu = t`edit rights`


const LinkList = ({ bucketId, bucketEncryptionKey }: Props) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [nonces, setNonces] = useState<NonceResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newLinkPermission, setNewLinkPermission] = useState<NonceResponsePermission>("read")

  const refreshNonces = useCallback(() => {
    setIsLoading(true)
    filesApiClient.getAllNonces()
      .then((res) => {
        const noncesForCurrentBucket = res.filter(n => n.bucket_id === bucketId)
        setNonces(noncesForCurrentBucket)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [bucketId, filesApiClient])

  useEffect(() => {
    refreshNonces()
  }, [filesApiClient, refreshNonces])

  const onCreateNonce = useCallback(() => {

    setIsLoading(true)

    return filesApiClient
      .createNonce({ bucket_id: bucketId, permission: newLinkPermission })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)
        refreshNonces()
      })
  }, [bucketId, filesApiClient, newLinkPermission, refreshNonces])

  return (
    <div className={classes.root}>
      <div className={classes.createLink}>
        <Button
          className={classes.createLinkButton}
          onClick={onCreateNonce}
          disabled={isLoading}
        >
          <Trans>Create new link</Trans>
        </Button>
        <Trans>with</Trans>
        <MenuDropdown
          title={newLinkPermission === "read" ? readMenu : editMenu}
          anchor="bottom-right"
          className={classes.permissionDropdown}
          classNames={{
            icon: classes.icon,
            options: classes.options,
            title: classes.dropdownTitle
          }}
          testId="permission"
          menuItems={[
            {
              onClick: () => setNewLinkPermission("read"),
              contents: (
                <div
                  data-cy="menu-read"
                  className={classes.menuItem}
                >
                  {readMenu}
                </div>
              )
            },
            {
              onClick: () => setNewLinkPermission("write"),
              contents: (
                <div
                  data-cy="menu-write"
                  className={classes.menuItem}
                >
                  {editMenu}
                </div>
              )
            }
          ]}
        />
      </div>
      {
        isLoading && <Loading size={16} />
      }
      {
        !isLoading && nonces.length > 0 && nonces.map((nonce) =>
          <SharingLink
            key={nonce.id}
            refreshNonces={refreshNonces}
            bucketEncryptionKey={bucketEncryptionKey}
            nonce={nonce}
          />
        )
      }
    </div>
  )
}

export default LinkList
