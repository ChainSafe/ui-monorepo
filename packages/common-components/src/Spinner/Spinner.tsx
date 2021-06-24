import React from "react"
import * as Loaders from "react-spinners"
import { PrecompiledCss } from "react-spinners/interfaces"
import { useTheme } from "@chainsafe/common-theme"
import { ITheme } from "@chainsafe/common-theme"

export enum LOADER {
  BarLoader = "BarLoader",
  BeatLoader = "BeatLoader",
  BounceLoader = "BounceLoader",
  CircleLoader = "CircleLoader",
  ClimbingBoxLoader = "ClimbingBoxLoader",
  ClipLoader = "ClipLoader",
  ClockLoader = "ClockLoader",
  DotLoader = "DotLoader",
  FadeLoader = "FadeLoader",
  GridLoader = "GridLoader",
  HashLoader = "HashLoader",
  MoonLoader = "MoonLoader",
  PacmanLoader = "PacmanLoader",
  PropagateLoader = "PropagateLoader",
  PuffLoader = "PuffLoader",
  PulseLoader = "PulseLoader",
  RingLoader = "RingLoader",
  RiseLoader = "RiseLoader",
  RotateLoader = "RotateLoader",
  ScaleLoader = "ScaleLoader",
  SyncLoader = "SyncLoader",
}

export interface SpinnerProps {
  loader: LOADER
  size?: string | number
  height?: string | number
  width?: string | number
  color?: string
  loading?: boolean
  radius?: string | number
  margin?: string | number
  css?: string | PrecompiledCss
}

const Spinner: React.FC<SpinnerProps> = ({
  color,
  height = 20,
  loading,
  radius,
  margin,
  size = 15,
  width = 20,
  css,
  loader = LOADER.CircleLoader
}: SpinnerProps) => {
  const Component = Loaders[loader]
  const theme: ITheme = useTheme()
  return (
    <Component
      color={color || theme.palette.secondary?.main}
      height={height}
      loading={loading}
      radius={radius}
      margin={margin}
      size={size}
      width={width}
      css={css}
    />
  )
}

export default Spinner
