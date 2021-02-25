import React, { Fragment, useState } from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { Button } from "../Button"
import { Modal } from "../Modal"
import { Typography } from "../Typography"

export default {
  title: "Modal",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

type ClosePositionOption = "left" | "right" | "none" | undefined
const closePositionOptions: ClosePositionOption[] = [
  "left",
  "right",
  "none",
  undefined
]

type MaxWidthOption = "xs" | "sm" | "md" | "lg" | "xl" | 250 | undefined
const maxWidthOptions: MaxWidthOption[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  250,
  undefined
]

export const ModalStory = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open modal
      </Button>
      <Modal
        active={active}
        setActive={setActive}
        maxWidth={select("Max width position", maxWidthOptions, "md")}
        closePosition={select("Close position", closePositionOptions, "left")}
      >
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
        <Button onClick={() => setActive(false)} variant="primary" size="large">
          Close modal
        </Button>
      </Modal>
    </Fragment>
  )
}
