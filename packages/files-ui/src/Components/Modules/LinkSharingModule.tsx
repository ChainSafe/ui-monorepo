import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, CheckCircleIcon, ExclamationCircleIcon, Loading, Typography, useHistory, useLocation } from "@chainsafe/common-components"
import { getBucketDecryptionFromHash, getJWT } from "../../Utils/pathUtils"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import { t, Trans } from "@lingui/macro"
import { useFiles } from "../../Contexts/FilesContext"
import jwtDecode from "jwt-decode"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { ROUTE_LINKS } from "../FilesRoutes"
import { translatedPermission } from "./FileBrowsers/LinkSharing/LinkList"
import { NonceResponsePermission } from "@chainsafe/files-api-client"

const useStyles = makeStyles(
  ({ constants, palette, breakpoints }: CSFTheme) =>
    createStyles({
      root:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      box: {
        backgroundColor: constants.loginModule.background,
        border: `1px solid ${constants.landing.border}`,
        boxShadow: constants.landing.boxShadow,
        borderRadius: 6,
        maxWidth: constants.generalUnit * 70,
        padding: constants.generalUnit * 5,
        [breakpoints.down("md")]: {
          justifyContent: "center",
          width: "100%"
        }
      },
      icon : {
        display: "flex",
        alignItems: "center",
        fontSize: constants.generalUnit * 6,
        "& svg": {
          fill: palette.additional["gray"][7]
        }
      },
      errorMessage: {
        textAlign: "center"
      },
      messageWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      },
      browseButton : {
        marginTop: constants.generalUnit * 2
      }
    })
)

export interface DecodedNonceJwt {
  bucket_id?: string
  permission?: NonceResponsePermission
  nonce_id?: string
}

const LinkSharingModule = () => {
  const { pathname, hash } = useLocation()
  const { redirect } = useHistory()
  const jwt = useMemo(() => getJWT(pathname), [pathname])
  const bucketDecryptionKey = useMemo(() => getBucketDecryptionFromHash(hash), [hash])
  const { filesApiClient } = useFilesApi()
  const { refreshBuckets, buckets } = useFiles()
  const { publicKey, encryptForPublicKey } = useThresholdKey()
  const [encryptedEncryptionKey, setEncryptedEncryptionKey] = useState("")
  const [error, setError] = useState("")
  const classes = useStyles()
  const { bucket_id: bucketId, permission, nonce_id } = useMemo(() => {
    try {
      return (jwt && jwtDecode<DecodedNonceJwt>(jwt)) || {}
    }catch (e) {
      console.error(e)
      setError(t`This link is marlformed. Please verify that you copy/pasted it correctly.`)
      return {}
    }
  }, [jwt])
  const newBucket = useMemo(() => buckets.find((b) => b.id === bucketId), [bucketId, buckets])
  const [isValidNonce, setIsValidNonce] = useState<boolean | undefined>()

  useEffect(() => {
    if(!nonce_id) return

    filesApiClient.isNonceValid(nonce_id)
      .then((res) => {
        setIsValidNonce(res.is_valid)
      })
      .catch(console.error)
  }, [filesApiClient, nonce_id])

  useEffect(() => {
    if(!publicKey || !bucketDecryptionKey) return

    encryptForPublicKey(publicKey, bucketDecryptionKey)
      .then(setEncryptedEncryptionKey)
      .catch(console.error)

  }, [bucketDecryptionKey, encryptForPublicKey, publicKey])

  useEffect(() => {
    if(!jwt || !encryptedEncryptionKey || !!newBucket || !isValidNonce) return

    filesApiClient.verifyNonce({ jwt, encryption_key: encryptedEncryptionKey })
      .catch((e:any) => {
        console.error(e)
        setError(e.error.message)
      })
      .finally(() => {
        refreshBuckets()
      })
  }, [encryptedEncryptionKey, error, filesApiClient, isValidNonce, jwt, newBucket, refreshBuckets])

  const onBrowseBucket = useCallback(() => {
    newBucket && redirect(ROUTE_LINKS.SharedFolderExplorer(newBucket.id, "/"))
  }, [newBucket, redirect])

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <div className={classes.messageWrapper}>
          {!error && !newBucket && isValidNonce !== false && (
            <>
              <Loading
                type="initial"
                size={48}
                className={classes.icon}
              />
              <Typography variant="h4">
                {isValidNonce === undefined
                  ? <Trans>Verifying the link...</Trans>
                  : <Trans>Adding you to the shared folder...</Trans>
                }
              </Typography>
            </>
          )}
          {!error && newBucket && permission && isValidNonce && (
            <>
              <CheckCircleIcon
                size={48}
                className={classes.icon}
              />
              <Typography variant="h4">
                <span data-cy={permission === "read" ? "label-share-confirmation-read-access" : "label-share-confirmation-write-access"}>
                  <Trans>
                  You were added to the shared folder ({translatedPermission(permission)}): {newBucket.name}
                  </Trans>
                </span>
              </Typography>
              <Button
                className={classes.browseButton}
                onClick={onBrowseBucket}
                data-cy="button-browse-share-folder"
              >
                <Trans>Browse {newBucket.name}</Trans>
              </Button>
            </>
          )}
          {(!!error || isValidNonce === false) && (
            <>
              <ExclamationCircleIcon
                size={48}
                className={classes.icon}
                data-cy="icon-link-error"
              />
              <Typography
                variant="h4"
                className={classes.errorMessage}
              >
                { isValidNonce === false
                  ? <span data-cy="label-invalid-link">
                    <Trans>This link is not valid any more.</Trans>
                  </span>
                  : <span data-cy="label-other-error-message">
                    {error}
                  </span>
                }
              </Typography>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkSharingModule
