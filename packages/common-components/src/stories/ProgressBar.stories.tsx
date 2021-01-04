import React, { useState } from "react"
import { withKnobs, select, boolean, number } from "@storybook/addon-knobs"
import { ProgressBar, CircularProgressBar } from "../ProgressBar"

export default {
  title: "ProgressBar",
  component: ProgressBar,
  decorators: [withKnobs],
}

export const ProgressBarDemo = (): React.ReactNode => {
  const [progress, setProgress] = useState(10)
  return (
    <>
      <ProgressBar
        state={select(
          "state",
          [undefined, "progress", "success", "error"],
          undefined,
        )}
        variant={select(
          "variant",
          [undefined, "primary", "secondary"],
          undefined,
        )}
        size={select(
          "size",
          [undefined, "small", "medium", "large"],
          undefined,
        )}
        progress={progress}
      />
      <button onClick={() => setProgress(-1)}>Indeterminant</button>
      <button onClick={() => setProgress(progress + 10)}>add 10</button>
      <button onClick={() => setProgress(progress - 10)}>reduce 10</button>
    </>
  )
}

export const CircularProgressBarDemo = (): React.ReactNode => {
  const [progress, setProgress] = useState(10)
  return (
    <>
      <CircularProgressBar
        state={select(
          "state",
          [undefined, "progress", "success", "error"],
          undefined,
        )}
        variant={select(
          "variant",
          [undefined, "primary", "secondary"],
          undefined,
        )}
        size={select(
          "size",
          [undefined, "small", "medium", "large"],
          undefined,
        )}
        showBackdrop={boolean("backdrop", true)}
        width={number("width", 20)}
        progress={progress}
      />
      <button onClick={() => setProgress(progress + 10)}>add 10</button>
      <button onClick={() => setProgress(progress - 10)}>reduce 10</button>
    </>
  )
}
