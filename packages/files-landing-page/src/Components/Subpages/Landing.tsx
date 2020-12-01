import React, { useState, useEffect } from 'react'
import { Grid } from "@chainsafe/common-components";
import Section from "../Modules/Section";
import Title from "../Modules/Title";
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme";
import { t, Trans } from '@lingui/macro';



const useStyles = makeStyles(({ constants, palette, zIndex, breakpoints }: ITheme) => {
  return createStyles({
    wrapper: {
      maxWidth: "2560px",
      display: "flex",
      paddingTop: "5vh",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      [breakpoints.up('xl')]: {
        position: "relative",
        left: "50%",
        transform: "translate(-50%)",
      }
    },
    img: {
      zIndex: zIndex?.layer0,
      width: "100%",
      [breakpoints.between(800, 1400)]: {
        marginTop: "10vh",
        bottom: 0,
      },
      [breakpoints.down('md')]: {
        position: "absolute",
        bottom: 0,
      },
    },
    title: {
      position: "relative",
      top: 100,
      width: "100%",
      display: "flex",
      justify: "center",
      alignItems: "center",
      zIndex: zIndex?.layer3,
      [breakpoints.down('1370')]: {
        width: "70%",
      },
      [breakpoints.down('sm')]: {
        top: 120,
      }
    },
    button: {
      zIndex: zIndex?.layer3,
      fontSize: "25px",
      color: palette.additional["gray"][6],
      position: "relative",
      padding: "1.5rem 0",
      '&:hover': {
        color: palette.additional["gray"][8],
        transition: "ease-in 0.2s"
      },
      [breakpoints.down('1400')]: {
        position: "absolute",
        left: 0,
      },
      [breakpoints.down('md')]: {
        fontSize: constants.generalUnit * 2,
      },
      [breakpoints.down('sm')]: {
        padding: "1rem 0",
      },
    },
    buttonWrapper: {
      display: "flex",
    },
  })
})

const Landing: React.FC = () => {
  const wordChoices = [t`faster`, t`easier`, t`better`, t`faster`, t`safer`];
  const [words, setWord] = useState(t`easier`);

  useEffect(() => {
    const selectedWord = setInterval(() => {
      setWord(wordChoices[Math.floor(Math.random() * wordChoices.length)])
    }, 2500)
    return () => clearInterval(selectedWord)
  })

  const classes = useStyles()
  return (
    <Section>
      <div className={classes.wrapper}>
        <Grid item xs={12} className={classes.title}>
          <Title><Trans>Privacy-first cloud storage just got </Trans> <span>{words}</span>. </Title>
          <div className={classes.buttonWrapper}>
            <a className={classes.button} target="__blank" rel="noopenernoreferrer" href="https://app.files.chainsafe.io">Sign up</a>
          </div>
        </Grid>
        <img className={classes.img} src="/assets/box.png" alt="Metal box dimly lit with ChainSafe Logo embossed on it"></img>
      </div>
    </Section>
  )
}

export default Landing