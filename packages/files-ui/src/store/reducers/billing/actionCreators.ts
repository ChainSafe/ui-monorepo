import {
  addCardApi,
  IAddCardApiError,
  getCardsApi,
  IGetCardErrorApi,
  getCardTokenFromStripe,
  removeCardApi,
  IRemoveCardApiError,
  setDefaultCardApi,
  ISetDefaultCardErrorApi
} from '../../../apiLib/billingApi'
import { AsyncDispatch } from '../../store'
import { handleApiErr } from '../../../apiLib/errorResponse'
import { IPaymentCard } from '../../../types'
import { showErrorToastAction, showToastAction } from '../toast/actionCreators'

export const BILLING_GET_CARDS_LOADING = '@@files/billing/get_cards_loading'
export const BILLING_GET_CARDS_SUCCESS = '@@files/billing/get_cards_success'
export const BILLING_GET_CARDS_FAIL = '@@files/billing/get_cards_fail'

export const BILLING_ADD_CARD_LOADING = '@@files/billing/add_card_loading'
export const BILLING_ADD_CARD_SUCCESS = '@@files/billing/add_card_success'
export const BILLING_ADD_CARD_FAIL = '@@files/billing/add_card_fail'

export const BILLING_REMOVE_CARD_LOADING = '@@files/billing/remove_card_loading'
export const BILLING_REMOVE_CARD_SUCCESS = '@@files/billing/remove_card_success'
export const BILLING_REMOVE_CARD_FAIL = '@@files/billing/remove_card_fail'

export const BILLING_DEFAULT_CARD_LOADING =
  '@@files/billing/default_card_loading'
export const BILLING_DEFAULT_CARD_SUCCESS =
  '@@files/billing/default_card_success'
export const BILLING_DEFAULT_CARD_FAIL = '@@files/billing/default_card_fail'

// get cards
interface IGetCardsLoading {
  type: typeof BILLING_GET_CARDS_LOADING
}

interface IGetCardsSuccess {
  type: typeof BILLING_GET_CARDS_SUCCESS
  payload: IPaymentCard[]
}

interface IGetCardsFail {
  type: typeof BILLING_GET_CARDS_FAIL
}

export function getCardsApiAction() {
  return (dispatch: AsyncDispatch) => {
    dispatch({ type: BILLING_GET_CARDS_LOADING })
    getCardsApi()
      .then(cardsResponse => {
        let myCards = cardsResponse
        if (!myCards) myCards = []
        dispatch({
          type: BILLING_GET_CARDS_SUCCESS,
          payload: myCards
        })
      })
      .catch((err: IGetCardErrorApi) => {
        const { message, data } = handleApiErr(err, dispatch)
        const error =
          data?.general || data?.server || message || 'Something went wrong'
        dispatch(
          showErrorToastAction({
            message: error
          })
        )
        dispatch({ type: BILLING_GET_CARDS_FAIL })
      })
  }
}

// add card
interface IAddCardLoading {
  type: typeof BILLING_ADD_CARD_LOADING
}

interface IAddCardSuccess {
  type: typeof BILLING_ADD_CARD_SUCCESS
  payload: IPaymentCard
}

interface IAddCardFail {
  type: typeof BILLING_ADD_CARD_FAIL
}

interface ICardInput {
  cardNumber: string
  cardExpMonth: string
  cardExpYear: string
  cardCVC: string
}

export function addCardApiAction(dataInput: ICardInput, onSuccess: Function) {
  return (dispatch: AsyncDispatch) => {
    dispatch({ type: BILLING_ADD_CARD_LOADING })

    const stripeData = {
      card: {
        number: dataInput.cardNumber,
        exp_month: dataInput.cardExpMonth,
        exp_year: dataInput.cardExpYear,
        cvc: dataInput.cardCVC
      }
    }

    getCardTokenFromStripe(stripeData)
      .then(stripeToken => {
        addCardApi(stripeToken.id)
          .then(cardResponse => {
            dispatch({
              type: BILLING_ADD_CARD_SUCCESS,
              payload: cardResponse
            })
            dispatch(
              showToastAction({
                type: 'success',
                message: 'New payment method added',
                placement: 'topRight'
              })
            )
            onSuccess()
          })
          .catch((err: IAddCardApiError) => {
            const { message, data } = handleApiErr(err, dispatch)
            const error =
              data?.general || data?.server || message || 'Something went wrong'
            dispatch(
              showErrorToastAction({
                message: error
              })
            )
            dispatch({ type: BILLING_ADD_CARD_FAIL })
          })
      })
      .catch(() => {
        dispatch({ type: BILLING_ADD_CARD_FAIL })
        dispatch(
          showErrorToastAction({
            message: 'Failed to validate card'
          })
        )
      })
  }
}

// remove card
interface IRemoveCardLoading {
  type: typeof BILLING_REMOVE_CARD_LOADING
  payload: { cardIndex: number }
}

interface IRemoveCardSuccess {
  type: typeof BILLING_REMOVE_CARD_SUCCESS
  payload: { cardIndex: number }
}

interface IRemoveCardFail {
  type: typeof BILLING_REMOVE_CARD_FAIL
  payload: { cardIndex: number }
}

export function removeCardApiAction(
  cardIndex: number,
  cardId: string,
  onSuccess: Function
) {
  return (dispatch: AsyncDispatch) => {
    dispatch({ type: BILLING_REMOVE_CARD_LOADING, payload: { cardIndex } })
    removeCardApi(cardId)
      .then(() => {
        dispatch({
          type: BILLING_REMOVE_CARD_SUCCESS,
          payload: { cardIndex }
        })
        dispatch(
          showToastAction({
            type: 'success',
            message: 'Payment method removed',
            placement: 'topRight'
          })
        )
        onSuccess()
      })
      .catch((err: IRemoveCardApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        const error =
          data?.general || data?.server || message || 'Something went wrong'
        dispatch(
          showErrorToastAction({
            message: error
          })
        )
        dispatch({ type: BILLING_REMOVE_CARD_FAIL, payload: { cardIndex } })
      })
  }
}

// default card
interface IDefaultCardLoading {
  type: typeof BILLING_DEFAULT_CARD_LOADING
  payload: { cardIndex: number }
}

interface IDefaultCardSuccess {
  type: typeof BILLING_DEFAULT_CARD_SUCCESS
  payload: { cardIndex: number }
}

interface IDefaultCardFail {
  type: typeof BILLING_DEFAULT_CARD_FAIL
  payload: { cardIndex: number }
}

export function setDefaultCardApiAction(cardIndex: number, cardId: string) {
  return (dispatch: AsyncDispatch) => {
    dispatch({ type: BILLING_DEFAULT_CARD_LOADING, payload: { cardIndex } })
    setDefaultCardApi(cardId)
      .then(() => {
        dispatch({
          type: BILLING_DEFAULT_CARD_SUCCESS,
          payload: { cardIndex }
        })
        dispatch(
          showToastAction({
            type: 'success',
            message: 'Default card changed',
            placement: 'topRight'
          })
        )
      })
      .catch((err: ISetDefaultCardErrorApi) => {
        const { message, data } = handleApiErr(err, dispatch)
        const error =
          data?.general || data?.server || message || 'Something went wrong'
        dispatch(
          showErrorToastAction({
            message: error
          })
        )
        dispatch({ type: BILLING_DEFAULT_CARD_FAIL, payload: { cardIndex } })
      })
  }
}

export type IBillingActions =
  | IGetCardsLoading
  | IGetCardsSuccess
  | IGetCardsFail
  | IAddCardLoading
  | IAddCardSuccess
  | IAddCardFail
  | IRemoveCardLoading
  | IRemoveCardSuccess
  | IRemoveCardFail
  | IDefaultCardLoading
  | IDefaultCardSuccess
  | IDefaultCardFail
