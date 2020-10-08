import React from "react"
import { Grid, Button, Typography } from "@imploy/common-components"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: 20,
      marginBottom: 160,
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
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
    },
  }),
)

const PlanView: React.FC = () => {
  const classes = useStyles()

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
                className={classes.margins}
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
                {/* <div>
                  <Typography>5.2 GB of free space</Typography>
                  <br />
                  <Typography>TODO: Progress bar</Typography>
                </div> */}
                <Button disabled variant="outline">
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
