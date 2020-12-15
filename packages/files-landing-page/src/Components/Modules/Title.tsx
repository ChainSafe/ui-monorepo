import React, { ReactNode } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"

type TitleProps = {
  children?: ReactNode
}

const useStyles = makeStyles(({ constants, palette, breakpoints }: ITheme) => {
  return createStyles({
    title: {
      fontSize: "64px",
      fontFamily: "'Archivo', sans-serif",
      fontWeight: "bold",
      lineHeight: "72px",
      margin: `${constants.generalUnit * 6} 0 ${constants.generalUnit * 2} 0`,
      color: palette.common.white.main,
      [breakpoints.down("md")]: {
        fontSize: "30px",
        lineHeight: "38px",
      },
      [breakpoints.down("xs")]: {
        fontSize: "20px",
        lineHeight: "28px",
      },
      "& > span": {
        fontFamily: "'Archivo', sans-serif",
      }
    },
  })
})

const Title: React.FC = ({ children }: TitleProps) => {
  const classes = useStyles()
  return <Typography className={classes.title}>{children}</Typography>
}

export default Title
