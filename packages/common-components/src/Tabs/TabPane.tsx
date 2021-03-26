import React, { ReactNode } from "react"

export interface ITabPaneProps<TabKey = string> {
  className?: string
  children: ReactNode | ReactNode[]
  icon?: ReactNode
  iconRight?: ReactNode
  title: string
  tabKey: TabKey
}

const TabPane = <TabKey, >({ children, className }: ITabPaneProps<TabKey>) => {
  return <div className={className}>{children}</div>
}

export default TabPane
