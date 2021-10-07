import  React, { ReactNode, useCallback, useEffect } from "react"
// import { useFilesApi } from "./FilesApiContext"
import axios, { AxiosResponse } from "axios"
import { CurrentSubscription } from "@chainsafe/files-api-client"
import { useFilesApi } from "./FilesApiContext"
import { useState } from "react"
import { t } from "@lingui/macro"

type BillingContextProps = {
  children: ReactNode | ReactNode[]
}

interface IBillingContext {
  addCard(cardToken: string): Promise<void>
  getCardTokenFromStripe(
    card: ICard,
    stripePk: string,
  ): Promise<AxiosResponse<IStripeResponse>>
  currentSubscription: CurrentSubscription | undefined
  fetchCurrentSubscription: () => void
}

const ProductMapping: {[key: string]: {
  name: string
  description: string
}} = {
  prod_JwRu6Ph25b1f2O: {
    name: t`Free plan`,
    description: t`This is the free product.`
  },
  prod_JwS49Qfnr6vD3K: {
    name: t`Standard plan`,
    description: t`Standard plan`
  },
  prod_JwSGHB8qFx7rRM: {
    name: t`Premium plan`,
    description: t`Premium plan`
  }
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
  const { filesApiClient, isLoggedIn } = useFilesApi()
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | undefined>()

  const addCard = async (
  //cardToken: string
  ) => {
    try {
      // await filesApiClient.addCard({ token: cardToken })
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

  const fetchCurrentSubscription = useCallback(() => {
    filesApiClient.getCurrentSubscription()
      .then((subscription) => {
        subscription.product.name = ProductMapping[subscription.product.id].name
        subscription.product.description = ProductMapping[subscription.product.id].description
        setCurrentSubscription(subscription)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }, [filesApiClient])

  useEffect(() => {
    if (isLoggedIn && !currentSubscription) {
      fetchCurrentSubscription()
    } else if (!isLoggedIn) {
      setCurrentSubscription(undefined)
    }
  }, [isLoggedIn, fetchCurrentSubscription, currentSubscription])

  return (
    <BillingContext.Provider
      value={{
        addCard,
        getCardTokenFromStripe,
        currentSubscription,
        fetchCurrentSubscription
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
