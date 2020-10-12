import { CSSProperties } from "react"

export interface ITextInputOverride {
  root?: CSSProperties
  disabled?: CSSProperties
  size?: {
    large?: CSSProperties
    medium?: CSSProperties
    small?: CSSProperties
  }

  inputArea?: {
    root?: CSSProperties
    size?: {
      large?: CSSProperties
      medium?: CSSProperties
      small?: CSSProperties
    }
  }

  input?: {
    root?: CSSProperties
    focus?: CSSProperties
    hover?: CSSProperties
    disabled?: CSSProperties
  }

  caption?: CSSProperties
  label?: CSSProperties
  icon?: {
    root?: CSSProperties
    size?: {
      large?: {
        root?: CSSProperties
        left?: CSSProperties
        right?: CSSProperties
      }
      medium?: {
        root?: CSSProperties
        left?: CSSProperties
        right?: CSSProperties
      }
      small?: {
        root?: CSSProperties
        left?: CSSProperties
        right?: CSSProperties
      }
    }
  }
}
