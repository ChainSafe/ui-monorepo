
import { CopyIcon, DeleteSvg, MoreIcon, Typography } from "@chainsafe/common-components"
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
  ({ constants, palette, zIndex, animation, typography }: CSFTheme) => {
    return createStyles({
      root: {
        display: "flex",
        maxWidth: "100%",
        position: "relative",
        "&:not(:first-child)": {
          marginTop: constants.generalUnit * 3
        }
      },
      linkWrapper: {
        whiteSpace: "nowrap",
        marginRight: constants.generalUnit * 3,
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      },
      permissionWrapper: {
        display: "flex",
        alignItems: "center",
        marginRight: constants.generalUnit * 3,
        flex: 1,
        whiteSpace: "nowrap",
        textAlign: "right",
        fontWeight: typography.fontWeight.regular
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
        fontSize: "18px",
        fill: palette.additional["gray"][8]
      },
      copiedFlag: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        left: "50%",
        top: -15,
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "unset",
        "& svg": {
          fill: constants.fileSystemItemRow.dropdownIcon,
          width: 14,
          height: 14
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
      },
      menuWrapper: {
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
  refreshNonces: (hideLoading?: boolean) => void
}

const SharingLink = ({ nonce, bucketEncryptionKey, refreshNonces }: Props) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [link, setLink] = useState("")
  const [jwt, setJwt] = useState("")
  const { createJWT } = useThresholdKey()
  const [copied, setCopied] = useState(false)

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

    // //Create a textbox field where we can insert text to. 
    // const copyFrom = document.createElement("textarea")

    // //Set the text content to be the text you wished to copy.
    // copyFrom.textContent = link

    // //Append the textbox field into the body as a child. 
    // //"execCommand()" only works when there exists selected text, and the text is inside 
    // //document.body (meaning the text is part of a valid rendered HTML element).
    // document.body.appendChild(copyFrom)

    // //Select all the text!
    // copyFrom.select()

    // //Execute command
    // document.execCommand("copy")

    // //(Optional) De-select the text using blur(). 
    // copyFrom.blur()

    // //Remove the textbox field from the document.body, so no other JavaScript nor 
    // //other elements can get access to this.
    // document.body.removeChild(copyFrom)

    setCopied(true)
    debouncedSwitchCopied()
  }, [debouncedSwitchCopied, link])

  const onDeleteNonce = useCallback(() => {
    filesApiClient.revokeNonce(nonce.id)
      .catch(console.error)
      .finally(() => {
        refreshNonces(true)
      })
  }, [filesApiClient, nonce, refreshNonces])

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
        data-cy="link-active-share"
      >
        <Typography className={classes.link}>
          {link}
        </Typography>
      </div>
      <div
        className={classes.permissionWrapper}
        data-cy="label-permission-type"
      >
        <Typography className={classes.link}>
          <b>{translatedPermission(nonce.permission)}</b>
        </Typography>
      </div>
      <div
        className={classes.copyButton}
        onClick={onCopyInfo}
        data-cy="button-copy-link"
      >
        <CopyIcon className={classes.copyIcon} />
      </div>
      <div className={classes.menuWrapper}>
        <Menu
          testId='link-kebab'
          icon={<MoreIcon className={classes.dropdownIcon} />}
          options={[{
            contents: (
              <>
                <DeleteSvg className={classes.menuIcon} />
                <span data-cy="menu-delete-active-link">
                  <Trans>Delete</Trans>
                </span>
              </>
            ),
            onClick: onDeleteNonce
          }]}
          style={{ focusVisible: classes.focusVisible, root: classes.menuRoot }}
        />
      </div>
    </div>
  )
}

export default SharingLink
