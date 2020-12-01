import { Button, IButtonProps } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode } from "react"
import clsx from "clsx"

const useStyles = makeStyles(({ palette }: ITheme) =>
  createStyles({
    root: {
      "&.gray": {
        backgroundColor: palette.additional["gray"][3],
        color: palette.additional["gray"][9],
      },
    },
  }),
)

const CUSTOM_VARIANTS = ["gray"]

const temp = [...CUSTOM_VARIANTS]
type customVariant = typeof temp[0]

type buttonVariant = IButtonProps["variant"] | customVariant

interface ICustomButton extends Omit<IButtonProps, "variant"> {
  children: ReactNode
  variant?: buttonVariant
  className?: string
}

const CustomButton: React.FC<ICustomButton> = ({
  className,
  children,
  variant,
  ...rest
}: ICustomButton) => {
  const classes = useStyles()

  const setVariant =
    variant && CUSTOM_VARIANTS.includes(variant)
      ? "primary"
      : variant
      ? variant
      : "primary"

  return (
    <Button
      className={clsx(classes.root, className, variant)}
      variant={setVariant as IButtonProps["variant"]}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default CustomButton
