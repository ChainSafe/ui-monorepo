import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { IModalProps, Modal } from "../Modal"
import { Typography } from "../Typography"
import { Button, IButtonProps } from "../Button"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {},
    inner: {
      padding: constants.generalUnit * 2,
      borderRadius: 2,
      transform: "translate(-50%, 0)",
      top: constants.generalUnit * 2,
      [breakpoints.down("sm")]: {
        maxWidth: `calc(100% - ${constants.generalUnit * 3}px) !important`
      }
    },
    message: {},
    buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: constants.generalUnit * 3,
      "& > *": {
        width: `calc(50% - ${constants.generalUnit * 2}px)`
      }
    }
  })
)

interface IDialogClasses {
  inner?: string
}

interface IDialogProps
  extends Omit<IModalProps, "setActive" | "closePosition" | "children"> {
  accept: () => void
  reject: () => void
  injectedClass?: IDialogClasses
  requestMessage?: string | ReactNode
  acceptText?: string
  rejectText?: string
  rejectButtonProps?: IButtonProps
  acceptButtonProps?: IButtonProps
  testId?: string
}

const Dialog: React.FC<IDialogProps> = ({
  accept,
  reject,
  requestMessage = "Please confirm",
  rejectText = "Cancel",
  acceptText = "Confirm",
  className,
  injectedClass,
  rejectButtonProps,
  acceptButtonProps,
  maxWidth = 450,
  testId,
  ...rest
}: IDialogProps) => {
  const classes = useStyles()

  return (
    <Modal
      closePosition="none"
      className={clsx(className, classes.root)}
      injectedClass={{
        inner: clsx(injectedClass?.inner, classes.inner)
      }}
      maxWidth={maxWidth}
      {...rest}
      testId={testId}
    >
      <Typography
        className={classes.message}
        variant="h5"
        component="p"
      >
        {requestMessage}
      </Typography>
      <section className={classes.buttons}>
        <Button
          onClick={() => reject()}
          variant="dashed"
          size="medium"
          {...rejectButtonProps}
        >
          {rejectText}
        </Button>
        <Button
          onClick={() => accept()}
          variant="primary"
          size="medium"
          {...acceptButtonProps}
        >
          {acceptText}
        </Button>
      </section>
    </Modal>
  )
}

export default Dialog

export { IDialogProps }
