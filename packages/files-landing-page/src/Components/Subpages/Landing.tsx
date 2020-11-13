import React, { useState, useEffect } from "react"
import { Grid } from "@imploy/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(({ zIndex, breakpoints }: ITheme) => {
  return createStyles({
    img: {
      zIndex: zIndex?.layer0,
      width: "100%",
      [breakpoints.between(800, 1400)]: {
        marginTop: "20vh",
        bottom: 0,
      },
      [breakpoints.down("md")]: {
        position: "absolute",
        bottom: 0,
      },
    },
    title: {
      position: "absolute",
      top: 200,
      width: "100%",
      display: "flex",
      justify: "center",
      alignItems: "center",
      zIndex: zIndex?.layer3,
      [breakpoints.down("1370")]: {
        width: "70%",
      },
      [breakpoints.down("sm")]: {
        top: 120,
      },
    },
  })
})

const Landing: React.FC = () => {
  const wordChoices = [t`faster`, t`easier`, t`better`, t`faster`, t`safer`]
  const [words, setWord] = useState(t`easier`)

  useEffect(() => {
    const selectedWord = setInterval(() => {
      setWord(wordChoices[Math.floor(Math.random() * wordChoices.length)])
    }, 2500)
    return () => clearInterval(selectedWord)
  })

  const classes = useStyles()
  return (
    <Section>
      <Grid
        container
        xs={12}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} className={classes.title}>
          <Title>
            <Trans>Privacy-first cloud storage just got </Trans>{" "}
            <span>{words}</span>.{" "}
          </Title>
        </Grid>
      </Grid>
      <img
        className={classes.img}
        src="/assets/box.png"
        alt="Metal box dimly lit with ChainSafe Logo embossed on it"
      ></img>
    </Section>
  )
}

export default Landing
