import React from "react"
import { Grid } from "@chainsafe/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import Paragraph from "../Modules/Paragraph"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(({ palette, breakpoints, constants }: ITheme) => {
  return createStyles({
    root: {
      marginTop: "10vh",
      [breakpoints.up("xl")]: {
        marginTop: 0,
      },
      [breakpoints.up("3800")]: {
        height: "60vh",
      },
    },
    graphic: {
      width: "100%",
      marginTop: "-10vh",
      [breakpoints.down("sm")]: {
        marginTop: 0,
      },
      [breakpoints.up("xl")]: {
        height: "50%",
      },
      [breakpoints.up("3500")]: {
        width: "100%",
        maxHeight: "50%",
      },
    },
    textContainer: {
      [breakpoints.down("sm")]: {
        marginTop: constants.generalUnit * 2,
      },
    },
    anchor: {
      color: palette.common.white.main,
    },
  })
})

const FeatureOne: React.FC = () => {
  const classes = useStyles()
  return (
    <Section>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item xs={12} md={7}>
          <img
            className={classes.graphic}
            src="/assets/15@0.5x.png"
            alt="3d mesh network with blue gradient"
          ></img>
        </Grid>
        <Grid item xs={12} md={5} className={classes.textContainer}>
          <Title>Don't be shy, there's room to spare.</Title>
          <br></br>
          <Paragraph>
            ChainSafe Files is built on the{" "}
            <a
              className={classes.anchor}
              href="https://filecoin.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {" "}
              Filecoin Network
            </a>
            , whose algorithmic storage markets are pioneering a new era of
            cloud storage that is more resilient, secure and efficient in a way
            never seen before.
          </Paragraph>
          <br></br>
          <Paragraph>
            Whether you’re backing up genome data or collecting family memories,
            Files gives you more storage with fewer limits.
          </Paragraph>
        </Grid>
      </Grid>
    </Section>
  )
}

export default FeatureOne
