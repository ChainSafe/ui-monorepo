import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { AlignOption } from "./types"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: "transparent",
    },
    alignLeft: {
      textAlign: "left",
    },
    alignCenter: {
      textAlign: "center",
    },
    alignRight: {
      textAlign: "right",
    },
  }),
)

export interface ITableCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
  align?: AlignOption
  onClick?: () => void
}

const TableCell: React.FC<ITableCellProps> = ({
  children,
  className,
  onClick,
  align = "center",
}: ITableCellProps) => {
  const classes = useStyles()

  return (
    <td
      onClick={() => onClick ? onClick() : null }
      className={clsx(
        className,
        classes.root,
        classes[`align${capitalize(align)}`],
      )}
    >
      {children}
    </td>
  )
}

export default TableCell
