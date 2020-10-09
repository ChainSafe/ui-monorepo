import { CSSProperties } from "react"

export interface ICheckboxOverride {
  root?: CSSProperties
  checkbox?: {
    root?: CSSProperties
    hover?: CSSProperties
    checked?: CSSProperties
    disabled?: CSSProperties
  }
  input?: CSSProperties
  label?: CSSProperties
  labelDisabled?: CSSProperties
  error?: CSSProperties
}
