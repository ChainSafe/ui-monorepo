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
      borderBottom: `1px solid ${theme.palette.border.border}`,
      transition: `all ${theme.animation.transform}ms`,
      "&:hover": {
        backgroundColor: theme.palette.border.border,
      },
      "&$selected, &$selected:hover": {
        backgroundColor: theme.palette.border.main,
      },
    },
  }),
)

export interface ITableRowProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const TableRow: React.FC<ITableRowProps> = ({
  children,
  className,
  ...rest
}: ITableRowProps) => {
  const classes = useStyles()

  const Component = "tr"

  return (
    <Component className={clsx(classes.root, className)} {...rest}>
      {children}
    </Component>
  )
}

export default TableRow
