import React from "react"
import { Grid, Typography } from "@imploy/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import Paragraph from "../Modules/Paragraph"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"

const useStyles = makeStyles(
  ({ palette, zIndex, breakpoints, constants }: ITheme) => {
    return createStyles({
      img: {
        zIndex: zIndex?.layer0,
        width: "100%",
        [breakpoints.up("lg")]: {
          width: "60%",
        },
      },
      titleContainer: {
        marginTop: constants.generalUnit * 10,
      },
      textContainer: {
        color: palette.common.white.main,
        margin: "2vh 0 10vh 0",
        zIndex: zIndex?.layer3,
        [breakpoints.up("xl")]: {
          marginTop: `-${constants.generalUnit * 16}px`,
          maxWidth: "80%",
        },
        [breakpoints.up("3840")]: {
          position: "relative",
          left: "45%",
          transform: "translate(-50%)",
        },
      },
      subheading: {
        marginBottom: constants.generalUnit * 1,
        zIndex: zIndex?.layer3,
        [breakpoints.up("lg")]: {
          maxWidth: "80%",
        },
        [breakpoints.down("330")]: {
          fontSize: "20px",
          lineHeight: "28px",
        },
      },
      paragraphColumn: {
        [breakpoints.down("lg")]: {
          margin: "2rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
        },
        [breakpoints.down("sm")]: {
          marginBottom: constants.generalUnit * 5,
        },
      },
      anchor: {
        color: palette.common.white.main,
      },
    })
  },
)

const WhyUseIt: React.FC = () => {
  const classes = useStyles()
  return (
    <Section>
      <Grid
        xs={12}
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          item
          xs={12}
          alignItems="center"
          className={classes.titleContainer}
        >
          <Title>A different approach. </Title>
        </Grid>
        <img
          className={classes.img}
          src="/assets/why.png"
          alt="3D rendering of multicolored layers of glass on top of each other"
        ></img>

        {/* Subheadings */}
        <Grid
          container
          xs={12}
          lg={12}
          justifyContent="center"
          alignItems="baseline"
          className={classes.textContainer}
          spacing={2}
        >
          <Grid item xs={12} md={6} lg={4} className={classes.paragraphColumn}>
            <Typography variant="h2" className={classes.subheading}>
              We don’t collect and sell your personal data.
            </Typography>
            <Paragraph>
              No need to take our word for it. The way Files is built prevents
              your data from being shared and monetized for third parties. We
              think personalized ads are creepy too.
            </Paragraph>
          </Grid>
          <Grid item xs={12} md={6} lg={4} className={classes.paragraphColumn}>
            <Typography className={classes.subheading} variant="h2">
              Built by passionate and experienced engineers.
            </Typography>
            <Paragraph>
              <a
                className={classes.anchor}
                href="https://chainsafe.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ChainSafe
              </a>{" "}
              is an exceptional group of blockchain infrastructure engineers.
              Trusted by leading public blockchains, performance and reliability
              are always top priority.
            </Paragraph>
          </Grid>
          <Grid item xs={12} md={6} lg={4} className={classes.paragraphColumn}>
            <Typography className={classes.subheading} variant="h2">
              The future is faster, stronger, and more distributed.
            </Typography>
            <Paragraph>
              Files is among the first to ring in the new era of cloud storage
              built on Filecoin, where data privacy and network resilience are
              being brought to new heights by peer-to-peer systems.
            </Paragraph>
          </Grid>
        </Grid>
      </Grid>
    </Section>
  )
}

export default WhyUseIt
