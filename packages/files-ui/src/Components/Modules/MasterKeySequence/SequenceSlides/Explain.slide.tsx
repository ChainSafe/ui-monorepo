import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import { Button, Typography } from "@chainsafe/common-components"
import { useState } from "react"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("md")]: {},
    },
  }),
)

interface IExplainSlide {
  className?: string
  cta: () => void
}

const ExplainSlide: React.FC<IExplainSlide> = ({
  className,
  cta,
}: IExplainSlide) => {
  const classes = useStyles()

  return (
    <section className={clsx(classes.root, className)}>
      <Typography>A few things you should know....</Typography>
      <Typography>
        Using ChainSafe Files requires that you set a master key. This is what
        disables your content from being read by us or any other third-party.
      </Typography>
      <Typography>
        Here’s the thing about your master key.{" "}
        <strong>
          Forgetting this password means that you will be permanently locked out
          of your account.
        </strong>{" "}
        We aren’t storing any keys, and as a result we will not be able to
        recover your account.
      </Typography>
      <Typography>
        Please do not share your master key with anyone. Record it somewhere
        safe.
      </Typography>
      <Button onClick={() => cta()}>OK, I’m ready to set my key</Button>
    </section>
  )
}

export default ExplainSlide
