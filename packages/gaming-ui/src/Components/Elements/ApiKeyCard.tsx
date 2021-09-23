import React from "react"
import { AccessKey } from "@chainsafe/files-api-client"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSGTheme } from "../../Themes/types"
import { Button, Typography, Paper } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"


const useStyles = makeStyles(({ constants }: CSGTheme) =>
  createStyles({
    root: {
      position: "relative",
      margin: constants.generalUnit,
      borderRadius: constants.generalUnit / 2,
      maxWidth: 250
    },
    button: {
      marginTop: constants.generalUnit * 2
    }
  })
)

interface IApiKeyCard {
  apiKey: AccessKey
  deleteKey: () => void
}

const ApiKeyCard = ({ apiKey, deleteKey }: IApiKeyCard) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Typography variant="h4"
        component="h4">
        <Trans>
          Id:
        </Trans>
      </Typography>
      <Typography
        variant="body1"
        component="p">
        &nbsp;{ apiKey.id }
      </Typography>
      <Typography variant="h4"
        component="h4">
        <Trans>
          Status:
        </Trans>
      </Typography>
      <Typography
        variant="body1"
        component="p">
        &nbsp;{ apiKey.status }
      </Typography>
      {/* <Typography variant="h4"
        component="h4">
        <Trans>
          Secret:
        </Trans>
      </Typography> */}
      {/* <Typography
        variant="body1"
        component="p">
        &nbsp;{ apiKey.secret }
      </Typography> */}
      <Typography variant="h4"
        component="h4">
        <Trans>
          Created on:
        </Trans>
      </Typography>
      <Typography
        variant="body1"
        component="p">
        &nbsp;{ dayjs(apiKey.created_at).format("DD MMM YYYY h:mm a") }
      </Typography>
      <Button className={classes.button}
        variant="secondary"
        fullsize={true}
        onClick={deleteKey}>
        <Trans>
          Delete key
        </Trans>
      </Button>
    </Paper>
  )
}

export default ApiKeyCard