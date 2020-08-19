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

interface OwnProps {
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
  onClick?: () => void
}

const Typography: React.SFC<OwnProps> = ({
  variant = "body1",
  component = "span",
  className,
  onClick,
  children,
}: OwnProps) => {
  const classes = useStyles()
  const Component = component
    ? component
    : variant
    ? VariantMapping[variant]
    : "span"
  return (
    <Component
      onClick={() => (onClick ? onClick() : null)}
      className={clsx(classes.root, className, classes[variant])}
    >
      {children}
    </Component>
  )
  // switch (component) {
  //   case "h1":
  //     return (
  //       <h1
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h1>
  //     )
  //   case "h2":
  //     return (
  //       <h2
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h2>
  //     )
  //   case "h3":
  //     return (
  //       <h3
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h3>
  //     )
  //   case "h4":
  //     return (
  //       <h4
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h4>
  //     )
  //   case "h5":
  //     return (
  //       <h5
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h5>
  //     )
  //   case "h6":
  //     return (
  //       <h6
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </h6>
  //     )
  //   case "span":
  //     return (
  //       <span
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </span>
  //     )
  //   case "p":
  //     return (
  //       <p
  //         onClick={() => (onClick ? onClick() : null)}
  //         className={clsx(classes.root, className, classes[variant])}
  //       >
  //         {children}
  //       </p>
  //     )
  // }
}

export default Typography
