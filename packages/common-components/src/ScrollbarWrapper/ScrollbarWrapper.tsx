import React, { ReactNode } from "react"
import SimpleBarReact from "simplebar-react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      "& .simplebar-vertical": {
        width: 5,
        borderRadius: 6,
        opacity: 1,
        backgroundColor: theme.palette.primary.background,
        padding: 0,
      },
      "& .simplebar-scrollbar": {
        width: 5,
        borderRadius: 6,
        "&:before": {
          backgroundColor: theme.palette.primary.main,
          width: 5,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
    },
  }),
)

export interface OwnProps {
  className?: string
  maxHeight?: number
  children: ReactNode
}

const ScrollbarWrapper: React.SFC<OwnProps> = ({
  className,
  maxHeight,
  children,
}: OwnProps) => {
  const classes = useStyles()

  return (
    <SimpleBarReact
      style={maxHeight ? { maxHeight: maxHeight } : {}}
      className={clsx(classes.root, className)}
    >
      {children}
    </SimpleBarReact>
  )
}

export default ScrollbarWrapper
