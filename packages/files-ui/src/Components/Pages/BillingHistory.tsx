import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import { InvoiceResponse, InvoicesResponse } from "@chainsafe/files-api-client"
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"

const useStyles = makeStyles(
  ({ constants }: CSFTheme) =>
    createStyles({
      root: {
        //
      }
    })
)

const BillingHistory = () => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([])

  useEffect(() => {

    filesApiClient.getAllInvoices("d9c0cc3e-1129-11ec-82a8-0242ac130003")
      .then(({ invoices }) => {
        console.log("invoices", invoices)
        setInvoices(invoices)
      })
      .catch(console.error)
    // const mock: InvoicesResponse = {
    //   "last_id": "ae38b0e4-d5c9-48b7-a169-d9ebb4ce1be6",
    //   "page_size": 1,
    //   "invoices": [
    //     {
    //       "uuid": "ae38b0e4-d5c9-48b7-a169-d9ebb4ce1be6",
    //       "user_id": "eeb18b74-96ca-4162-a124-61c9088b7c00",
    //       "subscription_id": "vsghvs",
    //       "amount": 20,
    //       "currency": "USD",
    //       "payment_method": "crypto",
    //       "status": "paid",
    //       "paid_on": 1393812184 as unknown as Date
    //     }
    //   ]
    // }

    // setInvoices(mock.invoices)

  }, [filesApiClient])

  return (
    <div className={classes.root}>
      Billing history
      <Table
        fullWidth={true}
        dense={true}
      >
        <TableHead>
          <TableRow
            type="grid"
            // className={classes.tableRow}
          >
            <TableHeadCell align="left"><Trans>Date</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Amount</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Method</Trans></TableHeadCell>
            <TableHeadCell align="left"><Trans>Receipt</Trans></TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(({ paid_on, amount, payment_method, subscription_id, currency }, index) =>
            <TableRow
              type="grid"
              key={index}
            >
              <TableCell align="left">{paid_on ? dayjs.unix(paid_on as unknown as number).format("DD MMM YYYY") : "unknown"}</TableCell>
              <TableCell align="left">{amount}{currency}</TableCell>
              <TableCell align="left">{payment_method}</TableCell>
              <TableCell align="left">{subscription_id}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>
  )
}

export default BillingHistory
