import React, { ReactNode } from "react"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { AlignOption } from "./types"

const useStyles = makeStyles(({ overrides }: ITheme) =>
  createStyles({
    root: {
      backgroundColor: "transparent",
      ...overrides?.Table?.cell?.root,
    },
    alignLeft: {
      textAlign: "left",
      ...overrides?.Table?.cell?.left,
    },
    alignCenter: {
      textAlign: "center",
      ...overrides?.Table?.cell?.center,
    },
    alignRight: {
      textAlign: "right",
      ...overrides?.Table?.cell?.right,
    },
  }),
)

export interface ITableCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
  align?: AlignOption
  onClick?: () => void
}
const TableCell = React.forwardRef(
  (
    {
      children,
      className,
      onClick,
      align = "center",
      ...rest
    }: ITableCellProps,
    forwardedRef: any,
  ) => {
    const classes = useStyles()

    return (
      <td
        onClick={() => (onClick ? onClick() : null)}
        className={clsx(
          className,
          classes.root,
          classes[`align${capitalize(align)}`],
        )}
        ref={forwardedRef}
        {...rest}
      >
        {children}
      </td>
    )
  },
)

export default TableCell
