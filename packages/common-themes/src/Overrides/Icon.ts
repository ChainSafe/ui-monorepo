import { CSSProperties } from "react"

export interface IIconOverride {
  root?: CSSProperties
  size?: {
    small?: CSSProperties
    medium?: CSSProperties
    large?: CSSProperties
  }
}
