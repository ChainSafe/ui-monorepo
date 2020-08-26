import React, { ReactNode } from "react"

export interface ITableHeadProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const TableHead: React.FC<ITableHeadProps> = ({
  children,
  className,
}: ITableHeadProps) => {
  const Component = "thead"

  return <Component className={className}>{children}</Component>
}

export default TableHead
