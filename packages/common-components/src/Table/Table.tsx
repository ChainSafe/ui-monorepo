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
      "& $th, & $td": {
        padding: `${theme.constants.generalUnit * 2}px`,
      },
    },
    fullWidth: {
      width: "100%",
    },
    dense: {
      "& $th, & $td": {
        padding: `${theme.constants.generalUnit}px`,
      },
    },
    hover: {
      "& $tr:hover": {
        backgroundColor: theme.palette.secondary.hover,
      },
      "& $tr:nth-child(even)": {
        "&:hover": {
          backgroundColor: theme.palette.secondary.hover,
        },
      },
    },
    striped: {
      "& $tr:nth-child(even)": {
        backgroundColor: theme.palette.secondary.background,
      },
    },
  }),
)

export interface ITableProps {
  className?: string
  children: ReactNode | ReactNode[]
  striped?: boolean
  fullWidth?: boolean
  hover?: boolean
  dense?: boolean
}

const Table: React.FC<ITableProps> = ({
  children,
  className,
  fullWidth,
  striped,
  hover,
  dense,
  ...rest
}: ITableProps) => {
  const classes = useStyles()
  const Component = "table"

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes.hover]: hover,
          [classes.fullWidth]: fullWidth,
          [classes.dense]: dense,
          [classes.striped]: striped,
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
