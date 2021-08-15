import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import {
  Button,
  CheckboxInput,
  SelectInput,
  ShareAltSvg,
  TagsInput,
  TextInput,
  Typography
} from "@chainsafe/common-components"
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

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color,
        [breakpoints.down("md")]: {
          bottom: Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
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
        color: constants.createShareModal.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 10
      },
      iconBacking: {
        backgroundColor: constants.createShareModal.iconBackingColor,
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

const CopyToSharedFolderModal = ({ close, file, filePath }: IShareFileProps) => {
  const classes = useStyles()
  const { handleCreateSharedFolder } = useCreateOrEditSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderReaders, sharedFolderWriters, handleLookupUser, onNewUsers, usersError } = useLookupSharedFolderUser()
  const [isUsingCurrentBucket, setIsUsingCurrentBucket] = useState(true)
  const [keepOriginalFile, setKeepOriginalFile] = useState(false)
  const [destinationBucket, setDestinationBucket] = useState<BucketKeyPermission | undefined>()
  const { buckets, transferFileBetweenBuckets } = useFiles()
  const { bucket } = useFileBrowser()
  const { profile } = useUser()
  const [nameError, setNameError] = useState("")


  const bucketsOptions = useMemo(() => {
    if (!profile) {
      return []
    }

    return buckets
      .filter(buck => buck.type === "share")
      // all buckets where the user is reader or writer
      .filter(buck => !!buck.writers.find((w) => w.uuid === profile.userId) || !!buck.owners.find((o) => o.uuid === profile.userId))
      .map(buck => ({
        label: buck.name,
        value: buck.id
      }))
  }
  , [buckets, profile])

  const hasNoSharedBucket = useMemo(() => bucketsOptions.length === 0, [bucketsOptions.length])

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
    transferFileBetweenBuckets,
  ])


  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={true}
      closePosition="none"
      maxWidth="sm"
    >
      <div className={classes.root}>

        <div className={classes.iconBacking}>
          <ShareAltSvg />
        </div>
        <div className={classes.heading}>
          <Typography className={classes.inputLabel}>
            <Trans>Share file</Trans>
          </Typography>
        </div>

        <div className={classes.modalFlexItem}>
          {isUsingCurrentBucket
              ? (
                <div className={clsx(classes.modalFlexItem, classes.inputWrapper)}>
                  <SelectInput
                    label={t`Select an existing shared folder`}
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
                      }}/>
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
                      }}/>
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
            <div className={classes.checkboxContainer}>
              <CheckboxInput
                value={keepOriginalFile}
                onChange={() => setKeepOriginalFile(!keepOriginalFile)}
                label={t`Keep original file`}
              />
            </div>
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

export default CopyToSharedFolderModal
