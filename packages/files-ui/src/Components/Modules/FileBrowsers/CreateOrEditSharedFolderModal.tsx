import {
  Button,
  ShareAltSvg,
  TagsInput,
  Typography,
  Grid,
  TextInput
} from "@chainsafe/common-components"
import {
  createStyles,
  makeStyles,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import React, { useState, useCallback } from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useEffect } from "react"
import { SharedFolderModalMode } from "./types"
import { useCreateOrEditSharedFolder } from "./hooks/useCreateOrEditSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { nameValidator } from "../../../Utils/validationSchema"

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
      shareNameInput: {
        display: "block"
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: 600
      },
      shareFolderNameInput: {
        margin: `0 ${constants.generalUnit * 1.5}px ${constants.generalUnit}px`,
        display: "block"
      },
      footer: {
        width: "100%",
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit}px`
      },
      errorText: {
        textAlign: "center",
        color: palette.error.main
      }
    })
  }
)

interface ICreateOrEditSharedFolderModalProps {
  mode?: SharedFolderModalMode
  isModalOpen: boolean
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

const CreateOrEditSharedFolderModal = ({ mode, isModalOpen, onClose, bucketToEdit }: ICreateOrEditSharedFolderModalProps) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { handleCreateSharedFolder, handleEditSharedFolder, isEditingSharedFolder, isCreatingSharedFolder } = useCreateOrEditSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderReaders, sharedFolderWriters, onNewUsers, handleLookupUser, usersError, setUsersError } = useLookupSharedFolderUser()
  const [hasPermissionsChanged, setHasPermissionsChanged] = useState(false)
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    setSharedFolderName("")
    setHasPermissionsChanged(false)
    setUsersError("")

    if (!bucketToEdit) return

    const newWriters = bucketToEdit.writers.map((writer) => ({
      label: writer.uuid || "",
      value: writer.uuid || "",
      data: writer
    })
    ) || []

    const newReaders = bucketToEdit.readers.map((reader) => ({
      label: reader.uuid || "",
      value: reader.uuid || "",
      data: reader
    })
    ) || []

    onNewUsers(newWriters, "write")
    onNewUsers(newReaders, "read")
  }, [bucketToEdit, setUsersError, setHasPermissionsChanged, onNewUsers])

  const onCreateSharedFolder = useCallback(() => {
    handleCreateSharedFolder(sharedFolderName, sharedFolderReaders, sharedFolderWriters)
      .catch(console.error)
      .finally(onClose)
  }, [handleCreateSharedFolder, sharedFolderName, sharedFolderWriters, sharedFolderReaders, onClose])

  const onEditSharedFolder = useCallback(() => {
    if (!bucketToEdit) return
    handleEditSharedFolder(bucketToEdit, sharedFolderReaders, sharedFolderWriters)
      .catch(console.error)
      .finally(onClose)
  }, [handleEditSharedFolder, sharedFolderWriters, sharedFolderReaders, onClose, bucketToEdit])

  const onNameChange = useCallback((value?: string | number) => {
    if (value === undefined) return

    const trimmedValue = value.toString().trim()
    setSharedFolderName(trimmedValue)

    nameValidator
      .validate({ name: trimmedValue })
      .then(() => {
        setNameError("")
      })
      .catch((e: Error) => {
        setNameError(e.message)
      })
  }, [])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={isModalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <div className={classes.root}>
        <div className={classes.iconBacking}>
          <ShareAltSvg />
        </div>
        <div className={classes.heading}>
          <Typography className={classes.inputLabel}>
            {mode === "create"
              ? <Trans>Create Shared Folder</Trans>
              : <Trans>Update Shared Folder</Trans>
            }

          </Typography>
        </div>
        {mode === "create" &&
          <div className={classes.modalFlexItem}>
            <TextInput
              className={classes.shareFolderNameInput}
              labelClassName={classes.inputLabel}
              label={t`Shared Folder Name`}
              value={sharedFolderName}
              onChange={onNameChange}
              autoFocus
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
        }
        <div className={classes.modalFlexItem}>
          <TagsInput
            onChange={(values) => {
              setHasPermissionsChanged(true)
              onNewUsers(values, "read")
            }}
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
            onChange={(values) => {
              setHasPermissionsChanged(true)
              onNewUsers(values, "write")
            }}
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
        <Grid
          item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.footer}
        >
          {!!usersError && (
            <Typography
              component="p"
              variant="body1"
            >
              {usersError}
            </Typography>
          )}
          <Grid
            item
            flexDirection="row"
            justifyContent="flex-end"
          >
            <CustomButton
              onClick={onClose}
              size="medium"
              className={classes.cancelButton}
              variant={desktop ? "outline" : "gray"}
              type="button"
            >
              <Trans>Cancel</Trans>
            </CustomButton>
            <Button
              variant="primary"
              size={desktop ? "medium" : "large"}
              type="submit"
              className={classes.okButton}
              loading={isCreatingSharedFolder || isEditingSharedFolder}
              onClick={mode === "create" ? onCreateSharedFolder : onEditSharedFolder}
              disabled={mode === "create" ? (!!usersError || !!nameError) : !hasPermissionsChanged || !!usersError}
            >
              {mode === "create"
                ? <Trans>Create</Trans>
                : <Trans>Update</Trans>
              }
            </Button>
          </Grid>
        </Grid>
      </div>
    </CustomModal>
  )
}

export default CreateOrEditSharedFolderModal
