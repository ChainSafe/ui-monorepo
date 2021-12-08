import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Typography, Loading } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useBilling } from "../../Contexts/BillingContext"

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

interface  IInvoiceProps {
  lineNumber?: number
}

const InvoiceLines = ({ lineNumber }: IInvoiceProps) => {
  const classes = useStyles()
  const { invoices } = useBilling()
  const invoicesToShow = useMemo(() => {
    if (!invoices) return

    return lineNumber
      ? invoices.slice(0, lineNumber)
      : invoices
  }, [invoices, lineNumber])

  return (
    <>
      {!invoicesToShow && (
        <div className={classes.centered}>
          <Loading
            className={classes.loader}
            type="initial"
            size={32}
          />
        </div>
      )}
      {invoicesToShow && !invoicesToShow.length && (
        <div className={classes.centered}>
          <Typography
            className={classes.heading}
            variant="h4"
            component="p"
          >
            <Trans>No invoice found</Trans>
          </Typography>
        </div>
      )}
      {!!invoicesToShow?.length && (
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
            {invoicesToShow.map(({ paid_on, amount, payment_method, currency, uuid }, index) =>
              <TableRow
                type="grid"
                key={index}
              >
                <TableCell align="left">{dayjs(paid_on).format("ddd D MMMM h:mm a")}</TableCell>
                <TableCell align="left">{amount} {currency}</TableCell>
                <TableCell align="left">{payment_method}</TableCell>
                <TableCell align="left">{uuid}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default InvoiceLines