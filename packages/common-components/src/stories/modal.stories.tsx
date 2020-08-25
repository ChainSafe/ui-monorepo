import React, { Fragment, useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import { withKnobs, select } from "@storybook/addon-knobs"
import Typography from "../Typography"

export default {
  title: "Modal story",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const closePositionOptions: ["left", "right", "none", undefined] = [
  "left",
  "right",
  "none",
  undefined,
]
const maxWidthOptions: ["xs", "sm", "md", "lg", "xl", 250, undefined] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  250,
  undefined,
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

export const DialogStory = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open Dialog
      </Button>
      <Modal active={active} closePosition="none">
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
        <Button onClick={() => setActive(false)} variant="primary" size="large">
          Close Dialog
        </Button>
      </Modal>
    </Fragment>
  )
}
