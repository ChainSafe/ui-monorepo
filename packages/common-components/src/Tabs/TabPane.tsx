import React, { ReactNode } from "react"

export interface ITabPaneProps<TabKey = string> {
  className?: string
  children: ReactNode | ReactNode[]
  title: string
  tabKey: TabKey
  icon?: ReactNode | ReactNode[]
}

const TabPane = <TabKey, >({ children, className }: ITabPaneProps<TabKey>) => {
  return <div className={className}>{children}</div>
}

export default TabPane
