import React, { ReactNode } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(({ palette }: ITheme) => {
  return createStyles({
    main: {
      color: palette.additional["gray"][6],
      maxWidth: "400px",
    },
  })
})

type ParagraphProps = {
  children?: ReactNode
  variant?: string
}

const Paragraph: React.FC = ({ children }: ParagraphProps) => {
  const classes = useStyles()
  return (
    <Typography variant="h4" className={classes.main}>
      {children}
    </Typography>
  )
}

export default Paragraph
