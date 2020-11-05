import axios, { AxiosResponse } from "axios"

const STRIPE_API = "https://api.stripe.com/v1/tokens"
const STRIPE_PK = process.env.REACT_APP_STRIPE_PK

interface IStripeResponse {
  id: string
}

interface ICard {
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

export async function getCardTokenFromStripeApi(data: ICard) {
  const cardExpiryMonth = data.cardExpiry.split("/")[0]?.trim()
  const cardExpiryYear = data.cardExpiry.split("/")[1]?.trim()

  const dataString = `card[number]=${data.cardNumber}&card[exp_month]=${cardExpiryMonth}&card[exp_year]=${cardExpiryYear}&card[cvc]=${data.cardCvc}`

  return axios.post<IStripeResponse>(STRIPE_API, dataString, {
    headers: {
      Authorization: `Bearer ${STRIPE_PK}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}
