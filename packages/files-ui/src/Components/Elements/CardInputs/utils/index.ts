export * from "./cardTypes"
export * from "./formatter"
export * from "./validator"

export const BACKSPACE_KEY_CODE = "Backspace"
export const ENTER_KEY_CODE = "Enter"

export const isHighlighted = () =>
  (window.getSelection() || { type: undefined }).type === "Range"
