import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import { Button, Typography } from "@chainsafe/common-components"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, constants, palette }: ITheme) =>
  createStyles({
    root: {
      maxWidth: 320,
      [breakpoints.down("md")]: {},
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
        },
      },
      "& h2": {
        marginBottom: constants.generalUnit * 4.125,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
        },
      },
    },
    cta: {
      marginTop: constants.generalUnit * 4.125,
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
      <Typography variant="h2" component="h2">
        A few things you should know....
      </Typography>
      <Typography variant="h5" component="p">
        Using ChainSafe Files requires that you set a encryption password. This
        is what disables your content from being read by us or any other
        third-party.
      </Typography>
      <Typography variant="h5" component="p">
        Here’s the thing about your encryption password.{" "}
        <strong>
          Forgetting this password means that you will be permanently locked out
          of your account.
        </strong>{" "}
        We aren’t storing any keys, and as a result we will not be able to
        recover your account.
      </Typography>
      <Typography variant="h5" component="p">
        Please do not share your encryption password with anyone. Record it
        somewhere safe.
      </Typography>
      <Button className={classes.cta} fullsize onClick={() => cta()}>
        OK, I’m ready to set my encryption password
      </Button>
    </section>
  )
}

export default ExplainSlide
