import React, { ReactNode } from "react"

export interface ITabPaneProps {
  className?: string
  children: ReactNode | ReactNode[]
  title: string
  tabKey: string
}

const TabPane: React.FC<ITabPaneProps> = ({
  children,
  className
}: ITabPaneProps) => {
  return <div className={className}>{children}</div>
}

export default TabPane
