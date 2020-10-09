import { CSSProperties } from "react"

export interface ISearchBarOverride {
  root?: CSSProperties
  standardIcon?: {
    root: CSSProperties
    size?: {
      large?: CSSProperties
      medium?: CSSProperties
      small?: CSSProperties
    }
  }
  size?: {
    large?: CSSProperties
    medium?: CSSProperties
    small?: CSSProperties
  }
  input?: {
    root?: CSSProperties
    hover?: CSSProperties
    focus?: CSSProperties
    disabled?: CSSProperties
  }
  inputArea?: {
    large?: {
      root?: CSSProperties
      input?: CSSProperties
    }
    medium?: {
      root?: CSSProperties
      input?: CSSProperties
    }
    small?: {
      root?: CSSProperties
      input?: CSSProperties
    }
  }
}
