import { CSSProperties } from "react"

export interface IButtonOverride {
  root?: CSSProperties
  icon?: {
    root?: CSSProperties
    large?: CSSProperties
    medium?: CSSProperties
    small?: CSSProperties
  }
  variants?: {
    primary?: {
      root?: CSSProperties
      hover?: CSSProperties
      focus?: CSSProperties
      active?: CSSProperties
    }
    outline?: {
      root?: CSSProperties
      hover?: CSSProperties
      focus?: CSSProperties
      active?: CSSProperties
    }
    dashed?: {
      root?: CSSProperties
      hover?: CSSProperties
      focus?: CSSProperties
      active?: CSSProperties
    }
  }
  state?: {
    danger?: {
      root?: CSSProperties
      hover?: CSSProperties
      focus?: CSSProperties
      active?: CSSProperties
    }
    disabled?: {
      root?: CSSProperties
      hover?: CSSProperties
      focus?: CSSProperties
      active?: CSSProperties
    }
  }
}
