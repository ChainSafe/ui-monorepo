import config from '../config/config'
import { privateAPICall } from './apiRequest'
import axios, { AxiosError } from 'axios'
import { convertErrors } from './errorResponse'

import {
  ADD_CARD_ROUTE,
  GET_CARDS_ROUTE,
  SET_DEFAULT_CARD_ROUTE,
  REMOVE_CARD_ROUTE,
  STRIPE_ADD_CARD
} from './apiRoutes'

interface ICard {
  card: {
    number: string
    exp_month: string
    exp_year: string
    cvc: string
  }
}

interface IStripeResponse {
  id: string
}

export async function getCardTokenFromStripe(data: ICard) {
  return new Promise<IStripeResponse>((resolve, reject) => {
    const dataString =
      'card[number]=' +
      data.card.number +
      '&card[exp_month]=' +
      data.card.exp_month +
      '&card[exp_year]=' +
      data.card.exp_year +
      '&card[cvc]=' +
      data.card.cvc

    axios
      .post(STRIPE_ADD_CARD, dataString, {
        headers: {
          Authorization: `Bearer ${config.STRIPE_PK}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(() => {
        reject(null)
      })
  })
}

export type IAddCardApiError = AxiosError<{
  general?: string
  server?: string
}>

interface ICardResponse {
  id: string
  last4: string
}

export function addCardApi(token: string) {
  return new Promise<ICardResponse>((resolve, reject) => {
    privateAPICall
      .post(ADD_CARD_ROUTE, { token })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IGetCardErrorApi = AxiosError<{
  general?: string
  server?: string
}>

export function getCardsApi() {
  return new Promise<ICardResponse[] | null>((resolve, reject) => {
    privateAPICall
      .get(GET_CARDS_ROUTE)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type ISetDefaultCardErrorApi = AxiosError<{
  general?: string
  server?: string
}>

export function setDefaultCardApi(id: string) {
  return new Promise((resolve, reject) => {
    privateAPICall
      .patch(SET_DEFAULT_CARD_ROUTE, { id })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IRemoveCardApiError = AxiosError<{
  general?: string
  server?: string
}>

export function removeCardApi(id: string) {
  return new Promise((resolve, reject) => {
    privateAPICall
      .delete(REMOVE_CARD_ROUTE(id))
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}
