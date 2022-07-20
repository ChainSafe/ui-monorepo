import { Button, Loading, LinkIcon, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { NonceResponse, NonceResponsePermission } from "@chainsafe/files-api-client"
import { Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { CSFTheme } from "../../../../Themes/types"
import PermissionsDropdown from "./PermissionsDropdown"
import SharingLink from "./SharingLink"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) => {
    return createStyles({
      root: {
        padding: `${constants.generalUnit * 2}px 0`
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
        "& p": {
          fontSize: "16px"
        }
      },
      rightsText: {
        display: "inline-block"
      },
      createLinkButton: {
        padding: "0 8px 0 0 !important",
        textDecoration: "none",
        fontWeight: "normal",
        fontSize: "16px"
      },
      dropdownTitle: {
        padding: `${constants.generalUnit * 0.75}px ${constants.generalUnit}px`,
        "& p": {
          fontSize: "16px"
        }
      },
      heading: {
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
      generateLinkContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: constants.generalUnit * 1.5
      },
      loader: {
        textAlign: "center"
      },
      activeLinks: {
        marginBottom: constants.generalUnit
      },
      linkIcon: {
        fontSize: "24px",
        marginRight: constants.generalUnit * 0.5,
        stroke: palette.additional["gray"][10]
      }
    })
  }
)

const MAX_LINKS = 2

interface Props {
  bucketId: string
  bucketEncryptionKey: string
  setTouchedLinksList: () => void
}

const LinkList = ({ bucketId, bucketEncryptionKey, setTouchedLinksList }: Props) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [nonces, setNonces] = useState<NonceResponse[]>([])
  const [isLoadingNonces, setIsLoadingNonces] = useState(false)
  const [isLoadingCreation, setIsLoadingCreation] = useState(false)
  const hasAReadNonce = useMemo(() => !!nonces.find(n => n.permission === "read"), [nonces])
  const [newLinkPermission, setNewLinkPermission] = useState<NonceResponsePermission | undefined>(undefined)

  useEffect(() => {
    if (hasAReadNonce) {
      setNewLinkPermission("write")
    } else {
      setNewLinkPermission("read")
    }
  }, [nonces, hasAReadNonce])

  const refreshNonces = useCallback((hideLoading?: boolean) => {
    !hideLoading && setIsLoadingNonces(true)
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

    captureEvent("Create sharing link", { permission: newLinkPermission })
    setIsLoadingCreation(true)

    return filesApiClient
      .createNonce({ bucket_id: bucketId, permission: newLinkPermission })
      .catch(console.error)
      .finally(() => {
        setIsLoadingCreation(false)
        refreshNonces()
        setTouchedLinksList()
      })
  }, [bucketId, captureEvent, filesApiClient, newLinkPermission, refreshNonces, setTouchedLinksList])

  return (
    <div className={classes.root}>
      {!!nonces.length && !isLoadingNonces && (
        <div className={classes.activeLinks}>
          <div className={classes.grayWrapper}>
            {nonces.map((nonce) =>
              <SharingLink
                key={nonce.id}
                refreshNonces={refreshNonces}
                bucketEncryptionKey={bucketEncryptionKey}
                nonce={nonce}
                data-cy="link-share-folder"
                setTouchedLinksList={setTouchedLinksList}
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
          <div className={classes.generateLinkContainer}>
            <Button
              className={classes.createLinkButton}
              onClick={onCreateNonce}
              variant="link"
              disabled={isLoadingCreation}
              loading={isLoadingCreation}
              data-cy="button-create-link"
            >
              <LinkIcon className={classes.linkIcon} />
              <Trans>Generate sharing link</Trans>
            </Button>
            <PermissionsDropdown
              selectedPermission={newLinkPermission || "read"}
              permissions={nonces.length === 0 ? ["read", "write"] : hasAReadNonce ? ["write"] : ["read"]}
              onViewPermissionClick={() => setNewLinkPermission("read")}
              onEditPermissionClick={() => setNewLinkPermission("write")}
              withBorders={false}
              injectedClasses={{
                options: classes.options,
                dropdownTitle: classes.dropdownTitle
              }}
              testId="link-permission"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default LinkList
