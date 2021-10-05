import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { Button, CheckboxInput, SelectInput, ShareAltSvg, TagsInput, TextInput, Typography } from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateOrEditSharedFolder } from "./hooks/useCreateOrEditSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { useMemo } from "react"
import { BucketKeyPermission, FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useUser } from "../../../Contexts/UserContext"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import clsx from "clsx"
import { useEffect } from "react"
import { nameValidator } from "../../../Utils/validationSchema"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { KJUR } from "jsrsasign"
import keyEncoder from "key-encoder"
import { NonceResponse } from "@chainsafe/files-api-client"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color
      },
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column",
        display: "flex",
        alignItems: "center"
      },
      closeButton: {
        flex: 1,
        marginLeft: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
          margin: 0
        }
      },
      title: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      },
      infoHeading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left"
      },
      infoContainer: {
        borderTop: constants.fileInfoModal.infoContainerBorderTop,
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`
      },
      infoBox: {
        paddingLeft: constants.generalUnit
      },
      subInfoBox: {
        padding: `${constants.generalUnit * 1}px 0`
      },
      subSubtitle: {
        color: palette.additional["gray"][8]
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 4
        }px`,
        borderBottom: `1px solid ${palette.additional["gray"][3]}`
      },
      buttonsArea: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
      },
      checkboxContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: constants.generalUnit * 4
      },
      buttonsContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: constants.generalUnit * 2
      },
      mainButton: {
        width: "100%"
      },
      sideBySideButton: {
        minWidth: constants.generalUnit * 12,
        "&:first-child": {
          marginRight: constants.generalUnit * 2
        }
      },
      heading: {
        color: constants.modalDefault.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 10
      },
      iconBacking: {
        backgroundColor: constants.modalDefault.iconBackingColor,
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 16,
        "& > svg": {
          width: 16,
          height: 16,
          fill: palette.primary.main,
          position: "relative",
          display: "block",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%"
        }
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: 600
      },
      modalFlexItem: {
        width: "100%",
        margin: 5,
        marginBottom: constants.generalUnit * 2
      },
      loadingContainer: {
        width: "100%",
        paddingBottom: constants.generalUnit * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& svg": {
          marginBottom: constants.generalUnit * 2
        }
      },
      shareFolderNameInput: {
        display: "block"
      },
      buttonLink: {
        color: palette.additional["gray"][10],
        outline: "none",
        textDecoration: "underline",
        cursor: "pointer",
        textAlign: "center",
        marginBottom: constants.generalUnit * 2
      },
      error: {
        color: palette.error.main,
        textAlign: "center"
      },
      checkIcon: {
        marginRight: constants.generalUnit * 2
      },
      successBox: {
        textAlign: "center",
        marginBottom: constants.generalUnit * 4
      },
      successText: {
        display: "flex",
        marginBottom: constants.generalUnit * 2
      },
      inputWrapper: {
        marginBottom: 0
      },
      errorText: {
        marginLeft: constants.generalUnit * 2,
        color: palette.error.main
      },
      titleWrapper: {
        padding: "0 5px"
      }
    })
  }
)

interface IShareFileProps {
  file: FileSystemItem
  close: () => void
  filePath: string
}

const ShareModal = ({ close, file, filePath }: IShareFileProps) => {
  const classes = useStyles()
  const { handleCreateSharedFolder } = useCreateOrEditSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderReaders, sharedFolderWriters, handleLookupUser, onNewUsers, usersError, resetUsers } = useLookupSharedFolderUser()
  const [isUsingCurrentBucket, setIsUsingCurrentBucket] = useState(true)
  const [keepOriginalFile, setKeepOriginalFile] = useState(true)
  const [destinationBucket, setDestinationBucket] = useState<BucketKeyPermission | undefined>()
  const { buckets, transferFileBetweenBuckets } = useFiles()
  const { bucket } = useFileBrowser()
  const { profile } = useUser()
  const [nameError, setNameError] = useState("")
  const inSharedBucket = useMemo(() => bucket?.type === "share", [bucket])
  const { filesApiClient } = useFilesApi()
  const { privateKey } = useThresholdKey()
  const [nonces, setNonces] = useState<NonceResponse[]>([])

  const isReader = useMemo(() => {
    if (!bucket) return false

    return !!(bucket.readers.find(reader => reader.uuid === profile?.userId))
  }, [bucket, profile])

  const bucketsOptions = useMemo(() => {
    if (!profile) {
      return []
    }

    return buckets
      .filter(buck => buck.type === "share" || buck.type === "csf")
      // filter out the current bucket
      .filter(buck => buck.id !== bucket?.id)
      // all buckets where the user is reader or writer
      .filter(buck => !!buck.writers.find((w) => w.uuid === profile.userId) || !!buck.owners.find((o) => o.uuid === profile.userId))
      .map(buck => ({
        label: buck.name || t`Home`,
        value: buck.id
      }))
  }
  , [bucket, buckets, profile])

  const hasNoSharedBucket = useMemo(() => bucketsOptions.length === 0, [bucketsOptions.length])

  useEffect(() => {
    resetUsers()
    setSharedFolderName("")
    setNameError("")
  }, [resetUsers])

  // if the user has no shared bucket, we default to new folder creation
  useEffect(() => {
    if (hasNoSharedBucket) {
      setIsUsingCurrentBucket(false)
    }
  }, [hasNoSharedBucket])

  const onNameChange = useCallback((value?: string | number) => {
    if (value === undefined) return

    const name = value.toString()
    setSharedFolderName(name)

    nameValidator
      .validate({ name })
      .then(() => {
        setNameError("")
      })
      .catch((e: Error) => {
        setNameError(e.message)
      })
  }, [])

  const handleShare = useCallback(async () => {
    if(!bucket) {
      console.error("Bucket is undefined")
      return
    }

    if(!destinationBucket && isUsingCurrentBucket){
      return
    }

    let bucketToUpload: BucketKeyPermission | undefined = destinationBucket

    if (!isUsingCurrentBucket) {
      try {
        const newBucket = await handleCreateSharedFolder(sharedFolderName, sharedFolderReaders, sharedFolderWriters)

        if(!newBucket){
          return
        }
        bucketToUpload = newBucket
      } catch (e) {
        console.error(e)
        return
      }
    }

    if(!bucketToUpload){
      console.error("Bucket id to upload is undefined")
      return
    }

    transferFileBetweenBuckets(bucket.id, file, filePath, bucketToUpload, keepOriginalFile)
    close()
  }, [
    bucket,
    destinationBucket,
    file,
    filePath,
    handleCreateSharedFolder,
    isUsingCurrentBucket,
    sharedFolderName,
    sharedFolderReaders,
    sharedFolderWriters,
    keepOriginalFile,
    close,
    transferFileBetweenBuckets
  ])

  useEffect(() => {
    filesApiClient.getAllNonces().then(setNonces).catch(console.error)
  }, [filesApiClient])

  const onCreateNonce = useCallback(() => {
    if(!bucket || bucket.type === "csf") {
      console.log("no current bucket, or it's your home, which you can't share...")
      return
    }

    filesApiClient
      .createNonce({ bucket_id: bucket.id, permission: "read" })
      // dirty hack
      .then((n) => setNonces([n]))
      .catch(console.error)
  }, [bucket, filesApiClient])

  const onCreateJWT = useCallback(async () => {
    if(!privateKey) {
      console.log("no private key found")
      return
    }

    if(!nonces.length) {
      console.log("no nonce created")
      return
    }

    if(!bucket || bucket.type === "csf") {
      console.log("no current bucket, or it's your home, which you can't share...")
      return
    }

    const ke = new keyEncoder("secp256k1")
    const pem = ke.encodePrivate(privateKey, "raw", "pem")

    // Header
    const header = { alg: "ES256", typ: "JWT" }
    // Payload
    const payload = {
      type: "link_sharing",
      permission: nonces[0].permission,
      // oPayload.nbf = tNow,
      iat:  KJUR.jws.IntDate.get("now"),
      // oPayload.exp = tEnd,
      bucket_id: bucket.id,
      nonce_id: nonces[0].id
    }
    // const tNow = KJUR.jws.IntDate.get("now")
    // const tEnd = KJUR.jws.IntDate.get("now + 1day")
    // oPayload.type = "link_sharing"
    // oPayload.permission = nonces[0].permission
    // // oPayload.nbf = tNow
    // // oPayload.iat = tNow
    // // oPayload.exp = tEnd
    // oPayload.bucket_id = bucket.id
    // oPayload.nonce_id = nonces[0].id
    const sHeader = JSON.stringify(header)
    const sPayload = JSON.stringify(payload)

    const sJWT = KJUR.jws.JWS.sign("ES256", sHeader, sPayload, pem)
    console.log("sJWT", sJWT)
  }, [bucket, nonces, privateKey])

  const onVerifyJWT = useCallback(() => {
    if(!bucket || bucket.type === "csf") {
      console.log("no current bucket, or it's your home, which you can't share...")
      return
    }

    filesApiClient
      .verifyNonce({
        // eslint-disable-next-line max-len
        jwt: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibGlua19zaGFyaW5nIiwicGVybWlzc2lvbiI6InJlYWQiLCJpYXQiOjE2MzMzNjM1MjksImJ1Y2tldF9pZCI6ImU1YTk3ODJkLTI1ZTUtNDM4NS05NTcwLTlkYTJlZTZkNDY2MiIsIm5vbmNlX2lkIjoiNTkxYTZmNzEtZjQ5Yi00Mzg2LThlMTYtOTRiY2JiMDAyYWNmIn0.SC_0SzGEihJYJZKZT3AqrOiWEn5NXAJaI3446CgaNC-ZSAB3p3OpJIWe56_TjclKD9db-wvWBFkh1coVtI26xw",
        encryption_key: "someEncryptedEncryptionKey"
      })
      // dirty hack
      .then(console.log)
      .catch(console.error)
  }, [bucket, filesApiClient])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={true}
      closePosition="none"
      maxWidth="sm"
      mobileStickyBottom={false}
    >
      <div className={classes.root}>
        <div className={classes.iconBacking}>
          <ShareAltSvg />
        </div>
        <div className={classes.heading}>
          <Typography className={classes.inputLabel}>
            {inSharedBucket
              ? t`Copy file`
              : t`Share file`
            }
          </Typography>
        </div>

        <div className={classes.modalFlexItem}>
          <button onClick={onCreateNonce}>Create nonce</button>
          <button onClick={onCreateJWT}>Create JWT</button>
          <button onClick={onVerifyJWT}>verify hardcoded JWT</button>
          {isUsingCurrentBucket
            ? (
              <div className={clsx(classes.modalFlexItem, classes.inputWrapper)}>
                <SelectInput
                  label={t`Select an existing shared folder or your home`}
                  labelClassName={classes.inputLabel}
                  options={bucketsOptions}
                  value={destinationBucket?.id}
                  onChange={(val: string) => setDestinationBucket(buckets.find((bu) => bu.id === val))}
                />
              </div>
            )
            : (
              <>
                <div className={clsx(classes.modalFlexItem, classes.titleWrapper)}>
                  <TextInput
                    className={classes.shareFolderNameInput}
                    labelClassName={classes.inputLabel}
                    label={t`Shared Folder Name`}
                    value={sharedFolderName}
                    autoFocus
                    onChange={onNameChange}
                    state={nameError ? "error" : "normal"}
                  />
                  {nameError && (
                    <Typography
                      component="p"
                      variant="body1"
                      className={classes.errorText}
                    >
                      {nameError}
                    </Typography>
                  )}
                </div>
                <div className={classes.modalFlexItem}>
                  <TagsInput
                    onChange={(values) => onNewUsers(values, "read")}
                    label={t`Give view-only permission to:`}
                    labelClassName={classes.inputLabel}
                    value={sharedFolderReaders}
                    fetchTags={(inputVal) => handleLookupUser(inputVal, "read")}
                    placeholder={t`Add by sharing address, username or wallet address`}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: 90,
                        alignContent: "start"
                      })
                    }}
                    loadingMessage={t`Loading`}
                    noOptionsMessage={t`No user found for this query.`}
                  />
                </div>
                <div className={classes.modalFlexItem}>
                  <TagsInput
                    onChange={(values) => onNewUsers(values, "write")}
                    label={t`Give edit permission to:`}
                    labelClassName={classes.inputLabel}
                    value={sharedFolderWriters}
                    fetchTags={(inputVal) => handleLookupUser(inputVal, "write")}
                    placeholder={t`Add by sharing address, username or wallet address`}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: 90,
                        alignContent: "start"
                      })
                    }}
                    loadingMessage={t`Loading...`}
                    noOptionsMessage={t`No user found for this query.`}
                  />
                </div>
                {!!usersError && (
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.errorText}
                  >
                    {usersError}
                  </Typography>
                )}
              </>
            )}
        </div>
        <div className={classes.buttonsArea}>
          {!hasNoSharedBucket && (
            <div
              className={classes.buttonLink}
              onClick={() => setIsUsingCurrentBucket(!isUsingCurrentBucket)}
            >
              <Typography>
                {
                  isUsingCurrentBucket
                    ? <Trans>Create a new shared folder</Trans>
                    : <Trans>Use an existing shared folder</Trans>
                }
              </Typography>
            </div>
          )}
          {!isReader && (
            <div className={classes.checkboxContainer}>
              <CheckboxInput
                value={keepOriginalFile}
                onChange={() => setKeepOriginalFile(!keepOriginalFile)}
                label={t`Keep original file`}
              />
            </div>
          )}
          <div className={classes.buttonsContainer}>
            <Button
              size="large"
              variant="outline"
              onClick={close}
              className={classes.sideBySideButton}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="submit"
              size="large"
              variant="primary"
              onClick={handleShare}
              className={classes.sideBySideButton}
              disabled={isUsingCurrentBucket
                ? !destinationBucket?.id
                : !sharedFolderName || !!usersError || !!nameError
              }
            >
              {keepOriginalFile
                ? <Trans>Copy over</Trans>
                : <Trans>Move over</Trans>
              }
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ShareModal

