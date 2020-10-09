import { CSSProperties } from "react"

export interface IToasterOverride {
  root?: CSSProperties
  inner?: CSSProperties
  typeIcon?: CSSProperties
  closeButton?: CSSProperties
  closeIcon?: CSSProperties
  messageContainer?: CSSProperties
  message?: CSSProperties
  description?: CSSProperties
}
