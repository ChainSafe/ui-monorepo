import * as React from "react"
import { useFilesApi } from "./FilesApiContext"
import { ReactNode, useEffect, useState } from "react"
import { Card, CurrentSubscription, Product } from "@chainsafe/files-api-client"
import { useCallback } from "react"
import { t } from "@lingui/macro"

type BillingContextProps = {
  children: ReactNode | ReactNode[]
}

interface IBillingContext {
  defaultCard: Card | undefined
  refreshDefaultCard: () => void
  currentSubscription: CurrentSubscription | undefined
  changeSubscription: (productId: string, priceId: string) => Promise<boolean | void>
  fetchCurrentSubscription: () => void
  getAvailablePlans: () => Promise<Product[]>
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

const BillingProvider = ({ children }: BillingContextProps) => {
  const { filesApiClient, isLoggedIn } = useFilesApi()
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | undefined>()
  const [defaultCard, setDefaultCard] = useState<Card | undefined>(undefined)

  const refreshDefaultCard = useCallback(() => {
    filesApiClient.getDefaultCard().then((card) => {
      setDefaultCard(card)
    }).catch((err) => {
      console.error(err)
      setDefaultCard(undefined)
    })
  }, [filesApiClient])

  useEffect(() => {
    if (isLoggedIn) {
      refreshDefaultCard()
    }
  }, [refreshDefaultCard, isLoggedIn, filesApiClient])

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

  const getAvailablePlans = useCallback(() => {
    return filesApiClient.getAllProducts()
      .then((products) => {
        return products.map(product => {
          product.name = ProductMapping[product.id].name
          product.description = ProductMapping[product.id].description
          return product
        })
      })
      .catch((error: any) => {
        console.error(error)
        return []
      })
  }, [filesApiClient])

  const changeSubscription = useCallback((productId: string, priceId: string) => {
    return filesApiClient.updateSubscription(productId, {
      price_id: priceId
    })
      .then(() => true)
      .catch((error: any) => {
        console.error(error)
      })
  }, [filesApiClient])

  return (
    <BillingContext.Provider
      value={{
        currentSubscription,
        fetchCurrentSubscription,
        changeSubscription,
        refreshDefaultCard,
        defaultCard,
        getAvailablePlans
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
