export interface IAvatarOverride {
  root?: Record<string, any>
  sizes?: {
    large?: Record<string, any>
    medium?: Record<string, any>
    small?: Record<string, any>
  }
  variants?: {
    square?: Record<string, any>
    circle?: Record<string, any>
  }
}
