import React, { useState } from "react"
import { withKnobs, text, select } from "@storybook/addon-knobs"
import { Button } from "../Button"
import ExpansionPanel from "../ExpansionPanel/ExpansionPanel"
import { Typography } from "../Typography"

export default {
  title: "ExpansionPanel",
  component: ExpansionPanel,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

export const StandardStory = (): React.ReactNode => {
  return (
    <>
      <ExpansionPanel
        variant={select("Variant", ["basic", "borderless"], "basic")}
        header={text("Header Text", "This is panel header")}
      >
        <Typography>
          Rapidiously negotiate go forward leadership skills and parallel
          vortals. Continually reconceptualize top-line solutions whereas just
          in time growth strategies. Seamlessly procrastinate competitive human.
        </Typography>
      </ExpansionPanel>
    </>
  )
}

export const ExternalControlStory = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <>
      <Button onClick={() => setActive(!active)}>
        <span>Toggle external: {`${active}`}</span>
      </Button>
      <ExpansionPanel
        variant={select("Variant", ["basic", "borderless"], "basic")}
        active={active}
        toggle={setActive}
        header={text("Header Text", "This is panel header")}
      >
        <Typography>
          Rapidiously negotiate go forward leadership skills and parallel
          vortals. Continually reconceptualize top-line solutions whereas just
          in time growth strategies. Seamlessly procrastinate competitive human.
        </Typography>
      </ExpansionPanel>
    </>
  )
}
