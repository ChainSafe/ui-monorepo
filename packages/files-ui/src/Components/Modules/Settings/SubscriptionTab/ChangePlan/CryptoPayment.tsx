import React, { useCallback, useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice, UpdateSubscriptionResponse } from "@chainsafe/files-api-client"
import { Button, Divider, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { useFilesApi } from "../../../../../Contexts/FilesApiContext"
import QRCode from "react-qr-code"
import { useWeb3 } from "@chainsafe/web3-context"
import { utils } from "ethers"

dayjs.extend(duration)

const paymentTimeRemaining = (endTimestamp: number) => {
  return dayjs.duration(endTimestamp - dayjs().unix(), "s").format("mm:ss")
}

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root: {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    heading: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit * 2
    },
    subheading: {
      marginBottom: constants.generalUnit * 3
    },
    boldText: {
      fontWeight: "bold"
    },
    normalWeightText: {
      fontWeight: "normal"
    },
    rowBox: {
      display: "flex",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    middleRowBox: {
      display: "flex",
      alignItems: "center",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    pushRightBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      flex: 1
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    bottomSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      margin: `${constants.generalUnit * 3}px 0px`
    },
    divider: {
      margin: `${constants.generalUnit}px 0`
    },
    textButton: {
      color: palette.primary.background,
      cursor: "pointer",
      textDecoration: "underline"
    },
    creditCardIcon: {
      marginRight: constants.generalUnit,
      fill: palette.additional["gray"][9]
    },
    featuresBox: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 2
    },
    creditCardRow: {
      display: "flex",
      alignItems: "center",
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit
    },
    featureSeparator: {
      marginBottom: constants.generalUnit
    },
    error: {
      marginTop: constants.generalUnit,
      color: palette.error.main
    }
  })
)

interface ICryptoPayment {
  plan: Product
  planPrice: ProductPrice
  onClose: () => void
}

const CryptoPayment = ({
  onClose,
  planPrice
}: ICryptoPayment) => {
  const classes = useStyles()
  const { selectWallet } = useFilesApi()
  const { isReady, network, provider, wallet, tokens, switchNetwork, checkIsReady } = useWeb3()
  const { filesApiClient } = useFilesApi()
  const { currentSubscription } = useBilling()
  const [subResponse, setSubResponse] = useState<UpdateSubscriptionResponse | undefined>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [timeRemaining, setTimeRemaining] = useState<string | undefined>()

  useEffect(() => {
    if (!currentSubscription) return undefined
    filesApiClient.updateSubscription(currentSubscription.id, {
      price_id: planPrice.id,
      payment_method: "crypto"
    }).then(setSubResponse)
      .catch(error => {
        console.error(error)
        setError(`There was a problem creating a charge ${error}`)
      })
  }, [currentSubscription, filesApiClient, planPrice.id])

  const cryptoPayment = useMemo(() => subResponse?.invoice?.crypto, [subResponse])
  const currencies = useMemo(() => cryptoPayment?.payment_methods.map(c => c.currency), [cryptoPayment])
  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(undefined)

  useEffect(() => {
    const timer = setInterval(() => {
      if (cryptoPayment) {
        setTimeRemaining(paymentTimeRemaining(cryptoPayment.expires_at))
      }
    }, 1000)

    return () => {
      timer && clearInterval(timer)
    }
  }, [cryptoPayment])


  const handlePayment = useCallback(async () => {
    if (!provider || !selectedCurrency) return
    const selectedPaymentMethod = cryptoPayment?.payment_methods.find(p => p.currency === selectedCurrency)
    if (!selectedPaymentMethod) return

    const signer = provider.getSigner()
    if (selectedCurrency === "ethereum") {
      signer.sendTransaction({
        to: selectedPaymentMethod.address,
        value: utils.parseEther(selectedPaymentMethod.amount)
      })
    } else {
      const token = Object.values(tokens).find(t => t.symbol?.toLowerCase() === selectedCurrency)
      if (!token || !token.transfer) return
      try {
        // TODO Set loading state here
        await (await token.transfer(
          selectedPaymentMethod.address,
          utils.parseUnits(selectedPaymentMethod.amount, token.decimals)
        )).wait(1)
      } catch (error) {
        console.error(error)
      }
    }
  }, [cryptoPayment, provider, selectedCurrency, tokens])

  const handleSwitchNetwork = useCallback(async () => {
    await switchNetwork(1)
    await checkIsReady()
  }, [checkIsReady, switchNetwork])

  return (
    <article className={classes.root}>
      <Typography
        variant="h5"
        component="h4"
        className={classes.heading}
      >
        <Trans>Pay with crypto</Trans>
      </Typography>
      <Divider className={classes.divider} />
      {error &&
        <Typography
          component="p"
          variant="body1"
          className={classes.error}
        >
          <Trans>Failed to create a charge</Trans>
        </Typography>
      }
      {cryptoPayment &&
        <>
          <div>
            {timeRemaining}
          </div>
          <div>
            Total
          </div>
          <div>
            {subResponse?.invoice?.amount}
          </div>
          {!selectedCurrency && currencies &&
            <>
              <Typography>Select a cryptocurrency</Typography>
              {currencies.map(c => <Button
                key={c}
                onClick={() => setSelectedCurrency(c)}>
                {c}
              </Button>)}
            </>
          }
          {selectedCurrency &&
          <div>
            <QRCode value={cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.address || "0x"} />
            <Typography><Trans>Only send {selectedCurrency} to this address</Trans></Typography>
            <Divider />
            <Typography><Trans>Destination Address</Trans></Typography>
            <Typography>{cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.address}</Typography>
            <Typography><Trans>Total Amount</Trans></Typography>
            <Typography>{cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.amount}</Typography>
            {selectedCurrency !== "bitcoin" && !isReady &&
              <Button onClick={selectWallet}><Trans>Connect Wallet</Trans></Button>
            }
            {selectedCurrency !== "bitcoin" && isReady && network !== 1 &&
              <Button  onClick={handleSwitchNetwork}>
                <Trans>Switch Network</Trans>
              </Button>
            }
            {selectedCurrency !== "bitcoin" && isReady && network === 1 &&
              <Button onClick={handlePayment}><Trans>Pay with {wallet?.name}</Trans></Button>
            }
          </div>
          }
        </>
      }
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={onClose}
            variant="secondary"
          >
            <Trans>Cancel</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default CryptoPayment