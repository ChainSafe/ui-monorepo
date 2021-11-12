import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import { SharedFolderModalMode } from "./types"
import LinkList from "./LinkSharing/LinkList"
import CreateOrManageSharedFolder from "./CreateOrManageSharedFolder"

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
        [breakpoints.down("md")]: {
          paddingBottom: Number(constants?.mobileButtonHeight) + constants.generalUnit
        }
      },
      modalInner: {
        backgroundColor: constants.modalDefault.backgroundColor,
        color: constants.modalDefault.color,
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
        color: constants.modalDefault.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 10
      },
      iconBacking: {
        backgroundColor: constants.modalDefault.iconBackingColor,
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
        marginLeft: constants.generalUnit * 1.5,
        color: palette.error.main
      },
      sharingLink: {
        padding: constants.generalUnit * 2,
        margin: 0
      },
      subModal: {
        width: "100%"
      }
    })
  }
)

interface ICreateOrManageSharedFolderModalProps {
  mode?: SharedFolderModalMode
  isModalOpen: boolean
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

const CreateOrManageSharedFolderModal = (
  { mode, isModalOpen, onClose, bucketToEdit }: ICreateOrManageSharedFolderModalProps
) => {
  const classes = useStyles()

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner,
        subModalInner: classes.subModal
      }}
      active={isModalOpen}
      closePosition="none"
      maxWidth="sm"
      testId="create-or-edit-shared-folder"
      subModal={mode === "edit" && !!bucketToEdit && (
        <LinkList
          bucketEncryptionKey={bucketToEdit.encryptionKey}
          bucketId={bucketToEdit.id}
        />
      )}
    >
      <CreateOrManageSharedFolder
        onClose={onClose}
        mode={mode}
        bucketToEdit={bucketToEdit}
      />
    </CustomModal>
  )
}

export default CreateOrManageSharedFolderModal
