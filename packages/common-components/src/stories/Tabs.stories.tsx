import React from "react"
import { Tabs, TabPane } from "../Tabs"

export default {
  title: "Tabs",
  component: Tabs
}

export const TabsDemo = (): React.ReactNode => {
  const [tab, setTab] = React.useState("1")
  return (
    <Tabs
      activeKey={tab}
      onTabSelect={setTab}
    >
      <TabPane title="tab 1"
        tabKey="1"
      >
        first
      </TabPane>
      <TabPane
        title="tab 2"
        tabKey="2"
      >
        second
      </TabPane>
      <TabPane
        title="tab 3"
        tabKey="3"
      >
        third
      </TabPane>
    </Tabs>
  )
}
