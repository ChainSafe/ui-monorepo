import React, { ReactNode, useState } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalRightIcon } from "../Icons"

const useStyles = makeStyles(
  ({ animation, constants, palette, overrides }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        position: "relative",
        "&.basic": {
          border: `1px solid ${palette.additional["gray"][5]}`,
          ...overrides?.ExpansionPanel?.basic,
        },
        "&.borderless": {
          ...overrides?.ExpansionPanel?.borderless,
        },
        ...overrides?.ExpansionPanel?.root,
      },
      icon: {
        "& svg": {
          width: constants.generalUnit,
          height: constants.generalUnit * 1.5,
          fill: palette.additional["gray"][9],
          transitionDuration: `${animation.transform}ms`,
        },
        ...overrides?.ExpansionPanel?.icon,
      },
      heading: {
        backgroundColor: palette.additional["gray"][2],
        padding: `${constants.generalUnit * 1.5}px ${
          constants.generalUnit * 2
        }px`,
        color: palette.additional["gray"][9],
        cursor: "pointer",
        "&.basic": {
          backgroundColor: palette.additional["gray"][2],
          ...overrides?.ExpansionPanel?.heading?.basic?.root,
          "&.active": {
            ...overrides?.ExpansionPanel?.heading?.basic?.active,
          },
        },
        "&.borderless": {
          ...overrides?.ExpansionPanel?.heading?.borderless?.root,
          "&.active": {
            ...overrides?.ExpansionPanel?.heading?.borderless?.active,
          },
        },
        "&.active": {
          "& svg": {
            transform: "rotateZ(90deg)",
          },
          ...overrides?.ExpansionPanel?.heading?.active,
        },
        ...overrides?.ExpansionPanel?.heading?.root,
      },
      content: {
        overflow: "hidden",
        color: palette.additional["gray"][8],
        height: 0,
        padding: `0 ${constants.generalUnit * 2}px`,
        transitionDuration: `${animation.transform}ms`,
        // opacity: 0,
        "&.basic": {
          backgroundColor: palette.common.white.main,
          borderTop: `0px solid ${palette.additional["gray"][5]}`,
          "&.active": {
            borderTop: `1px solid ${palette.additional["gray"][5]}`,
            ...overrides?.ExpansionPanel?.content?.basic?.active,
          },
          ...overrides?.ExpansionPanel?.content?.basic?.root,
        },
        "&.active": {
          padding: `${constants.generalUnit * 2}px ${
            constants.generalUnit * 2
          }px`,
          opacity: 1,
          height: "auto",
          ...overrides?.ExpansionPanel?.content?.active,
        },
        ...overrides?.ExpansionPanel?.content?.root,
      },
    }),
)

export interface IExpansionPanelProps {
  header: string
  children?: ReactNode | ReactNode[] | null
  active?: boolean
  variant?: "basic" | "borderless"
  toggle?: (state: boolean) => void
}

const ExpansionPanel: React.FC<IExpansionPanelProps> = ({
  children,
  header,
  variant = "basic",
  toggle,
  active,
}: IExpansionPanelProps) => {
  const classes = useStyles()
  const [activeInternal, setActive] = useState(!!active)
  const handleToggle = () => {
    toggle && toggle(!activeInternal)
    setActive(!activeInternal)
  }
  return (
    <div className={clsx(classes.root, variant)}>
      <section
        onClick={() => handleToggle()}
        className={clsx(classes.heading, variant, {
          ["active"]: active != undefined ? active : activeInternal,
        })}
      >
        <DirectionalRightIcon className={classes.icon} />
        <Typography>{header}</Typography>
      </section>
      <section
        className={clsx(classes.content, variant, {
          ["active"]: active != undefined ? active : activeInternal,
        })}
      >
        {children}
      </section>
    </div>
  )
}

export default ExpansionPanel
