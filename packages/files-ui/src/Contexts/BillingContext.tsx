import * as React from "react"
import { useFilesApi } from "./FilesApiContext"
import axios, { AxiosResponse } from "axios"

type BillingContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface IBillingContext {
  addCard(cardToken: string): Promise<void>
  getCardTokenFromStripe(
    card: ICard,
    stripePk: string,
  ): Promise<AxiosResponse<IStripeResponse>>
}

const BillingContext = React.createContext<IBillingContext | undefined>(
  undefined
)

const STRIPE_API = "https://api.stripe.com/v1/tokens"

interface ICard {
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

interface IStripeResponse {
  id: string
}

const BillingProvider = ({ children }: BillingContextProps) => {
  const { filesApiClient } = useFilesApi()

  const addCard = async (cardToken: string) => {
    try {
      await filesApiClient.addCard({ token: cardToken })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error adding card.")
    }
  }

  const getCardTokenFromStripe = (
    data: ICard,
    stripePk: string
  ): Promise<AxiosResponse<IStripeResponse>> => {
    const cardExpiryMonth = data.cardExpiry.split("/")[0]?.trim()
    const cardExpiryYear = data.cardExpiry.split("/")[1]?.trim()

    // eslint-disable-next-line max-len
    const dataString = `card[number]=${data.cardNumber}&card[exp_month]=${cardExpiryMonth}&card[exp_year]=${cardExpiryYear}&card[cvc]=${data.cardCvc}`

    return axios.post<IStripeResponse>(STRIPE_API, dataString, {
      headers: {
        Authorization: `Bearer ${stripePk}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }

  return (
    <BillingContext.Provider
      value={{
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
