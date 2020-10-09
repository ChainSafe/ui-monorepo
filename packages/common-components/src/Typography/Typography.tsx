import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
    },
    h1: {
      ...theme.typography?.h1,
    },
    h2: {
      ...theme.typography?.h2,
    },
    h3: {
      ...theme.typography?.h3,
    },
    h4: {
      ...theme.typography?.h4,
    },
    h5: {
      ...theme.typography?.h5,
    },
    h6: {
      ...theme.typography?.h6,
    },
    subtitle1: {
      ...theme.typography?.subtitle1,
    },
    subtitle2: {
      ...theme.typography?.subtitle2,
    },
    body1: {
      ...theme.typography?.body1,
    },
    body2: {
      ...theme.typography?.body2,
    },
    caption: {
      ...theme.typography?.caption,
    },
    button: {
      ...theme.typography?.button,
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
  children?: ReactNode | ReactNode[]
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p"
}

const Typography: React.FC<OwnProps> = ({
  variant = "body1",
  component = "span",
  className,
  children,
  ...rest
}: OwnProps) => {
  const classes = useStyles()
  const Component = component
    ? component
    : variant
    ? VariantMapping[variant]
    : "span"
  return (
    <Component
      className={clsx(classes.root, className, classes[variant])}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Typography
export { OwnProps }
