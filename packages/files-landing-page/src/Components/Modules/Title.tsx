import React, { ReactNode } from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { Typography } from "@imploy/common-components"

type TitleProps = {
  children?: ReactNode
}

const useStyles = makeStyles(({ constants, palette, breakpoints }: ITheme) => {
  return createStyles({
    title: {
      fontSize: "64px",
      fontWeight: "bold",
      lineHeight: "72px",
      margin: `${constants.generalUnit * 6} 0 ${constants.generalUnit * 2} 0`,
      color: palette.common.white.main,
      [breakpoints.down("md")]: {
        fontSize: "40px",
        lineHeight: "48px",
      },
      [breakpoints.down("xs")]: {
        fontSize: "20px",
        lineHeight: "28px",
      },
    },
  })
})

const Title: React.FC = ({ children }: TitleProps) => {
  const classes = useStyles()
  return <Typography className={classes.title}>{children}</Typography>
}

export default Title
