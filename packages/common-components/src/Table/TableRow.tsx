import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
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
    },
    selected: {
      backgroundColor: theme.palette.secondary.hover,
      "&:hover": {
        backgroundColor: theme.palette.secondary.active,
      },
    },
    rowSelectable: {
      cursor: "pointer",
    },
  }),
)

export interface ITableRowProps {
  className?: string
  children: ReactNode | ReactNode[]
  selected?: boolean
  rowSelectable?: boolean
  onClick?(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>): void
}

const TableRow: React.FC<ITableRowProps> = ({
  children,
  className,
  selected,
  rowSelectable,
  onClick,
  ...rest
}: ITableRowProps) => {
  const classes = useStyles()

  return (
    <tr
      className={clsx(
        classes.root,
        {
          [classes.selected]: selected,
          [classes.rowSelectable]: rowSelectable,
        },
        className,
      )}
      onClick={rowSelectable ? onClick : undefined}
      {...rest}
    >
      {children}
    </tr>
  )
}

export default TableRow
