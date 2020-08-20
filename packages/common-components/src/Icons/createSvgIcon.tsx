// Create icon system borrowed from material UI

import React from "react"
import SvgIcon, { SvgIconProps } from "./SvgIcon"

export default function createSvgIcon(path: JSX.Element): typeof SvgIcon {
  const Component = (props: SvgIconProps) => (
    <SvgIcon {...props}>{path}</SvgIcon>
  )

  return Component
}
