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
import { useFiles } from "../../../Contexts/FilesContext"
import { t, Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(({ constants, palette, breakpoints }: ITheme) =>
  createStyles({
    container: {
      margin: constants.generalUnit * 4,
      marginBottom: 160
    },
    storageBox: {
      maxWidth: 400
    },
    margins: {
      marginBottom: constants.generalUnit * 2
    },
    storagePlan: {
      marginTop: constants.generalUnit * 4
    },
    earlyAdopter: {
      fontWeight: "bold"
    },
    essentialContainer: {
      width: 300
    },
    subtitle: {
      color: palette.additional["gray"][8],
      [breakpoints.down("md")]: {
        fontSize: 16,
        lineHeight: "22px"
      }
    },
    spaceUsedBox: {
      marginTop: constants.generalUnit * 3,
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit,
        width: "inherit"
      }
    },
    spaceUsedMargin: {
      marginBottom: constants.generalUnit
    },
    changePlanButton: {
      marginTop: constants.generalUnit * 2,
      width: "inherit"
    },
    link: {
      textDecoration: "none"
    }
  })
)

const PlanView: React.FC = () => {
  const classes = useStyles()
  const { spaceUsed } = useFiles()

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
      >
        <div className={classes.container}>
          <div className={classes.storageBox}>
            <Typography
              variant="h3"
              component="h3"
              className={clsx(classes.margins)}
            >
              <Trans>Subscription Plan</Trans>
            </Typography>
            <Typography
              variant="h4"
              component="h4"
              className={clsx(classes.margins, classes.storagePlan)}
            >
              <Trans>Storage Plan</Trans>
            </Typography>
            <Typography
              variant="h5"
              component="h5"
              className={clsx(classes.earlyAdopter)}
            >
              {t`Early Adopter: Free up to ${formatBytes(
                FREE_PLAN_LIMIT
              )}`}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={clsx(classes.margins, classes.subtitle)}
            >
              {t`Your first ${formatBytes(
                FREE_PLAN_LIMIT
              )} are free, and you’ll get a discount on our monthly plan once you need more than that`}.
            </Typography>
          </div>
          <div className={classes.essentialContainer}>
            <div className={classes.spaceUsedBox}>
              <Typography
                variant="body1"
                className={classes.spaceUsedMargin}
                component="p"
              >{t`${formatBytes(spaceUsed)} of ${formatBytes(
                  FREE_PLAN_LIMIT
                )} used (${Math.ceil(spaceUsed / FREE_PLAN_LIMIT * 100)}%)`}
              </Typography>
              <ProgressBar
                className={classes.spaceUsedMargin}
                progress={(spaceUsed / FREE_PLAN_LIMIT) * 100}
                size="small"
              />
            </div>
            <Link
              className={classes.link}
              to={ROUTE_LINKS.Plans}
            >
              <Button
                variant="primary"
                className={classes.changePlanButton}
              >
                <Trans>Buy more storage</Trans>
              </Button>
            </Link>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default PlanView
