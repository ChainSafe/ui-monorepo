import { CSSProperties } from "react"

export interface IIconOverride {
  root?: CSSProperties
  title?: CSSProperties
  icon?: {
    root?: CSSProperties
    flip?: CSSProperties
    rotate?: CSSProperties
  }
  options?: {
    root?: CSSProperties
    open?: CSSProperties
    position?: {
      topLeft?: CSSProperties
      topCenter?: CSSProperties
      topRight?: CSSProperties
      bottomLeft?: CSSProperties
      bottomCenter?: CSSProperties
      bottomRight?: CSSProperties
    }
  }
  item?: {
    root?: CSSProperties
    hover?: CSSProperties
  }
}
