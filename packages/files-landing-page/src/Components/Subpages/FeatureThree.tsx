import React from "react"
import { Grid } from "@chainsafe/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import Paragraph from "../Modules/Paragraph"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, breakpoints, palette }: ITheme) => {
  return createStyles({
    root: {
      [breakpoints.up("xl")]: {
        position: "relative",
        left: "60%",
        transform: "translate(-50%)",
      },
      [breakpoints.up("3800")]: {
        position: "relative",
        left: "60%",
        transform: "translate(-50%)",
      },
      paddingTop: "5vh",
      [breakpoints.only("lg")]: {
        paddingTop: "10vh",
      },
    },
    img: {
      marginTop: "5vh",
      width: "100%",
      [breakpoints.up("xl")]: {
        width: "80%",
      },
    },
    titleContainer: {
      "& > span": {
        fontFamily: "'Archivo', sans-serif",
      },
      [breakpoints.down("sm")]: {
        marginBottom: constants.generalUnit * 1,
      },
      [breakpoints.up("xl")]: {
        position: "absolute",
        left: "35%",
        top: 0,
        transform: "translate(-50%)",
      },
      [breakpoints.up("3800")]: {
        position: "absolute",
        left: "31%",
        top: 100,
        transform: "translate(-50%)",
      },
    },
    textContainer: {
      "& > span": {
        fontFamily: "'Archivo', sans-serif",
      },
      [breakpoints.down("lg")]: {
        marginTop: constants.generalUnit * 8,
      },
      [breakpoints.up("xl")]: {
        position: "absolute",
        left: "15%",
        transform: "translateX(-50%)",
      },
      [breakpoints.down("sm")]: {
        marginBottom: constants.generalUnit * 1,
        marginTop: constants.generalUnit * 3,
        position: "static",
      },
    },
    anchor: {
      color: palette.common.white.main,
    },
  })
})

const FeatureThree: React.FC = () => {
  const classes = useStyles()
  return (
    <Section>
      <Grid
        xs={12}
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        className={classes.root}
      >
        <Grid
          className={classes.titleContainer}
          item
          xs={12}
          xl={10}
          alignItems="center"
        >
          <Title>
            <Trans>Strong security meets simple experience.</Trans>
          </Title>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={3}
          alignItems="center"
          justifyContent="flex-start"
          className={classes.textContainer}
        >
          <Paragraph>
            <Trans>
              Uploading and accessing your stuff is a breeze on any device, so
              you can make the most of your content, wherever you are.
            </Trans>
          </Paragraph>
          <br></br>
          <Paragraph>
            <Trans>
              Every file uploaded to ChainSafe Files is encrypted end-to-end,
              using AES-256 bit encryption. So you can be assured that your
              content is for your eyes only.
            </Trans>
          </Paragraph>
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
          <img
            className={classes.img}
            src="/assets/mockup.png"
            alt="ipad and google pixel phone showing homepage of ChainSafe Files"
          />
        </Grid>
      </Grid>
    </Section>
  )
}

export default FeatureThree
