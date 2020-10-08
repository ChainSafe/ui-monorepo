import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(({ palette }: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 14,
      backgroundColor: palette.additional["gray"][6],
      color: palette.common.white.main,
      position: "relative",
      "& img": {
        objectFit: "cover",
      },
      "& canvas": {
        width: "100% !important",
        height: "100% !important",
      },
      "& svg": {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        height: 18,
        width: 18,
        fill: palette.common.white.main,
      },
      "&.large": {
        height: 40,
        width: 40,
      },
      "&.medium": {
        height: 32,
        width: 32,
      },
      "&.small": {
        height: 24,
        width: 24,
      },
      "&.square": {
        borderRadius: 2,
      },
      "&.circle": {
        borderRadius: "50%",
      },
    },
  }),
)

type ReactDiv = React.HTMLProps<HTMLDivElement>

interface AvatarProps extends Omit<ReactDiv, "size"> {
  className?: string
  children?: ReactNode
  size?: "large" | "medium" | "small"
  variant?: "circle" | "square"
}

const Avatar: React.FC<AvatarProps> = ({
  variant = "circle",
  size = "medium",
  className,
  children,
  ...rest
}: AvatarProps) => {
  const classes = useStyles()
  return (
    <article className={clsx(classes.root, className, variant, size)} {...rest}>
      {children}
    </article>
  )
}

export default Avatar
export { AvatarProps }
