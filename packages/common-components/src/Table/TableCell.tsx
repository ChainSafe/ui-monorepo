import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { AlignOption } from "./types"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      backgroundColor: "inherit",
      borderBottom: `1px solid ${theme.palette.secondary.border}`,
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
}

const TableCell: React.FC<ITableCellProps> = ({
  children,
  className,
  align = "center",
}: ITableCellProps) => {
  const classes = useStyles()
  const Component = "td"

  return (
    <Component
      className={clsx(
        className,
        classes.root,
        classes[`align${capitalize(align)}`],
      )}
    >
      {children}
    </Component>
  )
}

export default TableCell
