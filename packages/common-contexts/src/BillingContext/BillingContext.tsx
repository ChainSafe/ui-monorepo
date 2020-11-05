import * as React from "react"
import { useImployApi } from "../ImployApiContext"

type BillingContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface IBillingContext {
  addCard(cardToken: string): Promise<void>
}

const BillingContext = React.createContext<IBillingContext | undefined>(
  undefined,
)

const BillingProvider = ({ children }: BillingContextProps) => {
  const { imployApiClient } = useImployApi()

  const addCard = async (cardToken: string) => {
    try {
      await imployApiClient.addCard({ token: cardToken })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error adding card.")
    }
  }

  return (
    <BillingContext.Provider
      value={{
        addCard,
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
