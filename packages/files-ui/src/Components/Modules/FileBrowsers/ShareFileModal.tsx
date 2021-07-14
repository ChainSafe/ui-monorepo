import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import {
  Button,
  CheckCircleIcon,
  Link,
  Loading,
  SelectInput,
  ShareAltSvg,
  TagsInput,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateSharedFolder } from "./hooks/useCreateSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { SharedFolderCreationPermission } from "./types"
import { useMemo } from "react"
import { BucketKeyPermission, FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useUser } from "../../../Contexts/UserContext"
import { useGetFile } from "./hooks/useGetFile"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { ROUTE_LINKS } from "../../FilesRoutes"

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
        flexDirection: "column",
        padding: `0 ${constants.generalUnit * 4}px ${constants.generalUnit * 4}px`
      },
      buttonsContainer: {
        display: "flex",
        justifyContent: "center"
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
        paddingTop: constants.generalUnit * 6,
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
        display: "flex"
      }
    })
  }
)

type Step = "1_SHARED_FOLDER_SELECTION_CREATION" | "2_DOWNLOAD_UPLOAD"
const UPLOAD_PATH = "/"

interface IShareFileProps {
  file: FileSystemItem
  close: () => void
  filePath: string
}

const ShareFileModal = ({ close, file, filePath }: IShareFileProps) => {
  const classes = useStyles()
  const { isCreatingSharedFolder, handleCreateSharedFolder } = useCreateSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderUsers, setSharedFolderUsers, handleLookupUser } = useLookupSharedFolderUser()
  const [permissions, setPermissions] = useState<SharedFolderCreationPermission>(undefined)
  const [ isUsingCurrentBucket, setIsUsingCurrentBucket ] = useState(true)
  const [currentStep, setCurrentStep] = useState<Step>("1_SHARED_FOLDER_SELECTION_CREATION")
  const [destinationBucket, setDestinationBucket] = useState<BucketKeyPermission | undefined>()
  const { buckets, uploadFiles } = useFiles()
  const { bucket } = useFileBrowser()
  const { profile } = useUser()
  const { getFile, error: downloadError, isDownloading } = useGetFile()
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const isBusyWithSecondStep = useMemo(
    () => isCreatingSharedFolder || isDownloading || isUploading
    , [isCreatingSharedFolder, isDownloading, isUploading]
  )

  const bucketsOptions = useMemo(() => {
    if (!profile) {
      return []
    }

    // todo extract in helper for isOwner, isWritr, isReader
    return buckets
      .filter(buck => buck.type === "share")
      .filter(buck => !!buck.writers.find((w) => w.uuid === profile.userId) || !!buck.owners.find((o) => o.uuid === profile.userId))
      .map(buck => ({
        label: buck.name,
        value: buck.id
      }))
  }
  , [buckets, profile])

  const onShare = useCallback(async () => {
    if(!bucket) {
      console.error("Bucket is undefined")
      setError(t`Shared folder is undefined`)
      return
    }

    if(!destinationBucket && isUsingCurrentBucket){
      setError(t`Destination shared folder not selected`)
      return
    }

    if(currentStep === "1_SHARED_FOLDER_SELECTION_CREATION") {
      setCurrentStep("2_DOWNLOAD_UPLOAD")

      let bucketToUpload: BucketKeyPermission | undefined = destinationBucket

      if(!isUsingCurrentBucket){
        try {
          const newBucket = await handleCreateSharedFolder(sharedFolderName, sharedFolderUsers, permissions)

          if(!newBucket){
            setError(t`Error while creating new shared folder`)
            return
          }

          bucketToUpload = newBucket
        } catch (e) {
          console.error(e)
          setError(t`Error while creating new shared folder`)
        }
      }

      if(!bucketToUpload){
        console.error("Bucket id to upload is undefined")
        return
      }

      let fileContent: Blob | undefined

      try {
        fileContent = await getFile({ file, filePath })
      } catch(e) {
        setError(t`Error while downloading ${file.name}`)
        console.error(e)
      }

      if (!fileContent) {
        setError(t`Error while downloading ${file.name}`)
        return
      }

      setIsUploading(true)

      uploadFiles(bucketToUpload.id, [new File([fileContent], file.name)], UPLOAD_PATH, bucketToUpload.encryptionKey)
        .catch((e) => {
          setError(t`Error while uploading ${file.name}`)
          console.error(e)
        })
        .finally(() => {
          setDestinationBucket(bucketToUpload)
          setIsUploading(false)}
        )
    }
  }, [
    bucket,
    currentStep,
    destinationBucket,
    file,
    filePath,
    getFile,
    handleCreateSharedFolder,
    isUsingCurrentBucket,
    permissions,
    sharedFolderName,
    sharedFolderUsers,
    uploadFiles
  ])


  const onBackClick = useCallback(() => {
    if (currentStep === "1_SHARED_FOLDER_SELECTION_CREATION"){
      close()
    } else {
      setCurrentStep("1_SHARED_FOLDER_SELECTION_CREATION")
    }
  }, [close, currentStep])

  const Loader = () => (
    <div className={classes.loadingContainer}>
      <Loading
        size={24}
        type="light"
      />
      <Typography
        variant="body2"
        component="p"
      >
        <Trans>This may take some time depending on the file size</Trans><br/>
        {isDownloading && <Trans>Downloading…</Trans>}
        {isUploading && <Trans>Encrypting and uploading…</Trans>}
      </Typography>
    </div>
  )

  const Step1CreateSharedFolder = () => (
    <>
      <div className={classes.modalFlexItem}>
        <TextInput
          className={classes.shareFolderNameInput}
          labelClassName={classes.inputLabel}
          label={t`Shared Folder Name`}
          value={sharedFolderName}
          onChange={(value) => {setSharedFolderName(value?.toString() || "")}}
          autoFocus
        />
      </div>
      <TagsInput
        onChange={(val) => {
          (val && val.length > 0)
            ? setSharedFolderUsers(val?.map(v => ({ label: v.label, value: v.value, data: v.data })))
            : setSharedFolderUsers([])
        }}
        label={t`Share with`}
        labelClassName={classes.inputLabel}
        value={sharedFolderUsers}
        fetchTags={handleLookupUser}
        placeholder={t`Add by sharing address, username or wallet address`}
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: 90,
            alignContent: "start"
          })
        }}/>
      <div className={classes.modalFlexItem}>
        <SelectInput
          label={t`Allow them to`}
          labelClassName={classes.inputLabel}
          options={[
            { label: t`Add/remove content`, value: "write" },
            { label: t`Read content`, value: "read" }
          ]}
          value={permissions}
          onChange={(val) => setPermissions(val)} />
      </div>
    </>
  )

  const Step1ExistingSharedFolder = () => (
    <div className={classes.modalFlexItem}>
      <Typography
        variant="body1"
        component="p"
      >
        <Trans>Select a shared folder. Only the ones your are owner or writer of are displayed</Trans>
      </Typography>
      <SelectInput
        label={t`Select an existing shared folder`}
        labelClassName={classes.inputLabel}
        options={bucketsOptions}
        value={destinationBucket?.id}
        onChange={(val: string) => setDestinationBucket(buckets.find((bu) => bu.id === val))}
      />
    </div>
  )

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
            <Trans>Share File</Trans>
          </Typography>
        </div>
        {(error || downloadError) && (
          <div className={classes.modalFlexItem}>
            <Typography
              className={classes.error}
              variant="body1"
              component="p"
            >
              {error || downloadError}
            </Typography>
          </div>
        )}
        <div className={classes.modalFlexItem}>
          {currentStep === "1_SHARED_FOLDER_SELECTION_CREATION" && (
            isUsingCurrentBucket
              ? <Step1ExistingSharedFolder />
              : <Step1CreateSharedFolder />
          )}
        </div>
        {currentStep === "1_SHARED_FOLDER_SELECTION_CREATION" && (
          <div className={classes.buttonsArea}>
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
            <div className={classes.buttonsContainer}>
              <Button
                size="large"
                variant="outline"
                onClick={onBackClick}
                className={classes.sideBySideButton}
              >
                {
                  currentStep === "1_SHARED_FOLDER_SELECTION_CREATION"
                    ? <Trans>Cancel</Trans>
                    : <Trans>Back</Trans>
                }
              </Button>
              <Button
                type="submit"
                size="large"
                variant="primary"
                onClick={onShare}
                className={classes.sideBySideButton}
              >
                <Trans>Share</Trans>
              </Button>
            </div>
          </div>
        )}

        {currentStep === "2_DOWNLOAD_UPLOAD" && (
          <>
            {isBusyWithSecondStep && <Loader />}
            {!isBusyWithSecondStep && destinationBucket && (
              <div className={classes.successBox}>
                <div className={classes.successText}>
                  <CheckCircleIcon className={classes.checkIcon} />
                  <Typography
                    variant="h4"
                    component="p"
                  >
                    <Trans>File added successfully!</Trans>
                  </Typography>
                </div>
                <Typography>
                  <Link
                    to={ROUTE_LINKS.SharedFolderExplorer(destinationBucket.id, UPLOAD_PATH)}
                  >
                    <Trans>View shared folder</Trans>
                  </Link>
                </Typography>
              </div>
            )}
            <Button
              disabled={isBusyWithSecondStep}
              size="large"
              variant="outline"
              className={classes.mainButton}
              onClick={close}
            >
              <Trans>Close</Trans>
            </Button>
          </>
        )}
      </div>
    </CustomModal>
  )
}

export default ShareFileModal
