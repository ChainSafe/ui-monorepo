export interface IToasterOverride {
  root?: Record<string, any>
  inner?: Record<string, any>
  typeIcon?: {
    root?: Record<string, any>
    success?: Record<string, any>
    error?: Record<string, any>
    info?: Record<string, any>
  }
  closeButton?: Record<string, any>
  closeIcon?: Record<string, any>
  messageContainer?: Record<string, any>
  message?: Record<string, any>
  description?: Record<string, any>
}
