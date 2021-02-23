export interface ICardOverride {
  root?: Record<string, any>
  hoverable?: Record<string, any>
  header?: {
    root?: Record<string, any>
    dense?: Record<string, any>
  }
  body?: {
    root?: Record<string, any>
    dense?: Record<string, any>
  }
  footer?: {
    root?: Record<string, any>
    dense?: Record<string, any>
  }
}
