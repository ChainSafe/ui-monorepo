import React, { ReactNode } from "react"

export interface ITableBodyProps {
  className?: string;
  children: ReactNode | ReactNode[];
}

const TableBody: React.FC<ITableBodyProps> = ({
  children,
  className
}: ITableBodyProps) => {
  return <tbody className={className}>{children}</tbody>
}

export default TableBody
