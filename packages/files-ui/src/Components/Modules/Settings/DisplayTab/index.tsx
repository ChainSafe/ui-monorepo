import React from "react"
import { Grid, Typography, RadioInput, Divider } from "@chainsafe/common-components"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../../../Themes/types"
import clsx from "clsx"
import LanguageSelection from "./LanguageSelection"

const useStyles = makeStyles(({ constants, breakpoints, palette, typography }: CSFTheme) =>
  createStyles({
    container: {
      [breakpoints.down("md")]: {
        paddingRight: constants.generalUnit * 2,
        paddingLeft: constants.generalUnit * 2
      }
    },
    profileBox: {
      maxWidth: 420
    },
    themeBox: {
      height: 87,
      borderRadius: 4,
      paddingLeft: 20,
      paddingTop: 14,
      margin: "6px 0",
      [breakpoints.down("sm")]: {
        width: "100%"
      },
      cursor: "pointer",
      "&:last-child": {
        [breakpoints.up("sm")]: {
          marginLeft: constants.generalUnit
        }
      }
    },
    themeBoxDark: {
      ...constants.settingsPage.darkSwitch
    },
    themeBoxLight: {
      ...constants.settingsPage.lightSwitch
    },
    themeSubtitle: {
      ...typography.body1,
      color: palette.additional.gray[8]
    },
    sectionSubHeading: {
      fontWeight: 400,
      marginTop: 25,
      marginBottom: 14,
      marginLeft: constants.generalUnit * 2
    },
    mainHeader: {
      fontSize: 28,
      marginBottom: constants.generalUnit * 2,
      paddingLeft: constants.generalUnit * 2
    },
    paddedBox: {
      paddingLeft: constants.generalUnit * 2
    },
    paddedBox2: {
      paddingLeft: constants.generalUnit
    }
  })
)

const DisplayView = () => {
  const { themeKey, setTheme } = useThemeSwitcher()
  const classes = useStyles()

  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <div
          className={classes.container}
          id="display"
          data-cy="label-display-header"
        >
          <Typography
            variant="h3"
            component="h3"
            className={classes.mainHeader}
          >
            <Trans>Display</Trans>
          </Typography>
          <Divider />
          <div className={classes.profileBox}>
            <Typography
              variant='h4'
              component='h4'
              className={classes.sectionSubHeading}
            >
              <Trans>Theme</Trans>
            </Typography>
            <Grid
              container
              className={classes.paddedBox2}>
              <Grid
                item
                xs={12}
                lg={6}
              >
                <label className={clsx(classes.themeBox, classes.themeBoxDark)}>
                  <RadioInput
                    testId="dark-theme"
                    value='dark'
                    label={t`Dark Theme`}
                    onChange={(e) => setTheme(e.target.value)}
                    checked={themeKey === "dark"}
                  />
                  {themeKey === "dark" && <Typography className={classes.themeSubtitle}>
                    <Trans>What a fine night it is.</Trans>
                  </Typography>}
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                lg={6}
              >
                <label className={clsx(classes.themeBox, classes.themeBoxLight)}>
                  <RadioInput
                    testId="light-theme"
                    value='light'
                    label={t`Light Theme`}
                    onChange={(e) => setTheme(e.target.value)}
                    checked={themeKey === "light"} />
                  {themeKey === "light" && <Typography className={classes.themeSubtitle}>
                    <Trans>What a fine day it is.</Trans>
                  </Typography>}
                </label>
              </Grid>
            </Grid>
          </div>
          <Typography
            variant='h4'
            component='h4'
            className={classes.sectionSubHeading}
          >
            <Trans>Language</Trans>
          </Typography>
          <div className={classes.paddedBox}>
            <LanguageSelection />
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default DisplayView
