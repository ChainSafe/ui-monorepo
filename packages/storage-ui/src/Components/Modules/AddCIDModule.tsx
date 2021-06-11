import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Modal, Typography } from "@chainsafe/common-components"
import CustomModal from "../Elements/CustomModal"
import { CSSTheme } from "../../Themes/types"

const useStyles = makeStyles(({ constants, breakpoints, zIndex, typography }: CSSTheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
      flexDirection: "column"
    },
    modalRoot: {
      zIndex: zIndex?.blocker,
      [breakpoints.down("md")]: {}
    },
    modalInner: {
      backgroundColor: constants.createFolder.backgroundColor,
      color: constants.createFolder.color,
      [breakpoints.down("md")]: {
        bottom:
        Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    input: {
      marginBottom: constants.generalUnit * 2
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
      color: constants.createFolder.color,
      fontWeight: typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: constants.generalUnit * 4
    }
  })
)

interface IAddCIDModuleProps {
  modalOpen: boolean
  close: () => void
}


const AddCIDModule = ({
  modalOpen = false
}: IAddCIDModuleProps) => {
  const classes = useStyles()

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

    </CustomModal>
  )
}

export default AddCIDModule
