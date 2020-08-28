import React, { ReactNode } from "react"

import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      color: "inherit",
      display: "table-row",
      verticalAlign: "middle",
      outline: 0,
      borderBottom: `1px solid ${theme.palette}`,
      transition: `all ${theme.animation.transform}ms`,
      "&:hover": {
        backgroundColor: theme.palette.secondary.hover,
      },
    },
    selected: {
      backgroundColor: theme.palette.secondary.hover,
      "&:hover": {
        backgroundColor: theme.palette.secondary.active,
      },
    },
  }),
)

export interface ITableRowProps {
  className?: string
  children: ReactNode | ReactNode[]
  selected?: boolean
}

const TableRow: React.FC<ITableRowProps> = ({
  children,
  className,
  selected,
  ...rest
}: ITableRowProps) => {
  const classes = useStyles()

  const Component = "tr"

  return (
    <Component
      className={clsx(
        classes.root,
        { [classes.selected]: selected },
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default TableRow
