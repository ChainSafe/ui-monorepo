// Create icon system borrowed from material UI

import React from "react"
import SvgIcon, { SvgIconProps } from "./SvgIcon"

export default function createSvgIcon(icon: JSX.Element): typeof SvgIcon {
  const Component = (props: SvgIconProps) => (
    <SvgIcon {...props}>{icon}</SvgIcon>
  )

  return Component
}
