import { CSSProperties } from "react"

export interface IDrawerOverride {
  root?: CSSProperties
  backdrop?: {
    root?: CSSProperties
    open?: CSSProperties
    transparent?: CSSProperties
  }
  position?: {
    top?: {
      root?: CSSProperties
      open?: CSSProperties
    }
    bottom?: {
      root?: CSSProperties
      open?: CSSProperties
    }
    right?: {
      root?: CSSProperties
      open?: CSSProperties
    }
    left?: {
      root?: CSSProperties
      open?: CSSProperties
    }
  }
}
