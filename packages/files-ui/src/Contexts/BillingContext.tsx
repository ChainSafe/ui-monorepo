import * as React from "react"
import { useFilesApi } from "./FilesApiContext"
import { ReactNode, useEffect, useState } from "react"
import { Card, CurrentSubscription, InvoiceResponse, Product } from "@chainsafe/files-api-client"
import { useCallback } from "react"
import { t } from "@lingui/macro"
import { PaymentMethod } from "@stripe/stripe-js"
import { useFiles } from "./FilesContext"

type BillingContextProps = {
  children: ReactNode | ReactNode[]
}

interface IBillingContext {
  defaultCard: Card | undefined
  refreshDefaultCard: () => void
  currentSubscription: CurrentSubscription | undefined
  changeSubscription: (newPriceId: string) => Promise<void>
  fetchCurrentSubscription: () => void
  getAvailablePlans: () => Promise<Product[]>
  deleteCard: (card: Card) => Promise<void>
  updateDefaultCard: (id: PaymentMethod["id"]) => Promise<void>
  invoices?: InvoiceResponse[]
  cancelCurrentSubscription: () => Promise<void>
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
  const { refreshBuckets } = useFiles()
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | undefined>()
  const [defaultCard, setDefaultCard] = useState<Card | undefined>(undefined)
  const [invoices, setInvoices] = useState<InvoiceResponse[] | undefined>()

  useEffect(() => {
    if (!currentSubscription) return

    filesApiClient.getAllInvoices(currentSubscription.id)
      .then(({ invoices }) => {
        setInvoices(invoices)
      })
      .catch((e: any) => {
        console.error(e)
        setInvoices([])
      })
  }, [currentSubscription, filesApiClient])

  const refreshDefaultCard = useCallback(() => {
    filesApiClient.getDefaultCard().then((card) => {
      setDefaultCard(card)
    }).catch((err) => {
      console.error(err)
      setDefaultCard(undefined)
    })
  }, [filesApiClient])

  const deleteCard = useCallback((card: Card) =>
    filesApiClient.deleteCard(card.id)
  , [filesApiClient])

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

  const updateDefaultCard = useCallback((id: PaymentMethod["id"]) =>
    filesApiClient.updateDefaultCard({ id })
  , [filesApiClient])

  const changeSubscription = useCallback((newPriceId: string) => {
    if (!currentSubscription?.id) return Promise.resolve()
    return filesApiClient.updateSubscription(currentSubscription.id, {
      price_id: newPriceId,
      payment_method: "stripe"
    })
      .then(() => {
        fetchCurrentSubscription()
        refreshBuckets()
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject()
      })
  }, [filesApiClient, currentSubscription, fetchCurrentSubscription, refreshBuckets])

  const cancelCurrentSubscription = useCallback(() => {
    if (!currentSubscription)
      return Promise.reject("There is no current subscription")

    return filesApiClient.cancelSubscription(currentSubscription.id)
      .then(() => {
        fetchCurrentSubscription()
        refreshBuckets()
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject()
      })
  }, [currentSubscription, fetchCurrentSubscription, filesApiClient, refreshBuckets]
  )

  return (
    <BillingContext.Provider
      value={{
        currentSubscription,
        fetchCurrentSubscription,
        changeSubscription,
        refreshDefaultCard,
        defaultCard,
        getAvailablePlans,
        deleteCard,
        updateDefaultCard,
        invoices,
        cancelCurrentSubscription
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
