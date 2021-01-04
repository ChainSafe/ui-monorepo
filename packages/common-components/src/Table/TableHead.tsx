import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"

const useStyles = makeStyles(({ palette, typography, overrides }: ITheme) =>
  createStyles({
    root: {
      display: "table-header-group",
      minWidth: "min-content",
      color: palette.additional["gray"][9],
      backgroundColor: palette.additional["gray"][2],
      borderBottom: `1px solid ${palette.additional["gray"][4]}`,
      ...typography.body1,
      lineHeight: "inherit",
      ...overrides?.Table?.tableHead,
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
