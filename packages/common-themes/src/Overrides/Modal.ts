export interface IModalOverride {
  root?: Record<string, any>
  active?: Record<string, any>

  inner?: {
    root?: Record<string, any>
    size?: {
      xs?: Record<string, any>
      sm?: Record<string, any>
      md?: Record<string, any>
      lg?: Record<string, any>
      xl?: Record<string, any>
    }
  }

  closeIcon?: {
    root?: Record<string, any>
    left?: Record<string, any>
    right?: Record<string, any>
  }
}
