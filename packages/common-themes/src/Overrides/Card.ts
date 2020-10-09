import { CSSProperties } from "react"

export interface ICardOverride {
  root?: CSSProperties
  hoverable?: CSSProperties
  header?: {
    root?: CSSProperties
    dense?: CSSProperties
  }
  body?: {
    root?: CSSProperties
    dense?: CSSProperties
  }
  footer?: {
    root?: CSSProperties
    dense?: CSSProperties
  }
}
