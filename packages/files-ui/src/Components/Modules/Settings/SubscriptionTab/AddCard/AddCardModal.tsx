import React, { useMemo } from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import CustomModal from "../../../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import AddCard from "../Common/AddCard"
import { Typography } from "@chainsafe/common-components"
import { useBilling } from "../../../../../Contexts/BillingContext"

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
  const { defaultCard } = useBilling()
  const isUpdate = useMemo(() => !!defaultCard, [defaultCard])

  return (
    <CustomModal
      testId="add-or-update-card"
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
          data-cy={isUpdate ? "header-update-card" : "header-add-card"}
        >
          {isUpdate
            ? <Trans>Update your credit card</Trans>
            : <Trans>Add a credit card</Trans>
          }
        </Typography>
        <AddCard
          onClose={onClose}
          onCardAdd={onClose}
          submitText={isUpdate ? t`Update card` : t`Add card`}
          footerClassName={classes.footer}
        />
      </div>
    </CustomModal>
  )
}

export default AddCardModal
