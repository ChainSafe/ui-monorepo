import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React from "react"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette }: ITheme) => {
    const strokeHeight = 2
    const defaultSize = 24
    return createStyles({
      root: {
        transitionDuration: `${animation.transform}ms`,
        padding: constants.generalUnit * 1.25,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& span": {
          position: "absolute",
          transitionDuration: `${animation.transform}ms`,
          borderRadius: strokeHeight,
          backgroundColor: palette.common.black.main,
        },
        "&.default": {
          "& span": {
            width: "100%",
            height: strokeHeight,
            transform: "translateY(-50%)",
            left: 0,
            "&:first-child": {
              top: `calc(50% - ${constants.generalUnit}px)`,
            },
            "&:nth-child(2)": {
              top: "50%",
            },
            "&:last-child": {
              top: `calc(50% + ${constants.generalUnit}px)`,
              width: "60%",
            },
          },
          "&:hover": {
            [breakpoints.up("sm")]: {
              "& span": {
                "&:last-child": {
                  width: "100%",
                },
              },
            },
          },
        },
        "&.active": {
          "& span": {
            width: "100%",
            height: strokeHeight,
            transform: "translateY(-50%)",
            left: 0,
            "&:first-child": {
              top: `calc(50% - ${constants.generalUnit}px)`,
            },
            "&:nth-child(2)": {
              top: "50%",
            },
            "&:last-child": {
              top: `calc(50% + ${constants.generalUnit}px)`,
            },
          },
          "&:hover": {
            [breakpoints.up("sm")]: {
              "& span": {
                "&:last-child": {
                  width: "60%",
                },
              },
            },
          },
        },

        // TODO: Add loading option
        // "&.loading": {
        //   "&:hover": {
        //      [breakpoints.up("sm")]: {

        //     }
        //   }
        // },
      },
      inner: {
        transitionDuration: `${animation.transform}ms`,
        position: "relative",
        width: defaultSize,
        height: defaultSize,
      },
    })
  },
)

interface IHamburgerMenu extends React.HTMLProps<HTMLDivElement> {
  variant: "default" | "active"
  // | "loading"
}

const HamburgerMenu: React.FC<IHamburgerMenu> = ({
  variant = "default",
  onClick,
}: IHamburgerMenu) => {
  const classes = useStyles()
  return (
    <section onClick={onClick} className={clsx(classes.root, variant)}>
      <div className={classes.inner}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  )
}

export default HamburgerMenu
