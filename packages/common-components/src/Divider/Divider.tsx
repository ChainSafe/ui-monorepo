import React, { ReactNode } from "react"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"

const useStyles = makeStyles(({ palette, zIndex, overrides }: ITheme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
      marginBottom: 22,
      zIndex: zIndex?.background,
      "& span": {
        display: "block",
        margin: "0 5px"
      },
      "&:before, &:after": {
        height: 1,
        width: 0,
        flex: "1 1 0",
        backgroundColor: palette.additional["gray"][5],
        display: "block",
        content: "''"
      },
      ...overrides?.Divider?.root
    }
  })
)

const Divider: React.FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const classes = useStyles()
  return <div className={clsx(classes.root, className)}>{children}</div>
}

export default Divider
