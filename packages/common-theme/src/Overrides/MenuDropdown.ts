export interface IMenuDropdownOverride {
  root?: Record<string, any>
  title?: Record<string, any>
  icon?: {
    root?: Record<string, any>
    flip?: Record<string, any>
    rotate?: Record<string, any>
  }
  options?: {
    root?: Record<string, any>
    open?: Record<string, any>
    position?: {
      topLeft?: Record<string, any>
      topCenter?: Record<string, any>
      topRight?: Record<string, any>
      bottomLeft?: Record<string, any>
      bottomCenter?: Record<string, any>
      bottomRight?: Record<string, any>
    }
  }
  item?: {
    root?: Record<string, any>
    hover?: Record<string, any>
  }
}
