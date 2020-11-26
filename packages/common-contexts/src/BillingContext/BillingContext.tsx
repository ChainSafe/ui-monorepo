import * as React from "react"
import { useImployApi } from "../ImployApiContext"
import axios, { AxiosResponse } from "axios"
import {
  CardInfo,
  FileResponse,
  InvoiceInfo,
  OrderResponse,
  PricingInfo,
  PurchasedPlanResponse,
  SubscriptionInfo,
} from "@imploy/api-client"

type BillingContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface IBillingContext {
  getAllInvoices: () => Promise<InvoiceInfo[]>
  getAllCards: () => Promise<CardInfo[]>
  addCard(cardToken: string): Promise<void>
  getCard: (cardId: string) => Promise<void>
  deleteCard: (cardId: string) => Promise<FileResponse>
  getDefaultCard: () => Promise<void>
  updateDefaultCard: (cardId: string) => Promise<FileResponse>

  getAllPlans(): Promise<PricingInfo>
  getPurchasedPlans: () => Promise<PurchasedPlanResponse[]>
  getPlan: (planId: string) => Promise<PricingInfo>

  // Orders
  getAllOrder: (status: string) => Promise<OrderResponse[]>
  getOrder: (orderId: number) => Promise<OrderResponse>
  addOrder: (planId: string, publicAddress: string) => Promise<OrderResponse>
  cancelOrder: (orderId: number) => Promise<void>

  // Subscriptions
  getAllSubscriptions: () => Promise<SubscriptionInfo[]>
  getSubscription: (id: string) => Promise<FileResponse>
  addSubscription: (planId: string) => Promise<void>
  cancelSubscription: (id: string) => Promise<void>

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

  // Invoices
  const getAllInvoices = async () => {
    return await imployApiClient.getAllInvoices()
  }

  // Cards
  const getAllCards = async () => {
    return await imployApiClient.getAllCards()
  }

  const getCard = async (cardId: string) => {
    return await imployApiClient.getCard(cardId)
  }

  const addCard = async (cardToken: string) => {
    try {
      await imployApiClient.addCard({ token: cardToken })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error adding card.")
    }
  }

  const deleteCard = async (cardId: string) => {
    return await imployApiClient.deleteCard(cardId)
  }

  const getDefaultCard = async () => {
    return await imployApiClient.getDefaultCard()
  }

  const updateDefaultCard = async (cardId: string) => {
    return await imployApiClient.updateDefaultCard({
      id: cardId,
    })
  }

  // Plans
  const getAllPlans = async (): Promise<PricingInfo[]> => {
    return await imployApiClient.getAllPlans({
      product_name: "chainsafe-files",
    })
  }

  const getPurchasedPlans = async () => {
    return await imployApiClient.getPurchasedPlans()
  }

  const getPlan = async (planId: string) => {
    return await imployApiClient.getPlan(planId)
  }

  // Orders
  const getAllOrder = async (status: string) => {
    return await imployApiClient.getAllOrder({
      status: status,
    })
  }

  const getOrder = async (orderId: number) => {
    return await imployApiClient.getOrder(orderId)
  }

  const addOrder = async (planId: string, publicAddress: string) => {
    return await imployApiClient.addOrder({
      plan_id: planId,
      public_address: publicAddress,
    })
  }

  const cancelOrder = async (orderId: number) => {
    return await imployApiClient.cancelOrder(orderId)
  }

  // Subscriptions
  const getAllSubscriptions = async () => {
    return await imployApiClient.getAllSubscriptions()
  }

  const getSubscription = async (id: string) => {
    return await imployApiClient.getSubscription(id)
  }

  const addSubscription = async (planId: string) => {
    return await imployApiClient.addSubscription({
      plan_id: planId,
    })
  }

  const cancelSubscription = async (id: string) => {
    return await imployApiClient.cancelSubscription(id)
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
        getAllInvoices,
        addCard,
        getCard,
        deleteCard,
        getDefaultCard,
        updateDefaultCard,
        getAllCards,
        getAllOrder,
        getOrder,
        addOrder,
        cancelOrder,
        getAllPlans,
        getPlan,
        getPurchasedPlans,
        addSubscription,
        getAllSubscriptions,
        getSubscription,
        cancelSubscription,
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
