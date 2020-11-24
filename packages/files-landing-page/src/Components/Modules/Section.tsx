import React, { ReactNode } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"

type SectionProps = {
  children?: ReactNode
}

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) => {
  return createStyles({
    section: {
      background: "#141414",
      overflowX: "hidden",
      padding: "0",
      margin: "0 auto",
      position: "relative",
      maxWidth: `calc(100% - ${constants.generalUnit * 15}px)`,
      [breakpoints.up("xl")]: {
        padding: "5rem 0 ",
      },
      [breakpoints.down("md")]: {
        maxWidth: `calc(100% - ${constants.generalUnit * 2}px)`,
        paddingBottom: constants.generalUnit * 10,
        minHeight: "0",
      },
      [breakpoints.down("lg")]: {
        minHeight: "70vh",
      },
      [breakpoints.up("xl")]: {
        maxWidth: "2060px",
        minHeight: "80vh",
      },
      [breakpoints.up("3500")]: {
        maxWidth: "2560px",
        minHeight: "60vh",
      },
    },
  })
})

const Section = ({ children }: SectionProps) => {
  const classes = useStyles()
  return <section className={classes.section}>{children}</section>
}

export default Section
