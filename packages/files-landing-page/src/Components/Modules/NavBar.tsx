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
        background: palette.additional["gray"][3],
        height: constants.generalUnit * 9,
        position: "fixed",
        padding: "1rem",
        zIndex: zIndex?.layer4,
        [breakpoints.down("sm")]: {
          padding: "none",
        },
        [breakpoints.up("xl")]: {
          height: constants.generalUnit * 9,
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
        color: palette.common.black.main,
        textDecoration: "none",
        "&:hover": {
          color: palette.additional["gray"][7],
          transition: "ease-in 0.2s",
        },
      },
      brandName: {
        [breakpoints.down("sm")]: {
          display: "none",
        },
      },
      separator: {
        color: palette.common.black.main,
      },
      textWrapper: {
      },
    })
  },
)

const NavBar: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container xs={12}>
        <Grid item justifyContent="center" alignItems="flex-start">
          <Grid container alignItems="center" className={classes.textWrapper}>
            <img
              className={classes.logo}
              src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1617731776/files.chainsafe.io/csfAsset_27_20x_tt5pi4.png"
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
    </div>
  )
}

export default NavBar
