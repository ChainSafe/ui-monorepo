import React from "react"
import ForegroundSource from "./foreground.svg"

interface IForegroundSVG {
  className?: string
}

export const ForegroundSVG = ({ className }: IForegroundSVG) => {
  return (
    <img
      alt="foreground"
      className={className}
      src={ForegroundSource}
    />
  )
}