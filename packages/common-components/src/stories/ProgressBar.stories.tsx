import React, { useState } from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { ProgressBar } from "../ProgressBar"

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
      <button onClick={() => setProgress(progress + 10)}>add 10</button>
      <button onClick={() => setProgress(progress - 10)}>reduce 10</button>
    </>
  )
}
