import React from "react"
import {
  Grid,
  Typography
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import SubscriptionWidget from "./Plan/SubscriptionWidget"

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
  return (
    <Grid container>
      <Grid
        item
        xs={12}
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
                <Trans>
                  Lorem ipsum aenean et rutrum magna. Morbi nec placerat erat.
                  Nunc elementum sed libero sit amet convallis. Quisque non arcu
                  vitae ex fringilla molestie.
                </Trans>
              </Typography>
            </div>
            <SubscriptionWidget />
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default PlanView
