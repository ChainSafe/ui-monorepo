import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice, UpdateSubscriptionResponse } from "@chainsafe/files-api-client"
import { BitcoinIcon, Button, CircularProgressBar, DaiIcon, Divider, EthereumIcon, EthereumLogoIcon, Typography, UsdcIcon } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { useFilesApi } from "../../../../../Contexts/FilesApiContext"
import QRCode from "react-qr-code"
import { useWeb3 } from "@chainsafe/web3-context"
import { utils } from "ethers"

dayjs.extend(duration)

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
      alignItems: "center",
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
    },
    qrCode: {
      display: "flex",
      justifyContent: "center"
    },
    qrCodeLabel: {
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      color: "#AFAFAF"
    },
    availableCurrencies: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between"
    },
    currencyButton: {
      width: "calc(50% - 8px)",
      backgroundColor: "var(--gray4)",
      color: "var(--gray10)",
      borderRadius: 10,
      marginTop: 4,
      marginBottom: 4,
      "&:hover": {
        backgroundColor: "var(--gray4)",
        color: "var(--gray10)"
      }
    },
    currencyIcon: {
      "& > svg": {
        fill: palette.primary.main,
        height: 16
      }
    }
  })
)

interface ICryptoPayment {
  plan: Product
  planPrice: ProductPrice
  goBack: () => void
}

const CryptoPayment = ({
  goBack,
  planPrice
}: ICryptoPayment) => {
  const classes = useStyles()
  const { selectWallet } = useFilesApi()
  const { isReady, network, provider, wallet, tokens, switchNetwork, checkIsReady, ethBalance } = useWeb3()
  const { filesApiClient } = useFilesApi()
  const { currentSubscription } = useBilling()
  const [subResponse, setSubResponse] = useState<UpdateSubscriptionResponse | undefined>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [timeRemaining, setTimeRemaining] = useState<string | undefined>()
  const pageLoadTimestamp = useRef(dayjs().unix())


  const iconMap: {[key: string]: React.FC<any>} = {
    ethereum: EthereumIcon,
    bitcoin: BitcoinIcon,
    dai: DaiIcon,
    usdc: UsdcIcon
  }

  useEffect(() => {
    if (!currentSubscription) return undefined
    filesApiClient.updateSubscription(currentSubscription.id, {
      price_id: planPrice.id,
      payment_method: "crypto"
    }).then((response) => {
      setSubResponse(response)
      pageLoadTimestamp.current = dayjs().unix()
    }).catch(error => {
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
        setTimeRemaining(dayjs.duration(cryptoPayment.expires_at - dayjs().unix(), "s").format("mm:ss"))
      }
    }, 1000)

    return () => {
      timer && clearInterval(timer)
    }
  }, [cryptoPayment])

  const isBalanceSufficient = useMemo(() => {
    const selectedPaymentMethod = cryptoPayment?.payment_methods.find(p => p.currency === selectedCurrency)
    if (selectedCurrency === "bitcoin") {
      return false
    } else if (selectedCurrency === "ethereum") {
      return ethBalance && selectedPaymentMethod && ethBalance > Number(selectedPaymentMethod.amount)
    } else {
      const token = Object.values(tokens).find(t => t.symbol?.toLowerCase() === selectedCurrency)
      return token && selectedPaymentMethod && token.balance >= Number(selectedPaymentMethod.amount)
    }
  }, [tokens, ethBalance, selectedCurrency, cryptoPayment])

  const handlePayment = useCallback(async () => {
    if (!provider || !selectedCurrency) return
    const selectedPaymentMethod = cryptoPayment?.payment_methods.find(p => p.currency === selectedCurrency)
    if (!selectedPaymentMethod) return

    const signer = provider.getSigner()
    if (selectedCurrency === "ethereum") {
      try {
        await (await signer.sendTransaction({
          to: selectedPaymentMethod.address,
          value: utils.parseEther(selectedPaymentMethod.amount)
        })).wait(1)
      } catch (error) {
        console.error(error)
      }
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
      <div className={classes.rowBox}>
        <Typography
          variant="h5"
          component="h4"
          className={classes.heading}
        >
          <Trans>Pay with crypto</Trans>
        </Typography>
        {cryptoPayment && <div className={classes.pushRightBox}>
          <CircularProgressBar
            progress={(cryptoPayment.expires_at - dayjs().unix()) / (cryptoPayment.expires_at - pageLoadTimestamp.current) * 100}
            width={23}
            label={timeRemaining}
            variant="secondary" />
        </div>}
      </div>
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
          <div className={classes.rowBox}>
            <Typography>Total</Typography>
            <div className={classes.pushRightBox}>
              <Typography>
                {subResponse?.invoice?.currency?.toUpperCase()} {subResponse?.invoice?.amount}
              </Typography>
            </div>
          </div>
          <Divider />
          {!selectedCurrency && currencies &&
            <>
              <Typography>Select a cryptocurrency</Typography>
              <div className={classes.availableCurrencies}>
                {currencies.map(c => {
                  const CurrencyIcon = iconMap[c] || null
                  return <Button
                    key={c}
                    onClick={() => setSelectedCurrency(c)}
                    className={classes.currencyButton}>
                    <CurrencyIcon className={classes.currencyIcon} />
                    {c.replace(/(^|\s)\S/g, letter => letter.toUpperCase())}
                  </Button>})}
              </div>
            </>
          }
          {selectedCurrency &&
            <>
              <div className={classes.qrCode}>
                <QRCode value={cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.address || "0x"} />
              </div>
              <div className={classes.qrCodeLabel}>
                <Typography>
                  <Trans>Only send {selectedCurrency} to this address</Trans>
                </Typography>
              </div>
              <Divider />
              <div className={classes.rowBox}>
                <Typography><Trans>Destination Address</Trans></Typography>
                <div className={classes.pushRightBox}>
                  <Typography>{cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.address}</Typography>
                </div>
              </div>
              <div className={classes.rowBox}>
                <Typography><Trans>Total Amount</Trans></Typography>
                <div className={classes.pushRightBox}>
                  <Typography>{cryptoPayment.payment_methods.find(p => p.currency === selectedCurrency)?.amount}</Typography>
                </div>
              </div>
            </>
          }
        </>
      }
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={() => !selectedCurrency ? goBack() : setSelectedCurrency(undefined)}
            variant="text"
          >
            <Trans>Go back</Trans>
          </Button>
          {selectedCurrency && selectedCurrency !== "bitcoin" && !isReady &&
            <Button onClick={selectWallet}><Trans>Connect Wallet</Trans></Button>
          }
          {selectedCurrency && selectedCurrency !== "bitcoin" && isReady && network !== 1 &&
            <Button onClick={handleSwitchNetwork}>
              <Trans>Switch Network</Trans>
            </Button>
          }
          {selectedCurrency && selectedCurrency !== "bitcoin" && isReady && network === 1 &&
            <Button
              onClick={handlePayment}
              disabled={!isBalanceSufficient}>
              {isBalanceSufficient
                ? <Trans>Pay with {wallet?.name}</Trans>
                : <Trans>Insufficient balance</Trans>}
            </Button>
          }
        </div>
      </section>
    </article>
  )
}

export default CryptoPayment