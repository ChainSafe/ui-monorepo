import {
  Button,
  Grid,
  SelectInput,
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
import React, { useRef, useEffect, useState, useCallback } from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { LookupUser, LookupUserRequest } from "@chainsafe/files-api-client"
import EthCrypto from "eth-crypto"

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
      shareUsers: {
        width: "100%",
        margin: 5
      }
    })
  }
)

interface ICreateShareModalProps {
  modalOpen: boolean
  close: () => void
}

const CreateShareModal: React.FC<ICreateShareModalProps> = ({
  modalOpen,
  close
}: ICreateShareModalProps) => {
  const classes = useStyles()
  const { createShare } = useFiles()
  const { filesApiClient } = useFilesApi()
  const [creatingShare, setCreatingShare] = useState(false)
  const [shareName, setShareName] = useState("")
  const [shareUsers, setShareUsers] = useState<Array<{label: string; value: LookupUser}>>([])
  const [permissions, setPermissions] = useState<"read" | "write" | undefined>(undefined)
  const { desktop } = useThemeSwitcher()
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [modalOpen])

  const handleLookupUser = useCallback(async (inputVal: string) => {
    if (inputVal === "") return []
    const lookupBody: LookupUserRequest = {}
    const ethAddressRegex = new RegExp("^0x[a-fA-F0-9]{40}$") // Eth Address Starting with 0x and 40 HEX chars
    const pubKeyRegex = new RegExp("^0x[a-fA-F0-9]{66}$") // Compressed public key, 66 chars long

    if (ethAddressRegex.test(inputVal)) {
      lookupBody.public_address = inputVal
    } else if (pubKeyRegex.test(inputVal)) {
      lookupBody.identity_public_key = inputVal
    } else {
      lookupBody.username = inputVal
    }

    const result = await filesApiClient.lookupUser(lookupBody)

    if (!result) return []
    const currentUsers = shareUsers.map(su => su.value.uuid)
    if (currentUsers.includes(result.uuid)) return []

    return [{ label: inputVal, value: result }]
  }, [filesApiClient, shareUsers])

  const handleCreateShare = useCallback(async () => {
    const users = shareUsers.map(su => ({ uuid: su.value.uuid, pubKey: EthCrypto.publicKey.decompress(su.value.identity_pubkey.slice(2)) }))
    const readers = (permissions === "read") ? users : []
    const writers = (permissions === "write") ? users : []
    setCreatingShare(true)
    createShare(shareName, writers, readers).then(() => close)
      .catch((e) => {console.error(e)
        setCreatingShare(false)
      })
  }, [shareUsers, createShare, permissions, shareName, close])

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
          <Typography variant='body1'><Trans>
            Share
            </Trans></Typography>
        </div>
        <div className={classes.shareUsers}>
          <TextInput
            label='Name'
            value={shareName}
            onChange={(value) => {setShareName(value as string)}} />
        </div>
        <div className={classes.shareUsers}>
          <TagsInput onChange={setShareUsers}
            label={t`Invite others`}
            value={shareUsers}
            fetchTag={handleLookupUser}
            placeholder={t`Add by sharing address, username or wallet address`} />
        </div>
        <div className={classes.shareUsers}>
          <SelectInput
            label={t`Allow them to`}
            options={[
              { label: t`Can add/remove content`, value: "write" },
              { label: t`Can read content`, value: "read" }
            ]}
            value={permissions}
            onChange={(val) => setPermissions(val)} />
        </div>
        <Grid
          item
          flexDirection="row"
          justifyContent="flex-end"
        >
          <CustomButton
            onClick={() => close()}
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
            type="submit"
            className={classes.okButton}
            loading={creatingShare}
            onClick={handleCreateShare}
          >
            {desktop ? <Trans>OK</Trans> : <Trans>Create</Trans>}
          </Button>
        </Grid>
      </div>
    </CustomModal>
  )
}

export default CreateShareModal
