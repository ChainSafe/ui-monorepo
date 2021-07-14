import {
  Button,
  ShareAltSvg,
  TagsInput,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import {
  createStyles,
  makeStyles,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import React, { useState, useCallback, useMemo } from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission, useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { LookupUserRequest } from "@chainsafe/files-api-client"
import EthCrypto from "eth-crypto"
import clsx from "clsx"
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
      }
    })
  }
)

interface IUpdateSharedFolderModalProps {
  isModalOpen: boolean
  onClose: () => void
  bucket?: BucketKeyPermission
}

interface SharedUser {
  uuid?: string
  username?: string
  identity_pubkey?: string
  public_address?: string
  encryption_key?: string
}

const UpdateSharedFolderModal = ({
  isModalOpen,
  onClose,
  bucket
}: IUpdateSharedFolderModalProps) => {
  const classes = useStyles()
  const { updateSharedFolder } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { profile } = useUser()
  const [isUpdatingSharedFolder, setIsUpdatingSharedFolder] = useState(false)
  const [sharedFolderName, setSharedFolderName] = useState(bucket?.name || "")
  const [sharedFolderWriters, setSharedFolderWriters] = useState<{label: string; value: string; data: SharedUser}[]>([])
  const [sharedFolderReaders, setSharedFolderReaders] = useState<{label: string; value: string; data: SharedUser}[]>([])

  useEffect(() => {
    setSharedFolderName(bucket?.name || "")
    setSharedFolderWriters(
      bucket?.writers.map((writer) => ({
        label: writer.uuid || "",
        value: writer.uuid || "",
        data: writer
      })
      ) || []
    )
    setSharedFolderReaders(
      bucket?.readers.map((reader) => ({
        label: reader.uuid || "",
        value: reader.uuid || "",
        data: reader
      })
      ) || []
    )
  }, [bucket])

  const { desktop } = useThemeSwitcher()

  console.log(bucket)

  const handleLookupUser = useCallback(async (inputVal: string, permission: "reader" | "writer") => {
    if (inputVal === "") return []
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
    setSharedFolderName("")
    setSharedFolderReaders([])
    setSharedFolderWriters([])
    onClose()
  }, [onClose])

  const handleUpdateSharedFolder = useCallback(async () => {
    if (!bucket) return
    const readers = sharedFolderReaders.map(su => ({
      uuid: su.value,
      pubKey: su.data.identity_pubkey ? EthCrypto.publicKey.decompress(su.data.identity_pubkey.slice(2)) : undefined,
      encryption_key: su.data.encryption_key
    }))
    const writers = sharedFolderWriters.map(su => ({
      uuid: su.value,
      pubKey: su.data.identity_pubkey ? EthCrypto.publicKey.decompress(su.data.identity_pubkey.slice(2)) : undefined,
      encryption_key: su.data.encryption_key
    }))
    setIsUpdatingSharedFolder(true)
    updateSharedFolder(bucket, sharedFolderName, writers, readers)
      .then(handleClose)
      .catch(console.error)
      .finally(() => setIsUpdatingSharedFolder(false))
  }, [sharedFolderWriters, sharedFolderReaders, updateSharedFolder, sharedFolderName, handleClose, bucket])

  const isValid = useMemo(() => {
    return !!(((sharedFolderReaders.length + sharedFolderWriters.length) > 0 && sharedFolderName))
  }, [sharedFolderName, sharedFolderReaders, sharedFolderWriters])

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
            <Trans>Update Shared Folder</Trans>
          </Typography>
        </div>
        <div className={classes.modalFlexItem}>
          <TextInput
            className={classes.shareNameInput}
            labelClassName={classes.inputLabel}
            label={t`Shared Folder Name`}
            value={sharedFolderName}
            onChange={(value) => {setSharedFolderName(value?.toString() || "")}} />
        </div>
        <div className={classes.modalFlexItem}>
          <TagsInput
            onChange={(val) => {
              (val && val.length > 0)
                ? setSharedFolderReaders(val?.map(v => ({ label: v.label, value: v.value, data: v.data })))
                : setSharedFolderReaders([])
            }}
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
            onChange={(val) => {
              (val && val.length > 0)
                ? setSharedFolderWriters(val?.map(v => ({ label: v.label, value: v.value, data: v.data })))
                : setSharedFolderWriters([])
            }}
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
            loading={isUpdatingSharedFolder}
            onClick={handleUpdateSharedFolder}
            disabled={!isValid}
          >
            <Trans>Update</Trans>
          </Button>
        </div>
      </div>
    </CustomModal>
  )
}

export default UpdateSharedFolderModal
