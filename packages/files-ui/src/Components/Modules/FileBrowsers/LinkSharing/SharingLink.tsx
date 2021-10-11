
import { Button, DeleteSvg, Typography } from "@chainsafe/common-components"
import { createStyles, debounce, makeStyles } from "@chainsafe/common-theme"
import { NonceResponse } from "@chainsafe/files-api-client"
import { Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import { CSFTheme } from "../../../../Themes/types"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import { editMenu, readMenu } from "./LinkList"

const useStyles = makeStyles(
  ({ constants }: CSFTheme) => {
    return createStyles({
      root: {
        display: "flex",
        marginBottom: constants.generalUnit * 0.5
      },
      linkWrapper: {
        whiteSpace: "nowrap",
        marginRight: constants.generalUnit * 2,
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      },
      permissionWrapper: {
        display: "flex",
        alignItems: "center",
        marginRight: constants.generalUnit,
        flex: 1,
        whiteSpace: "nowrap"
      },
      copyButton: {
        flex: 1,
        whiteSpace: "nowrap",
        marginRight: constants.generalUnit
      },
      link: {
        textOverflow: "ellipsis",
        overflow: "hidden"
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: constants.fileSystemItemRow.menuIcon
      }
    })
  }
)

interface Props {
  nonce: NonceResponse
  bucketEncryptionKey: string
  refreshNonces: () => void
}

const SharingLink = ({ nonce, bucketEncryptionKey, refreshNonces }: Props) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [link, setLink] = useState("")
  const [jwt, setJwt] = useState("")
  const { createJWT } = useThresholdKey()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(!nonce?.bucket_id || !nonce?.id) {
      return
    }

    const newJwt = createJWT(nonce.bucket_id, nonce.id, nonce.permission)
    newJwt && setJwt(newJwt)
    setIsLoading(false)
  }, [createJWT, nonce])

  useEffect(() => {
    if(!jwt) {
      return
    }

    setLink(`${window.location.origin}${ROUTE_LINKS.SharingLink(nonce.permission, jwt, bucketEncryptionKey)}`)
  }, [jwt, bucketEncryptionKey, nonce])

  const debouncedSwitchCopied = debounce(() => setCopied(false), 3000)

  const onCopyInfo = useCallback(() => {
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true)
        debouncedSwitchCopied()
      })
      .catch(console.error)
  }, [debouncedSwitchCopied, link])

  const onDeleteNonce = useCallback(() => {
    setIsLoading(true)
    filesApiClient.revokeNonce(nonce.id)
      .catch(console.error)
      .finally(() => {
        refreshNonces()
        setIsLoading(false)
      })
  }, [filesApiClient, nonce, refreshNonces])

  return (
    <div className={classes.root}>
      <div className={classes.linkWrapper}>
        <Typography className={classes.link}>
          {link}
        </Typography>
      </div>
      <div className={classes.permissionWrapper}>
        <Typography className={classes.link}>
          {nonce.permission === "read" ? readMenu : editMenu}
        </Typography>
      </div>
      <Button
        className={classes.copyButton}
        onClick={onCopyInfo}
        disabled={isLoading}
      >
        {
          copied
            ? <Trans>Copied!</Trans>
            : <Trans>Copy link</Trans>
        }
      </Button>
      <Button
        className={""}
        onClick={onDeleteNonce}
        variant={"secondary"}
        disabled={isLoading}
        loading={isLoading}
      >
        <DeleteSvg className={classes.menuIcon} />
      </Button>
    </div>
  )
}

export default SharingLink
