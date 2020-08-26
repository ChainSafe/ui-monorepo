import React, { ReactNode } from "react"

export interface ITableBodyProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const TableBody: React.FC<ITableBodyProps> = ({
  children,
  className,
}: ITableBodyProps) => {
  const Component = "tbody"

  return <Component className={className}>{children}</Component>
}

export default TableBody
