import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      color: theme.palette.additional["gray"][8],
      outline: 0,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
      transitionDuration: `${theme.animation.transform}ms`,
      ...theme.typography.body1,
      lineHeight: "inherit",
      "&.selected": {
        backgroundColor: theme.palette.additional["gray"][4],
        "&:hover": {
          backgroundColor: theme.palette.additional["gray"][4],
        },
      },
      "&.classic": {
        display: "table-row",
        verticalAlign: "middle",
      },
      "&.grid": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
        alignItems: "center"
      }
    },
    rowSelectable: {
      cursor: "pointer",
    },
  }),
)

export interface ITableRowProps {
  className?: string
  type?: "classic" | "grid"
  children: ReactNode | ReactNode[]
  selected?: boolean
  rowSelectable?: boolean
  onClick?(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>): void
}

const TableRow: React.FC<ITableRowProps> = ({
  children,
  className,
  selected,
  type = "classic",
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
          selected: selected,
          [classes.rowSelectable]: rowSelectable,
        },
        className,
        type
      )}
      onClick={rowSelectable ? onClick : undefined}
      {...rest}
    >
      {children}
    </tr>
  )
}

export default TableRow
