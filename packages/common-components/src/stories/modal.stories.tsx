import React, { Fragment, useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import Typography from "../Typography"

export default {
  title: "Modal story",
  component: Button,
  excludeStories: /.*Data$/,
}

export const ModalLeft = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open modal, close on left
      </Button>
      <Modal active={active} closePosition="left">
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
      </Modal>
    </Fragment>
  )
}

export const ModalRight = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open modal, close on right
      </Button>
      <Modal active={active} closePosition="right">
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
      </Modal>
    </Fragment>
  )
}

export const ModalNoClose = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open modal, no close icon
      </Button>
      <Modal active={active} closePosition="right">
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
      </Modal>
    </Fragment>
  )
}

export const Dialog = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open Dialog
      </Button>
      <Modal active={active} closePosition="none" canClose={false}>
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas,
          ducimus vel cumque cum culpa quisquam deleniti iusto ipsum. Officiis
          magni ullam soluta iusto doloremque harum laborum quia accusantium
          incidunt necessitatibus.
        </Typography>
        <Button onClick={() => setActive(false)} variant="primary" size="large">
          Open Dialog
        </Button>
      </Modal>
    </Fragment>
  )
}
