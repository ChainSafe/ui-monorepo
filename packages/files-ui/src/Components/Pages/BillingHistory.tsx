import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import { InvoiceResponse } from "@chainsafe/files-api-client"
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Typography, Loading } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"

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
      }
    })
)

const BillingHistory = () => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([])
  const [subscriptionId, setSubscriptionId] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    filesApiClient.getCurrentSubscription()
      .then((subscription) => {
        setSubscriptionId(subscription.id)
      })
      .catch((e) => {
        console.error(e)
        setIsLoading(false)
      })
  }, [filesApiClient])

  useEffect(() => {
    if(!subscriptionId) return
    filesApiClient.getAllInvoices(subscriptionId)
      .then(({ invoices }) => {
        setInvoices(invoices)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [filesApiClient, subscriptionId])

  return (
    <div>
      <Typography
        className={classes.heading}
        variant="h1"
        component="p"
      >
        <Trans>Billing history</Trans>
      </Typography>
      <Table
        fullWidth={true}
        dense={true}
      >
        <TableHead>
          <TableRow
            type="grid"
          >
            <TableHeadCell align="left"><Trans>Date</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Amount</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Method</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Receipt</Trans></TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading &&
            <Loading
              className={classes.loader}
              type="inherit"
              size={32}
            />
          }
          {invoices.map(({ paid_on, amount, payment_method, currency, uuid }, index) =>
            <TableRow
              type="grid"
              key={index}
            >
              <TableCell align="left">{paid_on ? dayjs.unix(paid_on as unknown as number).format("DD MMM YYYY") : "unknown"}</TableCell>
              <TableCell align="left">{amount} {currency}</TableCell>
              <TableCell align="left">{payment_method}</TableCell>
              <TableCell align="left">{uuid}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>
  )
}

export default BillingHistory
