import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Grid, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ palette, constants, breakpoints }: ITheme) => {
  return createStyles({
    wrapper: {
      [breakpoints.up("lg")]: {
        borderTop: `1px solid ${palette.additional["gray"][8]}`,
      },
    },
    root: {
      padding: "2rem 0 2rem 0",
      [breakpoints.up("xl")]: {
        maxWidth: "2560px",
        padding: `80px 72px 80px 72px`,
        position: "relative",
        left: "50%",
        transform: "translate(-50%)",
      },
      [breakpoints.up("3800")]: {
        maxWidth: "2560px",
        padding: `80px 72px 80px 72px`,
        position: "relative",
        left: "65%",
        transform: "translate(-50%)",
      },
    },
    linkWrapper: {
      display: "flex",
      flexGrow: 0,
      flexBasis: "300px",
      color: palette.additional["gray"][3],
      margin: "0 0 1rem 0",
      "&:hover": {
        color: palette.additional["gray"][8],
        transition: "ease-in 0.2s",
      },
      "& a": {
        color: palette.additional["gray"][5],
        textDecoration: "none",
        "&:hover": {
          color: palette.additional["gray"][8],
          transition: "ease-in 0.2s",
        },
      },
      [breakpoints.down("sm")]: {
        flexGrow: 1,
        flexBasis: "100%",
        alignItems: "center",
      },
      [breakpoints.down("xl")]: {
        margin: "2rem",
      },
      [breakpoints.up("xl")]: {
        flexBasis: "400px",
      },
    },
    header: {
      paddingBottom: constants.generalUnit * 3,
      flex: 0,
    },
    item: {
      flex: 0,
      paddingBottom: constants.generalUnit * 2,
    },
    hr: {
      padding: constants.generalUnit,
      marginBottom: constants.generalUnit * 2,
      borderBottom: `1px solid ${palette.additional["gray"][8]}`,
      width: "100%",
      [breakpoints.up("lg")]: {
        borderBottom: "none",
        width: "100%",
      },
    },
    smalltextContainer: {
      [breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        marginBottom: constants.generalUnit,
      },
    },
    smalltext: {
      color: palette.additional["gray"][8],
    },
    copyright: {
      position: "absolute",
      left: "2%",
      color: palette.additional["gray"][8],
      [breakpoints.down("md")]: {
        width: "90%",
        textAlign: "left",
        left: 20,
        fontSize: "9px",
      },
      [breakpoints.up("xl")]: {
        textAlign: "left",
        left: "2.8%",
        fontSize: "1rem",
        color: palette.additional["gray"][7],
      },
    },
  })
})

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <footer className={classes.root}>
        <Grid container>
          <Grid item className={classes.linkWrapper}>
            <Grid item className={classes.header}>
              <Typography variant="h2">
                <Trans>Product</Trans>
              </Typography>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https://app.files.chainsafe.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Typography variant="h4">Launch App</Typography>
              </a>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https://files.chainsafe.io/terms-of-service"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Typography variant="h4">Terms of Service</Typography>
              </a>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https://files.chainsafe.io/privacy-policy"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Typography variant="h4">Privacy Policy</Typography>
              </a>
            </Grid>
          </Grid>
          <Grid item className={classes.linkWrapper}>
            <Grid item className={classes.header}>
              <Typography variant="h2">
                <Trans>Company</Trans>
              </Typography>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https:/chainsafe.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Typography variant="h4">Visit Site</Typography>
              </a>
            </Grid>
          </Grid>
          <Grid item className={classes.linkWrapper}>
            <Grid item className={classes.header}>
              <Typography variant="h2">
                <Trans>Community</Trans>
              </Typography>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https://twitter.com/ChainSafeth"
                target="__blank"
                rel="noopener noreferrer"
              >
                <Typography variant="h4">
                  <Trans>Twitter</Trans>
                </Typography>
              </a>
            </Grid>
            <Grid item className={classes.item}>
              <a
                href="https://github.com/ChainSafe"
                target="__blank"
                rel="noopener noreferrer"
              >
                <Typography variant="h4">
                  <Trans>Github</Trans>
                </Typography>
              </a>
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.hr}></div>
        <Grid
          container
          xs={12}
          md={4}
          xl={4}
          justifyContent="flex-start"
          spacing={2}
          className={classes.smalltextContainer}
        >
          {/* <Grid item>
          <Typography variant="h5"><a href="/" className={classes.smalltext}>Privacy Policy</a></Typography>
        </Grid> */}
          <Grid item>
            {/* <Typography variant="h5"><a href="/" className={classes.smalltext}>Terms of Use</a></Typography> */}
            <Typography variant="h5" className={classes.copyright}>
              &copy; {currentYear} ChainSafe Systems, All Rights Reserved.
            </Typography>
          </Grid>
        </Grid>
      </footer>
    </div>
  )
}
export default Footer
