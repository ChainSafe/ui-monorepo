import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
    },
    h1: {
      ...theme.typography.h1,
    },
    h2: {
      ...theme.typography.h2,
    },
    h3: {
      ...theme.typography.h3,
    },
    h4: {
      ...theme.typography.h4,
    },
    h5: {
      ...theme.typography.h5,
    },
    h6: {
      ...theme.typography.h6,
    },
    subtitle1: {
      ...theme.typography.subtitle1,
    },
    subtitle2: {
      ...theme.typography.subtitle2,
    },
    body1: {
      ...theme.typography.body1,
    },
    body2: {
      ...theme.typography.body2,
    },
    caption: {
      ...theme.typography.caption,
    },
    button: {
      ...theme.typography.button,
    },
  }),
)

const VariantMapping = {
  h1: "h2",
  h2: "h2",
  h3: "h2",
  h4: "h2",
  h5: "h2",
  h6: "h2",
  subtitle1: "h2",
  subtitle2: "h2",
  body1: "p",
  body2: "p",
  inherit: "span",
}

interface OwnProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

const Spinner: React.FC<OwnProps> = ({ className, ...rest }: OwnProps) => {
  return <></>
}

export default Spinner
