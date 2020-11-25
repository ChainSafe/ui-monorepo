import * as React from "react"
import { useImployApi } from "../ImployApiContext"
import axios, { AxiosResponse } from "axios"
import { PricingInfo } from "@imploy/api-client"

type BillingContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface IBillingContext {
  addCard(cardToken: string): Promise<void>
  getAllPlans(): Promise<PricingInfo>
  getCardTokenFromStripe(
    card: ICard,
    stripePk: string,
  ): Promise<AxiosResponse<IStripeResponse>>
}

const BillingContext = React.createContext<IBillingContext | undefined>(
  undefined,
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
  const { imployApiClient } = useImployApi()

  const getAllPlans = async () => {
    return await imployApiClient.getAllPlans({
      product_id: "chainsafe-files",
    })
  }

  const addCard = async (cardToken: string) => {
    try {
      await imployApiClient.addCard({ token: cardToken })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error adding card.")
    }
  }

  const getCardTokenFromStripe = (
    data: ICard,
    stripePk: string,
  ): Promise<AxiosResponse<IStripeResponse>> => {
    const cardExpiryMonth = data.cardExpiry.split("/")[0]?.trim()
    const cardExpiryYear = data.cardExpiry.split("/")[1]?.trim()

    const dataString = `card[number]=${data.cardNumber}&card[exp_month]=${cardExpiryMonth}&card[exp_year]=${cardExpiryYear}&card[cvc]=${data.cardCvc}`

    return axios.post<IStripeResponse>(STRIPE_API, dataString, {
      headers: {
        Authorization: `Bearer ${stripePk}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  return (
    <BillingContext.Provider
      value={{
        addCard,
        getAllPlans,
        getCardTokenFromStripe,
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
