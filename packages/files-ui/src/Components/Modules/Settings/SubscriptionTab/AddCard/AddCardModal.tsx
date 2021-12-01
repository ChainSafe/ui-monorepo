import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import CustomModal from "../../../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import AddCard from "./AddCard"
import { Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(
  ({ breakpoints, constants, zIndex, typography }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4
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
      heading: {
        color: constants.createFolder.color,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        marginBottom: constants.generalUnit * 3
      },
      footer: {
        marginTop: constants.generalUnit * 4
      }
    })
  }
)

interface IAddCardModalProps {
  isModalOpen: boolean
  onClose: () => void
}

const AddCardModal = ({ isModalOpen, onClose }: IAddCardModalProps) => {
  const classes = useStyles()

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
        <Typography
          className={classes.heading}
          variant="h4"
          component="h4"
        >
          <Trans>Add a credit card</Trans>
        </Typography>
        <AddCard
          onClose={onClose}
          onCardAdd={onClose}
          submitText={t`Add card`}
          footerClassName={classes.footer}
        />
      </div>
    </CustomModal>
  )
}

export default AddCardModal
