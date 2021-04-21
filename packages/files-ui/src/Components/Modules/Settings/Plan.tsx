import React from "react"
import {
  Grid,
  Button,
  Typography,
  ProgressBar,
  formatBytes,
  Link
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { FREE_PLAN_LIMIT } from "../../../Utils/Constants"
import { useDrive } from "../../../Contexts/DriveContext"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: 20,
      marginBottom: 160
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
      [theme.breakpoints.down("md")]: {
        borderBottom: "none"
      }
    },
    storageBox: {
      maxWidth: 400
    },
    margins: {
      marginBottom: theme.constants.generalUnit * 2
    },
    essentials: {
      fontWeight: 600,
      marginBottom: theme.constants.generalUnit * 2
    },
    essentialContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      [theme.breakpoints.down("md")]: {
        flexFlow: "column",
        alignItems: "flex-start",
        width: 300
      }
    },
    subtitle: {
      color: theme.palette.additional["gray"][8],
      [theme.breakpoints.down("md")]: {
        fontSize: 16,
        lineHeight: "22px"
      }
    },
    spaceUsedBox: {
      [theme.breakpoints.down("md")]: {
        marginBottom: theme.constants.generalUnit,
        width: "inherit"
      }
    },
    spaceUsedMargin: {
      marginBottom: theme.constants.generalUnit
    },
    changePlanButton: {
      width: "inherit"
    },
    link: {
      textDecoration: "none"
    }
  })
)

const PlanView: React.FC = () => {
  const classes = useStyles()
  const { spaceUsed } = useDrive()

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
      >
        <div className={classes.container}>
          <div
            id="storage"
            className={classes.bodyContainer}
          >
            <div className={classes.storageBox}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.margins}
              >
                <Trans>Storage Plan</Trans>
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={clsx(classes.margins, classes.subtitle)}
              >
                <Trans id="storage-plan-desc">
                  Lorem ipsum aenean et rutrum magna. Morbi nec placerat erat.
                  Nunc elementum sed libero sit amet convallis. Quisque non arcu
                  vitae ex fringilla molestie.
                </Trans>
              </Typography>
            </div>
            <div>
              <Typography
                variant="h5"
                component="h5"
                className={classes.essentials}
              >
                <Trans>Essentials - Free</Trans>
              </Typography>
              <div className={classes.essentialContainer}>
                <div className={classes.spaceUsedBox}>
                  <Typography
                    variant="body2"
                    className={classes.spaceUsedMargin}
                    component="p"
                  >{`${formatBytes(spaceUsed)} of ${formatBytes(
                      FREE_PLAN_LIMIT
                    )} used`}</Typography>
                  <ProgressBar
                    className={classes.spaceUsedMargin}
                    progress={(spaceUsed / FREE_PLAN_LIMIT) * 100}
                    size="small"
                  />
                </div>
                <Link className={classes.link}
                  to={ROUTE_LINKS.PurchasePlan}>
                  <Button
                    variant="outline"
                    className={classes.changePlanButton}
                  >
                    Change Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default PlanView
