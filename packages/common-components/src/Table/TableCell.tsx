import React, { ReactNode } from "react"

export interface ITableCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
}

const TableCell: React.FC<ITableCellProps> = ({
  children,
  className,
}: ITableCellProps) => {
  const Component = "td"

  return <Component className={className}>{children}</Component>
}

export default TableCell
