import React, { ReactNode } from "react"

export interface ITableHeadCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
}

const TableHeadCell: React.FC<ITableHeadCellProps> = ({
  children,
  className,
}: ITableHeadCellProps) => {
  const Component = "th"

  return <Component className={className}>{children}</Component>
}

export default TableHeadCell
