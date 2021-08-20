import * as React from "react"
import { useFilesApi } from "./FilesApiContext"
import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { Card } from "@chainsafe/files-api-client"
import { useCallback } from "react"
import qs from "qs"

type BillingContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface IBillingContext {
  defaultCard: Card | undefined
  addCard(cardToken: string): Promise<void>
  getCardTokenFromStripe(
    cardInputs: {
      cardNumber: string
      cardExpiry: string
      cardCvc: string
    }
  ): Promise<AxiosResponse<{ id: string}>>
}

const BillingContext = React.createContext<IBillingContext | undefined>(
  undefined
)

const STRIPE_API = "https://api.stripe.com/v1/tokens"

const BillingProvider = ({ children }: BillingContextProps) => {
  const { filesApiClient, isLoggedIn } = useFilesApi()
  const [defaultCard, setDefaultCard] = useState<Card | undefined>(undefined)

  const refreshDefaultCard = useCallback(() => {
    filesApiClient.getDefaultCard().then((card) => {
      setDefaultCard(card)
    }).catch(console.error)
  }, [filesApiClient])

  useEffect(() => {
    if (isLoggedIn) {
      refreshDefaultCard()
    }
  }, [refreshDefaultCard, isLoggedIn])

  const getCardTokenFromStripe = useCallback((
    cardInputs: {
      cardNumber: string
      cardExpiry: string
      cardCvc: string
    }
  ): Promise<AxiosResponse<{ id: string}>> => {
    return axios({
      method: "post",
      url: STRIPE_API,
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_STRIPE_PK}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data : qs.stringify({
        "card[number]": cardInputs.cardNumber,
        "card[exp_month]": cardInputs.cardExpiry.split("/")[0].trim(),
        "card[exp_year]": cardInputs.cardExpiry.split("/")[1].trim(),
        "card[cvc]": cardInputs.cardCvc
      })
    })
  }, [])

  const addCard = useCallback((cardToken: string) => {
    return filesApiClient.addCard({ token: cardToken }).then(refreshDefaultCard)
  }, [filesApiClient, refreshDefaultCard])

  return (
    <BillingContext.Provider
      value={{
        defaultCard,
        addCard,
        getCardTokenFromStripe
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}

const useBilling = () => {
  const context = React.useContext(BillingContext)
  if (context === undefined) {
    throw new Error("useBilling must be used within a BillingProvider")
  }
  return context
}

export { BillingProvider, useBilling }
