import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { Button, Loading, SelectInput, ShareAltSvg, TagsInput, TextInput, Typography } from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateSharedFolder } from "./hooks/useCreateSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { SharedFolderCreationPermission } from "./types"

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
        margin: 5
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
      }
    })
  }
)

interface IShareFileProps {
  close: () => void
}

type Step = "1_USERS" | "2_SHARED_FOLDER"

const ShareFileModal = ({ close }: IShareFileProps) => {
  const classes = useStyles()
  const { handleCreateSharedFolder, isCreatingSharedFolder } = useCreateSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderUsers, setSharedFolderUsers, handleLookupUser } = useLookupSharedFolderUser()
  const [permissions, setPermissions] = useState<SharedFolderCreationPermission>(undefined)
  const [ currentStep, setCurrentStep ] = useState<Step>("1_USERS")
  const [createNewSharedFolder, setCreateNewSharedFolder] = useState(false)
  const [bucketIdSelected, setBucketIdSelected] = useState("")

  const onNextStep = useCallback(() => {
    if(currentStep === "1_USERS") {
      setCurrentStep("2_SHARED_FOLDER")
    } else {
      handleCreateSharedFolder(sharedFolderName, sharedFolderUsers, permissions)
    }
  }, [handleCreateSharedFolder, permissions, sharedFolderName, sharedFolderUsers, currentStep])


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

  const Step1 = () => <>
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

  const Step2 = () => {
    if (createNewSharedFolder) {
      return (
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
      )
    }

    return (
      <div className={classes.modalFlexItem}>
        <Typography
          variant="body2"
          component="p"
        >
          <Trans>Select a shared folder. Only the ones with the currently selected users will be displayed</Trans>
        </Typography>
        <SelectInput
          label={t`Add to share folder`}
          labelClassName={classes.inputLabel}
          options={[
            { label: "some name", value: "some-bucket-id" }
          ]}
          value={bucketIdSelected}
          onChange={(val: string) => setBucketIdSelected(val)}
        />
      </div>
    )
  }

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
          {currentStep === "1_USERS" && <Step1 />}
          {currentStep === "2_SHARED_FOLDER" && <Step2 />}
        </div>
        <div className={classes.buttonsContainer}>
          <div className={classes.mainButtonContainer}>
            <Button
              type="submit"
              size="large"
              variant="primary"
              className={classes.mainButton}
              onClick={onNextStep}
            >
              {
                currentStep === "1_USERS"
                  ? <Trans>Next</Trans>
                  : <Trans>Share</Trans>
              }
            </Button>
            <Button
              size="large"
              variant="secondary"
              className={classes.mainButton}
              onClick={close}
            >
              <Trans>Cancel</Trans>
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ShareFileModal
