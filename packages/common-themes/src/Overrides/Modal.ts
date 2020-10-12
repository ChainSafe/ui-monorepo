import { CSSProperties } from "react"

export interface IModalOverride {
  root?: CSSProperties
  active?: CSSProperties

  inner?: {
    root?: CSSProperties
    size?: {
      xs?: CSSProperties
      sm?: CSSProperties
      md?: CSSProperties
      lg?: CSSProperties
      xl?: CSSProperties
    }
  }

  closeIcon?: {
    root?: CSSProperties
    left?: CSSProperties
    right?: CSSProperties
  }
}
