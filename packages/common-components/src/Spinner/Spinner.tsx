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
