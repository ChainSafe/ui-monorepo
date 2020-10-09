import { CSSProperties } from "react"

export interface IAvatarOverride {
  root?: CSSProperties
  sizes?: {
    large?: CSSProperties
    medium?: CSSProperties
    small?: CSSProperties
  }
  variants?: {
    square?: CSSProperties
    circle?: CSSProperties
  }
}
