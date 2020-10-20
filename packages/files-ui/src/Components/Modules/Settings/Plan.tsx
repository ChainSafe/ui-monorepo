import React from "react"
import {
  Grid,
  Button,
  Typography,
  ProgressBar,
  formatBytes,
} from "@imploy/common-components"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"
import clsx from "clsx"
import { FREE_PLAN_LIMIT } from "../../../Utils/Constants"
import { useDrive } from "../../../Contexts/DriveContext"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: 20,
      marginBottom: 160,
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
      [theme.breakpoints.down("sm")]: {
        borderBottom: "none",
      },
    },
    storageBox: {
      maxWidth: 400,
    },
    margins: {
      marginBottom: theme.constants.generalUnit * 2,
    },
    essentials: {
      fontWeight: 600,
      marginBottom: theme.constants.generalUnit * 2,
    },
    essentialContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      [theme.breakpoints.down("sm")]: {
        flexFlow: "column",
        alignItems: "flex-start",
        width: 300,
      },
    },
    subtitle: {
      color: theme.palette.additional["gray"][8],
      [theme.breakpoints.down("sm")]: {
        fontSize: 16,
        lineHeight: "22px",
      },
    },
    spaceUsedBox: {
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.constants.generalUnit,
        width: "inherit",
      },
    },
    spaceUsedMargin: {
      marginBottom: theme.constants.generalUnit,
    },
    changePlanButton: {
      width: "inherit",
    },
  }),
)

const PlanView: React.FC = () => {
  const classes = useStyles()
  const { spaceUsed } = useDrive()

  return (
    <Grid container>
      <Grid item xs={12} sm={8} md={6}>
        <div className={classes.container}>
          <div id="storage" className={classes.bodyContainer}>
            <div className={classes.storageBox}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.margins}
              >
                Storage Plan
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={clsx(classes.margins, classes.subtitle)}
              >
                Lorem ipsum aenean et rutrum magna. Morbi nec placerat erat.
                Nunc elementum sed libero sit amet convallis. Quisque non arcu
                vitae ex fringilla molestie.
              </Typography>
            </div>
            <div>
              <Typography
                variant="h5"
                component="h5"
                className={classes.essentials}
              >
                Essentials - Free
              </Typography>
              <div className={classes.essentialContainer}>
                <div className={classes.spaceUsedBox}>
                  <Typography
                    variant="body2"
                    className={classes.spaceUsedMargin}
                    component="p"
                  >{`${formatBytes(spaceUsed)} of ${formatBytes(
                    FREE_PLAN_LIMIT,
                  )} used`}</Typography>
                  <ProgressBar
                    className={classes.spaceUsedMargin}
                    progress={(spaceUsed / FREE_PLAN_LIMIT) * 100}
                    size="small"
                  />
                </div>
                <Button
                  disabled
                  variant="outline"
                  className={classes.changePlanButton}
                >
                  Change plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default PlanView
