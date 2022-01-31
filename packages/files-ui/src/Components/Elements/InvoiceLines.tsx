import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { Typography, Loading, Button } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useBilling } from "../../Contexts/BillingContext"

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
      setOption: {
        width: "100%",
        backgroundColor: palette.additional["gray"][4],
        color: palette.additional["gray"][9],
        padding: constants.generalUnit * 1.5,
        borderRadius: 16,
        marginTop: constants.generalUnit * 1.5,
        "& > div": {
          display: "flex",
          alignItems: "center",
          "& > span": {
            display: "block",
            lineHeight: "16px",
            fontWeight: typography.fontWeight.regular,
            "&.receiptDate": {
              marginLeft: constants.generalUnit,
              marginRight: constants.generalUnit,
              flex: "1 1 0"
            }
          }
        }
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
        invoicesToShow.map(({ amount, currency, uuid, period_start, status }) =>
          <section
            className={classes.setOption}
            key={uuid}
          >
            <div>
              <Typography
                variant="body1"
                className={classes.price}
              >
                {amount} {currency}
              </Typography>
              <Typography
                variant="body2"
                className="receiptDate"
              >
                {dayjs.unix(period_start).format("MMM D, YYYY")}
              </Typography>
              {(status === "paid") && (
                <Button
                  onClick={() => downloadInvoice(uuid)}
                  testId="download-invoice"
                >
                  <Trans>Download</Trans>
                </Button>
              )}
              {(status === "open") && (
                <Button
                  onClick={payInvoice}
                  testId="pay-invoice"
                >
                  <Trans>Pay invoice</Trans>
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