
import { CopyIcon, DeleteSvg, Loading, MoreIcon, Typography } from "@chainsafe/common-components"
import { createStyles, debounce, makeStyles } from "@chainsafe/common-theme"
import { NonceResponse } from "@chainsafe/files-api-client"
import { Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import { CSFTheme } from "../../../../Themes/types"
import Menu from "../../../../UI-components/Menu"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import { translatedPermission } from "./LinkList"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette, zIndex, animation }: CSFTheme) => {
    return createStyles({
      root: {
        display: "flex",
        maxWidth: "100%",
        "&:not(:first-child)": {
          marginTop: constants.generalUnit * 2
        }
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
        marginRight: constants.generalUnit * 2,
        flex: 1,
        whiteSpace: "nowrap",
        padding: `0 ${constants.generalUnit}px`,
        backgroundColor: palette.additional["gray"][5],
        borderRadius: "10px"
      },
      copyButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: constants.generalUnit * 2,
        cursor: "pointer"
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
      },
      copyIcon: {
        fontSize: "24px",
        fill: constants.profile.icon,
        [breakpoints.down("md")]: {
          fontSize: "18px",
          fill: palette.additional["gray"][9]
        }
      },
      copiedFlag: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        left: "50%",
        top: 0,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: zIndex?.layer1,
        transitionDuration: `${animation.transform}ms`,
        backgroundColor: constants.loginModule.flagBg,
        color: constants.loginModule.flagText,
        padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
        borderRadius: 2,
        "&:after": {
          transitionDuration: `${animation.transform}ms`,
          content: "''",
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translate(-50%,0)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `5px solid ${constants.loginModule.flagBg}`
        }
      },
      dropdownIcon: {
        width: 14,
        height: 14,
        padding: 0,
        position: "relative",
        fontSize: "unset",
        "& svg": {
          fill: constants.fileSystemItemRow.dropdownIcon,
          top: "50%",
          left: 0,
          width: 14,
          height: 14,
          position: "absolute"
        }
      },
      focusVisible: {
        backgroundColor: "transparent !important"
      },
      menuRoot: {
        zIndex: "2500 !important" as any
      },
      loader: {
        display: "flex",
        alignItems: "center",
        margin: "auto"
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
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if(!nonce?.bucket_id || !nonce?.id) {
      return
    }

    const newJwt = createJWT(nonce.bucket_id, nonce.id, nonce.permission)
    newJwt && setJwt(newJwt)
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
    setIsDeleting(true)
    filesApiClient.revokeNonce(nonce.id)
      .catch(console.error)
      .finally(() => {
        refreshNonces()
        setIsDeleting(false)
      })
  }, [filesApiClient, nonce, refreshNonces])

  if (isDeleting) {
    return (
      <>
        <Typography
          component="p"
          className={classes.loader}
        >
          <Loading
            type="inherit"
            size={24}
          />
        </Typography>
      </>
    )
  }

  return (
    <div className={classes.root}>
      {copied && (
        <div className={classes.copiedFlag}>
          <Trans>
            Copied!
          </Trans>
        </div>
      )}
      <div
        onClick={onCopyInfo}
        className={classes.linkWrapper}
      >
        <Typography className={classes.link}>
          {link}
        </Typography>
      </div>
      <div className={classes.permissionWrapper}>
        <Typography className={classes.link}>
          {translatedPermission(nonce.permission)}
        </Typography>
      </div>
      <div
        className={classes.copyButton}
        onClick={onCopyInfo}
      >
        <CopyIcon className={classes.copyIcon} />
      </div>
      <Menu
        testId='linkDropdown'
        icon={<MoreIcon className={classes.dropdownIcon} />}
        options={[{
          contents: (
            <>
              <DeleteSvg className={classes.menuIcon} />
              <span data-cy="menu-delete">
                <Trans>Delete</Trans>
              </span>
            </>
          ),
          onClick: onDeleteNonce
        }]}
        style={{ focusVisible: classes.focusVisible, root: classes.menuRoot }}
      />
    </div>
  )
}

export default SharingLink
