import React from "react"
import {
  TextInput,
  Grid,
  Button,
  Typography,
  Divider,
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-themes"
import { LockIcon } from "@chainsafe/common-components"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      paddingTop: 40,
    },
    boxContainer: {
      marginBottom: theme.constants.generalUnit * 4,
    },
    labelContainer: {
      marginBottom: theme.constants.generalUnit,
    },
    label: {
      marginBottom: theme.constants.generalUnit * 2,
      fontSize: 20,
    },
    button: {
      backgroundColor: theme.palette.common.black.main,
      color: theme.palette.common.white.main,
      width: 200,
      margin: `0px ${theme.constants.generalUnit * 0.5}px ${
        theme.constants.generalUnit * 6
      }px`,
    },
    icon: {
      fontSize: "20px",
    },
  }),
)

interface IProfileProps {
  name: string
  email: string
  handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void
}

const Profile: React.FC<IProfileProps> = (props) => {
  const { name, email, handleValueChange } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.boxContainer}>
            <div className={classes.labelContainer}>
              <Typography variant="body1" className={classes.label}>
                Wallet address
              </Typography>
            </div>
            <TextInput
              value={name}
              onChange={handleValueChange}
              name="name"
              size="medium"
            />
          </div>
          <div className={classes.boxContainer}>
            <div className={classes.labelContainer}>
              <Typography variant="body1" className={classes.label}>
                Name
              </Typography>
            </div>
            <TextInput
              value={name}
              onChange={handleValueChange}
              name="name"
              size="medium"
            />
          </div>
          <div className={classes.boxContainer}>
            <div className={classes.labelContainer}>
              <Typography variant="body1" className={classes.label}>
                Email
              </Typography>
            </div>
            <TextInput
              type="email"
              value={email}
              size="medium"
              onChange={handleValueChange}
              name="email"
            />
          </div>
          <Button className={classes.button} size="large">
            <LockIcon className={classes.icon} />
            {"  "}
            <Typography variant="button">Save changes</Typography>
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default Profile
