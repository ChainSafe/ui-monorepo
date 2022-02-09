import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { Button, CheckboxInput, SelectInput, ShareAltSvg, TextInput, Typography } from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateOrEditSharedFolder } from "./hooks/useCreateOrEditSharedFolder"
import { useMemo } from "react"
import { BucketKeyPermission, FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useUser } from "../../../Contexts/UserContext"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import clsx from "clsx"
import { useEffect } from "react"
import { nameValidator } from "../../../Utils/validationSchema"
import CreateOrManageSharedFolder from "./CreateOrManageSharedFolder"
import { usePosthogContext } from "../../../Contexts/PosthogContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"

const useStyles = makeStyles(
  ({ constants, palette, typography, zIndex }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 3,
        flexDirection: "column",
        display: "flex"
      },
      modalRoot: {
        zIndex: zIndex?.blocker
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color
      },
      topIconContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
        flexDirection: "column",
        alignItems: "center",
        marginTop: constants.generalUnit * 2
      },
      mainButton: {
        width: 240,
        marginBottom: constants.generalUnit * 0.5
      },
      cancelButton: {
        maxWidth: 100
      },
      heading: {
        color: constants.modalDefault.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: constants.generalUnit * 3
      },
      iconBacking: {
        backgroundColor: constants.modalDefault.iconBackingColor,
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 8,
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
        fontSize: 14,
        fontWeight: 600,
        marginBottom: constants.generalUnit
      },
      modalFlexItem: {
        width: "100%",
        marginBottom: constants.generalUnit * 2
      },
      newFolderInput: {
        margin: 0,
        width: "100%"
      },
      buttonLink: {
        color: palette.additional["gray"][10],
        outline: "none",
        textDecoration: "underline",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: constants.generalUnit * 2
      },
      error: {
        color: palette.error.main,
        textAlign: "center"
      },
      inputWrapper: {
        marginBottom: 0
      },
      errorText: {
        marginTop: constants.generalUnit * 1,
        color: palette.error.main
      }
    })
  }
)

interface IShareFileProps {
  fileSystemItems: FileSystemItem[]
  onClose: () => void
}

const ShareModal = ({ onClose, fileSystemItems }: IShareFileProps) => {
  const { handleCreateSharedFolder } = useCreateOrEditSharedFolder()
  const { accountRestricted } = useFilesApi()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const [isUsingExistingBucket, setIsUsingExistingBucket] = useState(true)
  const [keepOriginalFile, setKeepOriginalFile] = useState(true)
  const [bucketToUpload, setBucketToUpload] = useState<BucketKeyPermission | undefined>()
  const [destinationBucket, setDestinationBucket] = useState<BucketKeyPermission | undefined>()
  const [isFolderCreationLoading, setIsFolderCreationLoading] = useState(false)
  const { buckets, transferFileBetweenBuckets } = useFiles()
  const { bucket, currentPath } = useFileBrowser()
  const { profile } = useUser()
  const [nameError, setNameError] = useState("")
  const inSharedBucket = useMemo(() => bucket?.type === "share", [bucket])

  const classes = useStyles()

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
      // do not show any buckets being deleted
      .filter(buck => buck.status !== "deleting")
      // Do not show the current bucket
      .filter(buck => buck.id !== bucket?.id)
      // Show only buckets where the user is owner or writer
      .filter(buck => !!buck.writers.find((w) => w.uuid === profile.userId) || !!buck.owners.find((o) => o.uuid === profile.userId))
      // filter out CSF and share buckets where user is an owner if their account is restricted
      .filter(buck => !(!!accountRestricted && (buck.type === "csf" || !!buck.owners.find(o => o.uuid === profile.userId))))
      .map(buck => ({
        label: buck.name || t`Home`,
        value: buck.id
      }))
  }, [bucket, buckets, profile, accountRestricted])

  const hasNoSharedBucket = useMemo(() => bucketsOptions.length === 0, [bucketsOptions.length])

  useEffect(() => {
    setSharedFolderName("")
    setNameError("")
  }, [])

  // if the user has no shared bucket, we default to new folder creation
  useEffect(() => {
    if (hasNoSharedBucket && !accountRestricted) {
      setIsUsingExistingBucket(false)
    }
  }, [hasNoSharedBucket, accountRestricted])

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
    if (!bucket) {
      console.error("Bucket is undefined")
      return
    }

    if (!destinationBucket && isUsingExistingBucket) {
      return
    }

    let bucketToUpload: BucketKeyPermission | undefined = destinationBucket

    if (!isUsingExistingBucket) {
      setIsFolderCreationLoading(true)
      try {
        const newBucket = await handleCreateSharedFolder(sharedFolderName, [], [])

        if (!newBucket) {
          return
        }
        bucketToUpload = newBucket
      } catch (e) {
        console.error(e)
        return
      }
      setIsFolderCreationLoading(false)
    }

    if (!bucketToUpload) {
      console.error("Bucket id to upload is undefined")
      return
    }

    transferFileBetweenBuckets(bucket, fileSystemItems, currentPath, bucketToUpload, keepOriginalFile)
    setBucketToUpload(bucketToUpload)
    if (isUsingExistingBucket) {
      onClose()
    }
  }, [
    bucket,
    destinationBucket,
    handleCreateSharedFolder,
    isUsingExistingBucket,
    sharedFolderName,
    keepOriginalFile,
    onClose,
    transferFileBetweenBuckets,
    currentPath,
    fileSystemItems
  ])

  const { captureEvent } = usePosthogContext()

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={true}
      closePosition="none"
      maxWidth={500}
    >
      {bucketToUpload
        ? <CreateOrManageSharedFolder
          onClose={onClose}
          mode="edit"
          bucketToEdit={bucketToUpload}
        />
        : <div className={classes.root}>
          <div className={classes.topIconContainer}>
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
          </div>
          <div className={classes.modalFlexItem}>
            {isUsingExistingBucket
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
                <div className={clsx(classes.modalFlexItem, classes.inputWrapper)}>
                  <TextInput
                    label={t`New shared folder name`}
                    placeholder={t`Shared folder name`}
                    className={classes.newFolderInput}
                    labelClassName={classes.inputLabel}
                    size="large"
                    value={sharedFolderName}
                    autoFocus
                    onChange={onNameChange}
                    state={nameError ? "error" : "normal"}
                  />
                  {!!nameError && (
                    <Typography
                      component="p"
                      variant="body1"
                      className={classes.errorText}
                    >
                      {nameError}
                    </Typography>
                  )}
                </div>
              )}
          </div>
          {!hasNoSharedBucket && (
            <div>
              <Trans>or</Trans>{" "}
              <span
                className={classes.buttonLink}
                onClick={() => setIsUsingExistingBucket(!isUsingExistingBucket)}
              >
                <Typography>
                  {
                    isUsingExistingBucket
                      ? <Trans>Create a new shared folder</Trans>
                      : <Trans>Use an existing shared folder</Trans>
                  }
                </Typography>
              </span>
            </div>
          )}
          <div className={classes.buttonsArea}>
            {!isReader && (
              <div className={classes.checkboxContainer}>
                <CheckboxInput
                  value={keepOriginalFile}
                  onChange={() => {
                    captureEvent("copy or move files on share")
                    setKeepOriginalFile(!keepOriginalFile)
                  }}
                  label={t`Keep original files`}
                />
              </div>
            )}
            <div className={classes.buttonsContainer}>
              <Button
                type="submit"
                size="large"
                variant="primary"
                onClick={handleShare}
                className={classes.mainButton}
                loading={!isUsingExistingBucket && isFolderCreationLoading}
                disabled={isUsingExistingBucket
                  ? !destinationBucket?.id
                  : !sharedFolderName || !!nameError
                }
              >
                {isUsingExistingBucket ? keepOriginalFile
                  ? <Trans>Copy over</Trans>
                  : <Trans>Move over</Trans>
                  : keepOriginalFile
                    ? <Trans>Create folder &amp; Copy over</Trans>
                    : <Trans>Create folder &amp; Move over</Trans>
                }
              </Button>
              <Button
                size="large"
                variant="text"
                onClick={onClose}
                className={classes.cancelButton}
              >
                <Trans>Close</Trans>
              </Button>
            </div>
          </div>
        </div>
      }

    </CustomModal>
  )
}

export default ShareModal
