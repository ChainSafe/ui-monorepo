import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { Typography, Loading, Button } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useBilling } from "../../Contexts/BillingContext"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette, typography }: CSFTheme) =>
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
      },
      invoiceLine: {
        width: "100%",
        backgroundColor: palette.additional["gray"][4],
        color: palette.additional["gray"][9],
        padding: constants.generalUnit * 1.5,
        borderRadius: 10,
        marginTop: constants.generalUnit * 1.5,
        "& > div": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "& > span": {
            display: "block",
            lineHeight: "16px",
            fontWeight: typography.fontWeight.regular,
            marginLeft: constants.generalUnit,
            marginRight: constants.generalUnit
          }
        }
      },
      unpaidInvoice: {
        border: "1px solid #D4380D",
        color: "#D4380D"
      },
      price: {
        fontWeight: "bold !important" as "bold"
      }
    })
)

interface  IInvoiceProps {
  lineNumber?: number
  payInvoice?: () => void
}

const InvoiceLines = ({ lineNumber, payInvoice }: IInvoiceProps) => {
  const classes = useStyles()
  const { invoices, downloadInvoice } = useBilling()
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
        invoicesToShow.map(({ amount, currency, uuid, period_start, status, product }) =>
          <section
            className={clsx(classes.invoiceLine, status === "open" && classes.unpaidInvoice)}
            key={uuid}
          >
            <div>
              <Typography variant="body1">
                {product.name} {product.price.recurring.interval_count} {product.price.recurring.interval}
              </Typography>
              <Typography variant="body1">
                {dayjs.unix(period_start).format("MMM D, YYYY")}
              </Typography>
              <Typography
                variant="body1"
                className={classes.price}
              >
                {amount.toFixed(2)} {currency.toUpperCase()}
              </Typography>
              {(status === "paid") && (
                <Button
                  onClick={() => downloadInvoice(uuid)}
                  variant="link">
                  <Trans>View PDF</Trans>
                </Button>
              )}
              {(status === "open") && (
                <Button
                  onClick={payInvoice}
                  variant="link">
                  <Trans>Pay now</Trans>
                </Button>
              )}
            </div>
          </section>
        )
      )}
    </>
  )
}

export default InvoiceLines