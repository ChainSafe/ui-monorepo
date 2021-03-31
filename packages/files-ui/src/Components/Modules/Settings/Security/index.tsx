import React from "react"
import { Grid, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, breakpoints, palette, typography }: CSFTheme) =>
  createStyles({
    text: {

    }
  })
)

interface SecurityProps {
  className?: string
}

const Security = ({ className }: SecurityProps) => {
  const classes = useStyles()

  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={8}>
        <div className={className}>
          <div id="security">
            <Typography
              variant="h4"
              component="h4"
              className={classes.text}
            >
              <Trans>Some text</Trans>
            </Typography>
            <div>
            </div>
          </div>
          {/* <div id="deletion" className={classes.bodyContainer}>
            <div className={classes.deletionBox}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.deletionMargins}
              >
                <Trans>Deletion</Trans>
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={classes.deletionMargins}
              >
                <Trans>
                  Deleting your account is irreversible. You will lose all your
                  data on files.
                </Trans>
              </Typography>
              <Button
                variant="outline"
                disabled
                className={classes.deletionMargins}
              >
                <Trans>Delete Account</Trans>
              </Button>
            </div>
          </div> */}
        </div>
      </Grid>
    </Grid>
  )
}

export default Security
