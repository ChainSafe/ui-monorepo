import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      display: "table-header-group",
      backgroundColor: theme.palette.secondary.background,
      borderBottom: `1px solid ${theme.palette.secondary.border}`,
    },
  }),
)

export interface ITableHeadProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const TableHead: React.FC<ITableHeadProps> = ({
  children,
  className,
  ...rest
}: ITableHeadProps) => {
  const classes = useStyles()

  return (
    <thead className={clsx(classes.root, className)} {...rest}>
      {children}
    </thead>
  )
}

export default TableHead
