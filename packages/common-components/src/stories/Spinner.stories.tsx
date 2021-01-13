import React from "react"
import {
  withKnobs,
  select,
  number,
  color,
  boolean,
} from "@storybook/addon-knobs"
import { LOADER, Spinner } from "../Spinner"
import { Loading, Loading2 } from "../Spinner"

export default {
  title: "Spinner",
  component: Spinner,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const loaderOptions: LOADER[] = [
  LOADER.BarLoader,
  LOADER.BeatLoader,
  LOADER.BounceLoader,
  LOADER.CircleLoader,
  LOADER.ClimbingBoxLoader,
  LOADER.ClipLoader,
  LOADER.ClockLoader,
  LOADER.DotLoader,
  LOADER.FadeLoader,
  LOADER.GridLoader,
  LOADER.HashLoader,
  LOADER.MoonLoader,
  LOADER.PacmanLoader,
  LOADER.PropagateLoader,
  LOADER.PuffLoader,
  LOADER.PulseLoader,
  LOADER.RingLoader,
  LOADER.RiseLoader,
  LOADER.RotateLoader,
  LOADER.ScaleLoader,
  LOADER.SyncLoader,
]

export const SpinnerStory = (): React.ReactNode => (
  <Spinner
    size={number("Size", 60)}
    height={number("Size", 20)}
    width={number("Width", 5)}
    loading={boolean("Loading", true)}
    margin={number("Margin", 2)}
    radius={number("Radius", 2)}
    color={color("Color", "#1890FF")}
    loader={select("Loader Type", loaderOptions, LOADER.ClipLoader)}
  >
    Spinner
  </Spinner>
)

export const LoadingStory = (): React.ReactNode => (
  <Loading type={select("Type", ["primary", "dark", "light"], "primary")} />
)

export const Loading2Story = (): React.ReactNode => (
  <Loading2 type={select("Type", ["primary", "dark", "light"], "primary")} />
)
