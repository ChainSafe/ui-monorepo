import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      display: "table",
      borderCollapse: "collapse",
      borderSpacing: 0,
      transition: `all ${theme.animation.transform}ms`,
      textAlign: "left",
    },
    fullWidth: {
      width: "100%",
    },
    dense: {
      padding: `${theme.constants.generalUnit}px`,
    },
  }),
)

export interface ITableProps {
  className?: string
  children: ReactNode | ReactNode[]
  striped?: boolean
  fullWidth?: boolean
}

const Table: React.FC<ITableProps> = ({
  children,
  className,
  fullWidth,
  ...rest
}: ITableProps) => {
  const classes = useStyles()
  const Component = "table"

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes["fullWidth"]]: fullWidth,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Table
