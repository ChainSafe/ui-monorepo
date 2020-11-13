import React from "react"
import { Grid, Typography } from "@imploy/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ palette, zIndex, breakpoints, constants }: ITheme) => {
    return createStyles({
      wrapper: {
        [breakpoints.up("1200")]: {
          minHeight: "70vh",
          margin: "20vh 0 0 0",
        },
      },
      img: {
        zIndex: zIndex?.layer0,
        position: "absolute",
        width: "100%",
        bottom: 0,
        right: 0,
        [breakpoints.down("sm")]: {
          width: "75%",
          left: "50%",
          transform: "translate(-50%)",
        },
        [breakpoints.up("md")]: {
          width: "75%",
          bottom: 180,
          left: "20%",
        },
        [breakpoints.up("lg")]: {
          width: "30%",
          bottom: 180,
          left: "60%",
        },
      },
      titleContainer: {
        maxWidth: "850px",
        flexDirection: "column",
        [breakpoints.down("lg")]: {
          width: "100%",
          alignItems: "flex-start",
        },
        [breakpoints.up("xl")]: {
          margin: `${constants.generalUnit * 10}px 0 0 ${
            constants.generalUnit * 37
          }px `,
        },
        [breakpoints.up("3800")]: {
          margin: `${constants.generalUnit * 10}px 0 0 ${
            constants.generalUnit * 60
          }px `,
        },
      },
      title: {
        zIndex: zIndex?.layer3,
      },
      text: {
        marginTop: constants.generalUnit * 2,
        zIndex: zIndex?.layer2,
        color: palette.additional["gray"][6],
      },
    })
  },
)

const FeatureTwo: React.FC = () => {
  const classes = useStyles()
  return (
    <Section>
      <div className={classes.wrapper}>
        <img
          className={classes.img}
          src="/assets/feature2.jpg"
          alt="3d tile with metamask, sign in with apple, wallet connect logos"
        />
        <Grid
          className={classes.titleContainer}
          alignItems="center"
          container
          xs={12}
          spacing={2}
        >
          <Grid item className={classes.title} xs={12}>
            <Title>
              <Trans>Bridging users of today and tomorrow.</Trans>
            </Title>
          </Grid>
          <Grid item className={classes.text} xs={12}>
            <Typography variant="h3">
              <Trans>
                Distributed networks distributes the costs; that means you get
                high reliability for cheaper. Sign in via email or crypto wallet
                so you can maximize your privacy without sacrificing
                convenience.
              </Trans>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Section>
  )
}

export default FeatureTwo
