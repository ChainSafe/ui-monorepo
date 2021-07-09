import { Button, SelectInput, ShareAltSvg, TagsInput, TextInput, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useState, useCallback, useMemo } from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { useCreateSharedFolder } from "./hooks/useCreateSharedFolder"
import { SharedFolderCreationPermission } from "./types"

const useStyles = makeStyles(
  ({ breakpoints, constants, typography, zIndex, palette }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column",
        display: "flex",
        alignItems: "center"
      },
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.createShareModal.backgroundColor,
        color: constants.createShareModal.color,
        [breakpoints.down("md")]: {
          bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight
        }
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
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
      modalFlexItem: {
        width: "100%",
        margin: 5
      },
      buttons: {
        justifyContent: "flex-end",
        display: "flex",
        paddingRight: 5,
        marginTop: 10
      },
      shareFolderNameInput: {
        display: "block"
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: 600
      }
    })
  }
)

interface ICreateSharedFolderModalProps {
  modalOpen: boolean
  close: () => void
}

const CreateSharedFolderModal = ({ modalOpen, close }: ICreateSharedFolderModalProps) => {
  const classes = useStyles()
  const { handleCreateSharedFolder, isCreatingSharedFolder } = useCreateSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderUsers, setSharedFolderUsers, handleLookupUser } = useLookupSharedFolderUser()
  const [permissions, setPermissions] = useState<SharedFolderCreationPermission>(undefined)
  const { desktop } = useThemeSwitcher()

  const handleClose = useCallback(() => {
    setSharedFolderName("")
    setSharedFolderUsers([])
    setPermissions(undefined)
    close()
  }, [close, setSharedFolderUsers])

  const onCreate = useCallback(() =>
    handleCreateSharedFolder(sharedFolderName, sharedFolderUsers, permissions)
      .then(handleClose)
      .catch(console.error)
  , [handleClose, handleCreateSharedFolder, permissions, sharedFolderName, sharedFolderUsers])

  const isValid = useMemo(() => {
    return !!((sharedFolderUsers.length > 0 && sharedFolderName !== "" && permissions))
  }, [permissions, sharedFolderName, sharedFolderUsers])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <div className={classes.root}>
        <div className={classes.iconBacking}>
          <ShareAltSvg />
        </div>
        <div className={classes.heading}>
          <Typography className={classes.inputLabel}>
            <Trans>Create Shared Folder</Trans>
          </Typography>
        </div>
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
        <div className={classes.modalFlexItem}>
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
        </div>
        <div className={classes.modalFlexItem}>
          <SelectInput
            label={t`Allow them to`}
            labelClassName={classes.inputLabel}
            options={[
              { label: t`Add/remove content`, value: "write" },
              { label: t`Read content`, value: "read" }
            ]}
            value={permissions}
            onChange={(val) => setPermissions(val)}
          />
        </div>
        <div className={clsx(classes.modalFlexItem, classes.buttons)}>
          <CustomButton
            onClick={handleClose}
            size="medium"
            className={classes.cancelButton}
            variant={desktop ? "outline" : "gray"}
            type="button"
          >
            <Trans>Cancel</Trans>
          </CustomButton>
          <Button
            size={desktop ? "medium" : "large"}
            variant="primary"
            className={classes.okButton}
            loading={isCreatingSharedFolder}
            onClick={onCreate}
            disabled={!isValid}
          >
            <Trans>Create</Trans>
          </Button>
        </div>
      </div>
    </CustomModal>
  )
}

export default CreateSharedFolderModal
