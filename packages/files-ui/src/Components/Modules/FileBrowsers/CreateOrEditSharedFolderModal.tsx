import {
  Button,
  ShareAltSvg,
  TagsInput,
  ITagOption,
  ITagValueType,
  ITagActionMeta,
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
import { BucketKeyPermission, useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { LookupUserRequest } from "@chainsafe/files-api-client"
import { useUser } from "../../../Contexts/UserContext"
import { useEffect } from "react"

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
      }
    })
  }
)

interface ICreateOrEditSharedFolderModalProps {
  mode?: "create" | "edit"
  isModalOpen: boolean
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

interface SharedUser {
  uuid?: string
  username?: string
  identity_pubkey?: string
  public_address?: string
  encryption_key?: string
}

interface UserPermission {
  label: string
  value: string
  data: SharedUser
}

const CreateOrEditSharedFolderModal = ({
  mode,
  isModalOpen,
  onClose,
  bucketToEdit
}: ICreateOrEditSharedFolderModalProps) => {
  const classes = useStyles()
  const { editSharedFolder, createSharedFolder } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { profile } = useUser()
  const [isLoadingSharedFolder, setIsLoadingSharedFolder] = useState(false)
  const [hasPermissionsChanged, setHasPermissionsChanged] = useState(false)
  const [error, setError] = useState("")
  const [sharedFolderName, setSharedFolderName] = useState("")
  const [sharedFolderWriters, setSharedFolderWriters] = useState<UserPermission[]>([])
  const [sharedFolderReaders, setSharedFolderReaders] = useState<UserPermission[]>([])

  useEffect(() => {
    if (!bucketToEdit) return
    setSharedFolderWriters(
      bucketToEdit.writers.map((writer) => ({
        label: writer.uuid || "",
        value: writer.uuid || "",
        data: writer
      })
      ) || []
    )
    setSharedFolderReaders(
      bucketToEdit.readers.map((reader) => ({
        label: reader.uuid || "",
        value: reader.uuid || "",
        data: reader
      })
      ) || []
    )
    setError("")
    setHasPermissionsChanged(false)
  }, [bucketToEdit])

  const { desktop } = useThemeSwitcher()

  const handleLookupUser = useCallback(async (inputVal: string, permission: "reader" | "writer") => {
    if (inputVal === "") return []
    setError("")
    const lookupBody: LookupUserRequest = {}
    const ethAddressRegex = new RegExp("^0(x|X)[a-fA-F0-9]{40}$") // Eth Address Starting with 0x and 40 HEX chars
    const pubKeyRegex = new RegExp("^0(x|X)[a-fA-F0-9]{66}$") // Compressed public key, 66 chars long

    if (ethAddressRegex.test(inputVal)) {
      lookupBody.public_address = inputVal
    } else if (pubKeyRegex.test(inputVal)) {
      lookupBody.identity_public_key = inputVal
    } else {
      lookupBody.username = inputVal
    }

    const result = await filesApiClient.lookupUser(lookupBody)

    if (!result) return []
    const usersList = permission === "reader" ? sharedFolderReaders : sharedFolderWriters
    const currentUsers = Array.isArray(usersList) ? usersList.map(su => su.value) : []
    if (currentUsers.includes(result.uuid) || result.uuid === profile?.userId) return []
    return [{ label: inputVal, value: result.uuid, data: result }]

  }, [filesApiClient, sharedFolderReaders, sharedFolderWriters, profile])

  const handleClose = useCallback(() => {
    setSharedFolderReaders([])
    setSharedFolderWriters([])
    onClose()
  }, [onClose])

  const getUserPermission = (userPermissions: UserPermission[]) => userPermissions.map(su => ({
    uuid: su.value,
    pubKey: su.data.identity_pubkey?.slice(2) || "",
    encryption_key: su.data.encryption_key
  }))

  const handleCreateSharedFolder = useCallback(() => {
    const readers = getUserPermission(sharedFolderReaders)
    const writers = getUserPermission(sharedFolderWriters)

    setIsLoadingSharedFolder(true)
    createSharedFolder(sharedFolderName, writers, readers)
      .then(handleClose)
      .catch(console.error)
      .finally(() => setIsLoadingSharedFolder(false))
  }, [sharedFolderName, sharedFolderWriters, sharedFolderReaders, createSharedFolder, handleClose])

  const handleUpdateSharedFolder = useCallback(() => {
    if (!bucketToEdit) return

    const readers = getUserPermission(sharedFolderReaders)
    const writers = getUserPermission(sharedFolderWriters)

    setIsLoadingSharedFolder(true)
    editSharedFolder(bucketToEdit, writers, readers)
      .then(handleClose)
      .catch(console.error)
      .finally(() => setIsLoadingSharedFolder(false))
  }, [sharedFolderWriters, sharedFolderReaders, editSharedFolder, handleClose, bucketToEdit])

  const onNewReaders = (val: ITagValueType<ITagOption, true>, action: ITagActionMeta<ITagOption>) => {
    if (action.action === "select-option") {
      // new reader inserted
      const foundWriter = sharedFolderWriters.find((writer) => writer.data.uuid === action.option?.data.uuid)
      if (foundWriter) {
        setError(t`User already included in writers`)
        return
      }
    }
    setHasPermissionsChanged(true)
    val && val.length > 0
      ? setSharedFolderReaders(val?.map(v => ({ label: v.label, value: v.value, data: v.data })))
      : setSharedFolderReaders([])
  }

  const onNewWriters = (val: ITagValueType<ITagOption, true>, action: ITagActionMeta<ITagOption>) => {
    if (action.action === "select-option") {
      // new reader inserted
      const foundReader = sharedFolderReaders.find((reader) => reader.data.uuid === action.option?.data.uuid)
      if (foundReader) {
        setError(t`User already included in readers`)
        return
      }
    }
    setHasPermissionsChanged(true)
    val && val.length > 0
      ? setSharedFolderWriters(val?.map(v => ({ label: v.label, value: v.value, data: v.data })))
      : setSharedFolderWriters([])
  }

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
              onChange={(value) => {setSharedFolderName(value?.toString() || "")}}
              autoFocus
            />
          </div>
        }
        <div className={classes.modalFlexItem}>
          <TagsInput
            onChange={onNewReaders}
            label={t`Give view-only permission to:`}
            labelClassName={classes.inputLabel}
            value={sharedFolderReaders}
            fetchTags={(inputVal) => handleLookupUser(inputVal, "reader")}
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
            onChange={onNewWriters}
            label={t`Give edit permission to:`}
            labelClassName={classes.inputLabel}
            value={sharedFolderWriters}
            fetchTags={(inputVal) => handleLookupUser(inputVal, "writer")}
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
          {!!error && (
            <Typography
              component="p"
              variant="body1"
            >
              {error}
            </Typography>
          )}
          <Grid
            item
            flexDirection="row"
            justifyContent="flex-end"
          >
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
              variant="primary"
              size={desktop ? "medium" : "large"}
              type="submit"
              className={classes.okButton}
              loading={isLoadingSharedFolder}
              onClick={mode === "create" ? handleCreateSharedFolder : handleUpdateSharedFolder}
              disabled={!hasPermissionsChanged}
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
