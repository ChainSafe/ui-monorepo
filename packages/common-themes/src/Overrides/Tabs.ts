import { CSSProperties } from "react"

export interface ITabsOverride {
  tabList?: CSSProperties
  tabBar?: {
    root?: CSSProperties
    selected?: CSSProperties
  }
}
