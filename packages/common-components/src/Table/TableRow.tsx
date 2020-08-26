import React, { ReactNode } from "react"

export interface ITableRowProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const TableRow: React.FC<ITableRowProps> = ({
  children,
  className,
}: ITableRowProps) => {
  const Component = "tr"

  return <Component className={className}>{children}</Component>
}

export default TableRow
