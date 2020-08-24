type colorProp = "inherit" | "primary" | "secondary" | "error" | "success"
type fontSizeProp = "inherit" | "small" | "medium" | "large"

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  >>
  const src: string
  export default src
}
