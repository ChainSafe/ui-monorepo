import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(({ typography, overrides }: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
      ...overrides?.Typography?.root
    },
    h1: {
      ...typography?.h1,
      ...overrides?.Typography?.h1
    },
    h2: {
      ...typography?.h2,
      ...overrides?.Typography?.h2
    },
    h3: {
      ...typography?.h3,
      ...overrides?.Typography?.h3
    },
    h4: {
      ...typography?.h4,
      ...overrides?.Typography?.h4
    },
    h5: {
      ...typography?.h5,
      ...overrides?.Typography?.h5
    },
    h6: {
      ...typography?.h6,
      ...overrides?.Typography?.h6
    },
    subtitle1: {
      ...typography?.subtitle1,
      ...overrides?.Typography?.subtitle1
    },
    subtitle2: {
      ...typography?.subtitle2,
      ...overrides?.Typography?.subtitle2
    },
    body1: {
      ...typography?.body1,
      ...overrides?.Typography?.body1
    },
    body2: {
      ...typography?.body2,
      ...overrides?.Typography?.body2
    },
    caption: {
      ...typography?.caption,
      ...overrides?.Typography?.caption
    },
    button: {
      ...typography?.button,
      ...overrides?.Typography?.button
    }
  })
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
  inherit: "span"
}

interface OwnProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  children?: ReactNode | ReactNode[];
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
    | "button";
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
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
