import { CSSProperties } from "react"

export interface IExpansionPanelOverride {
  root?: CSSProperties
  basic?: CSSProperties
  borderless?: CSSProperties
  icon?: CSSProperties

  heading?: {
    root?: CSSProperties
    active?: CSSProperties
    borderless?: {
      root?: CSSProperties
      active?: CSSProperties
    }
    basic?: {
      root?: CSSProperties
      active?: CSSProperties
    }
  }

  content?: {
    root?: CSSProperties
    active?: CSSProperties
    basic?: {
      root?: CSSProperties
      active?: CSSProperties
    }
  }
}
