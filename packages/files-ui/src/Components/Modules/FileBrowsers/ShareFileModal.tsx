import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useRef, useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { Button, Loading, SelectInput, ShareAltSvg, TagsInput, TextInput, Typography } from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateSharedFolder } from "./hooks/useCreateSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { SharedFolderCreationPermission } from "./types"
import { useMemo } from "react"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useUser } from "../../../Contexts/UserContext"
import axios, { CancelTokenSource } from "axios"

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
      buttonsContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: `0 ${constants.generalUnit * 4}px ${constants.generalUnit * 4}px`
      },
      mainButton: {
        width: "100%"
      },
      mainButtonContainer: {
        position: "relative",
        flexBasis: "75%",
        color: palette.additional["gray"][9],
        [breakpoints.down("md")]: {
          flexBasis: "100%",
          margin: `${constants.generalUnit * 2}px`
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
      }
    })
  }
)

type Step = "1_SHARED_FOLDER_SELECTION_CREATION" | "2_DOWNLOAD_UPLOAD"

interface IShareFileProps {
  file: FileSystemItem
  close: () => void
  filePath: string
}

const ShareFileModal = ({ close, file, filePath }: IShareFileProps) => {
  const classes = useStyles()
  const { handleCreateSharedFolder, isCreatingSharedFolder } = useCreateSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderUsers, setSharedFolderUsers, handleLookupUser } = useLookupSharedFolderUser()
  const [permissions, setPermissions] = useState<SharedFolderCreationPermission>(undefined)
  const [ isUsingCurrentBucket, setIsUsingCurrentBucket ] = useState(true)
  const [currentStep, setCurrentStep] = useState<Step>("1_SHARED_FOLDER_SELECTION_CREATION")
  const [bucketIdSelected, setBucketIdSelected] = useState("")
  const { buckets, getFileContent } = useFiles()
  const { profile } = useUser()
  const source = useRef<CancelTokenSource | null>(null)
  const [error, setError] = useState("")
  const { cid, content_type, name, size } = file || {}
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [fileContent, setFileContent] = useState<Blob | undefined>()

  console.log("downloadProgress", downloadProgress)
  console.log("error", error)
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

  // const getSource = () => {
  //   if (source.current === null) {
  //     source.current = axios.CancelToken.source()
  //   }
  //   return source.current
  // }

  const getFile = useCallback(async () => {
    if (!cid || !size || !bucketIdSelected) return

    // if (source.current) {
    //   source.current.cancel("Cancelling previous request")
    //   source.current = null
    // }

    // const token = getSource().token
    // setIsLoading(true)
    setError("")

    try {
      const content = await getFileContent(bucketIdSelected, {
        cid,
        cancelToken: undefined,
        onDownloadProgress: (evt) => {
          setDownloadProgress((evt.loaded / size) * 100)
        },
        file,
        path: filePath
      })

      if (content) {
        setFileContent(content)
      } else {
        setError(t`Decryption failed`)
      }

      // source.current = null
      setDownloadProgress(0)

    } catch (error) {
      // If no error is thrown, this was due to a cancellation by the user.
      if (error) {
        console.error(error)
        setError(t`There was an error getting the preview.`)
      }
    }

    // setIsLoading(false)

  }, [bucketIdSelected, cid, file, filePath, getFileContent, size])

  const onNextStep = useCallback(() => {
    if(currentStep === "1_SHARED_FOLDER_SELECTION_CREATION") {
      setCurrentStep("2_DOWNLOAD_UPLOAD")

      getFile()
        .then(() => console.log("done"))
        .catch(console.error)
      if (isUsingCurrentBucket){
        //sharing to an existing bucket.
      } else {

        // handleCreateSharedFolder(sharedFolderName, sharedFolderUsers, permissions)
      }
    }
  }, [currentStep, getFile, isUsingCurrentBucket])

  const onBackClick = useCallback(() => {
    if (currentStep === "1_SHARED_FOLDER_SELECTION_CREATION"){
      close()
      //todo reset anything
    } else {
      setCurrentStep("1_SHARED_FOLDER_SELECTION_CREATION")
      //todo reset selectedBucket or anything
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
        <Trans>Sharing your file, this may take some time depending on the file size…</Trans>
      </Typography>
    </div>
  )

  const Step1NewFolder = () => (
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

  const Step1ExistingFolder = () => (
    <div className={classes.modalFlexItem}>
      <Typography
        variant="body1"
        component="p"
      >
        <Trans>Select a shared folder. Only the ones your are owner or writer are displayed</Trans>
      </Typography>
      <SelectInput
        label={t`Add to share folder`}
        labelClassName={classes.inputLabel}
        options={bucketsOptions}
        value={bucketIdSelected}
        onChange={(val: string) => setBucketIdSelected(val)}
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
        <div className={classes.modalFlexItem}>
          {isCreatingSharedFolder && <Loader />}
          {currentStep === "1_SHARED_FOLDER_SELECTION_CREATION" && (
            isUsingCurrentBucket
              ? <Step1ExistingFolder />
              : <Step1NewFolder />
          )}
          {/* {currentStep === "2_DOWNLOAD_UPLOAD" && <Step2 />} */}
        </div>
        <div className={classes.buttonsContainer}>
          {/* <div className={classes.mainButtonContainer}> */}
          {currentStep === "1_SHARED_FOLDER_SELECTION_CREATION" && (
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
          <Button
            type="submit"
            size="large"
            variant="primary"
            className={classes.mainButton}
            onClick={onNextStep}
          >
            {
              currentStep === "1_SHARED_FOLDER_SELECTION_CREATION"
                ? <Trans>Next</Trans>
                : <Trans>Share</Trans>
            }
          </Button>
          <Button
            size="large"
            variant="secondary"
            className={classes.mainButton}
            onClick={onBackClick}
          >{
              currentStep === "1_SHARED_FOLDER_SELECTION_CREATION"
                ? <Trans>Cancel</Trans>
                : <Trans>Back</Trans>
            }
          </Button>
        </div>
        {/* </div> */}
      </div>
    </CustomModal>
  )
}

export default ShareFileModal
