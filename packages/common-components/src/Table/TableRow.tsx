import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ animation, palette, typography, overrides }: ITheme) =>
    createStyles({
      root: {
        color: palette.additional["gray"][8],
        outline: 0,
        borderBottom: `1px solid ${palette.additional["gray"][4]}`,
        transitionDuration: `${animation.transform}ms`,
        ...typography.body1,
        lineHeight: "inherit",
        "&.selected": {
          backgroundColor: palette.additional["gray"][4],
          "&:hover": {
            backgroundColor: palette.additional["gray"][4],
          },
          ...overrides?.Table?.row?.selected,
        },
        "&.classic": {
          display: "table-row",
          verticalAlign: "middle",
          ...overrides?.Table?.row?.classic,
        },
        "&.grid": {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
          alignItems: "center",
          ...overrides?.Table?.row?.grid,
        },
        ...overrides?.Table?.row?.root,
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
        type,
      )}
      onClick={rowSelectable ? onClick : undefined}
      {...rest}
    >
      {children}
    </tr>
  )
}

export default TableRow
