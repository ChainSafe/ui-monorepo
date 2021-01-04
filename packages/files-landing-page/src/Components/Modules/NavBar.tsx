import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Grid, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ breakpoints, palette, zIndex, constants }: ITheme) => {
    return createStyles({
      container: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        background: "#141414",
        height: constants.generalUnit * 10,
        position: "fixed",
        borderBottom: `1px solid ${palette.additional["gray"][8]}`,
        padding: "0 2rem",
        zIndex: zIndex?.layer4,
        [breakpoints.down("sm")]: {
          padding: "none",
        },
        [breakpoints.up("xl")]: {
          height: constants.generalUnit * 12,
          width: "100vw",
          left: "50%",
          transform: "translateX(-50%)",
        },
      },
      logo: {
        width: constants.generalUnit * 4,
        height: constants.generalUnit * 4,
        margin: constants.generalUnit,
      },
      navlink: {
        color: palette.common.white.main,
        textDecoration: "none",
        fontFamily: "'Archivo', sans-serif",
        "&:hover": {
          color: palette.additional["gray"][7],
          transition: "ease-in 0.2s",
        },
        "& > span": {
          fontFamily: "'Archivo', sans-serif",
        },
      },
      brandName: {
        [breakpoints.down("sm")]: {
          display: "none",
        },
      },
      separator: {
        color: palette.common.white.main,
      },
      textWrapper: {
        "& > span": {
          fontFamily: "'Archivo', sans-serif",

        }
      },
    })
  },
)

const NavBar: React.FC = () => {
  const classes = useStyles()
  return (
    <nav className={classes.container}>
      <Grid container xs={12}>
        <Grid item justifyContent="center" alignItems="flex-start">
          <Grid container alignItems="center" className={classes.textWrapper}>
            <img
              className={classes.logo}
              src="/ChainSafe_Logo.png"
              alt="chainsafe brand logo"
            />
            <Typography variant="h4" className={classes.brandName}>
              <a href="/" className={classes.navlink}>
                ChainSafe Files
              </a>
            </Typography>
          </Grid>
        </Grid>
        <Grid item justifyContent="center" alignItems="flex-end">
          <Typography variant="h4" className={classes.textWrapper}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.files.chainsafe.io/"
              className={classes.navlink}
            >
              <Trans>Launch App </Trans>
            </a>
          </Typography>
        </Grid>
      </Grid>
    </nav>
  )
}

export default NavBar
