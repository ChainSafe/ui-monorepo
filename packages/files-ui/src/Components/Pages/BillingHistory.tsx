import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import { InvoiceResponse } from "@chainsafe/files-api-client"
import { Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import InvoiceLines from "../Elements/InvoiceLines"

const useStyles = makeStyles(
  ({ constants, breakpoints }: CSFTheme) =>
    createStyles({
      heading: {
        marginBottom: constants.generalUnit * 4,
        [breakpoints.down("md")]: {
          marginBottom: constants.generalUnit * 2
        }
      },
      loader: {
        marginTop: constants.generalUnit
      },
      centered: {
        textAlign: "center"
      },
      root: {
        [breakpoints.down("md")]: {
          padding: `0 ${constants.generalUnit}px`
        }
      }
    })
)

const BillingHistory = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography
        className={classes.heading}
        variant="h1"
        component="p"
      >
        <Trans>Billing history</Trans>
      </Typography>
      <InvoiceLines />
    </div>
  )
}

export default BillingHistory
