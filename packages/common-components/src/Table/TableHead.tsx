import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      display: "table-header-group",
      color: theme.palette["gray"][9],
      backgroundColor: theme.palette["gray"][2],
      borderBottom: `1px solid ${theme.palette["gray"][4]}`,
      ...theme.typography.body1,
      lineHeight: "inherit",
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
