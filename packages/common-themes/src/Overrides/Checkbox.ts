export interface ICheckboxOverride {
  root?: Record<string, any>
  checkbox?: {
    root?: Record<string, any>
    hover?: Record<string, any>
    checked?: Record<string, any>
    disabled?: Record<string, any>
  }
  input?: Record<string, any>
  label?: Record<string, any>
  labelDisabled?: Record<string, any>
  error?: Record<string, any>
}
