import {
  BILLING_ADD_CARD_LOADING,
  BILLING_ADD_CARD_SUCCESS,
  BILLING_ADD_CARD_FAIL,
  BILLING_GET_CARDS_LOADING,
  BILLING_GET_CARDS_SUCCESS,
  BILLING_GET_CARDS_FAIL,
  BILLING_REMOVE_CARD_LOADING,
  BILLING_REMOVE_CARD_SUCCESS,
  BILLING_REMOVE_CARD_FAIL,
  BILLING_DEFAULT_CARD_LOADING,
  BILLING_DEFAULT_CARD_SUCCESS,
  BILLING_DEFAULT_CARD_FAIL,
  IBillingActions
} from './actionCreators'
import { IPaymentCard } from 'src/types'

interface ICardStore extends IPaymentCard {
  loadingRemove: boolean
  loadingDefault: boolean
}

interface IBillingStore {
  cards: ICardStore[]
  loadingCards: boolean
  loadingAddCard: boolean
}

const initializer: IBillingStore = {
  cards: [],
  loadingCards: false,
  loadingAddCard: false
}

export default (
  state = initializer,
  action: IBillingActions
): IBillingStore => {
  switch (action.type) {
    case BILLING_GET_CARDS_LOADING: {
      return {
        ...state,
        loadingCards: true
      }
    }
    case BILLING_GET_CARDS_SUCCESS: {
      const myCards = action.payload.map(card => ({
        ...card,
        loadingRemove: false,
        loadingDefault: false
      }))
      return {
        ...state,
        loadingCards: false,
        cards: myCards
      }
    }
    case BILLING_GET_CARDS_FAIL: {
      return {
        ...state,
        loadingCards: false,
        cards: []
      }
    }
    case BILLING_ADD_CARD_LOADING: {
      return {
        ...state,
        loadingAddCard: true
      }
    }
    case BILLING_ADD_CARD_SUCCESS: {
      return {
        ...state,
        loadingAddCard: false,
        cards: [
          ...state.cards,
          {
            ...action.payload,
            loadingRemove: false,
            loadingDefault: false
          }
        ]
      }
    }
    case BILLING_ADD_CARD_FAIL: {
      return {
        ...state,
        loadingAddCard: false
      }
    }
    case BILLING_REMOVE_CARD_LOADING: {
      const myCards = state.cards
      myCards[action.payload.cardIndex].loadingRemove = true
      return {
        ...state,
        cards: [...myCards]
      }
    }
    case BILLING_REMOVE_CARD_SUCCESS: {
      const myCards = state.cards
      myCards.splice(action.payload.cardIndex, 1)
      return {
        ...state,
        cards: [...myCards]
      }
    }
    case BILLING_REMOVE_CARD_FAIL: {
      const myCards = state.cards
      myCards[action.payload.cardIndex].loadingRemove = false
      return {
        ...state,
        cards: [...myCards]
      }
    }
    case BILLING_DEFAULT_CARD_LOADING: {
      const myCards = state.cards
      myCards[action.payload.cardIndex].loadingDefault = true
      return {
        ...state,
        cards: [...myCards]
      }
    }
    case BILLING_DEFAULT_CARD_SUCCESS: {
      const myCards = state.cards
      myCards[action.payload.cardIndex].loadingDefault = false
      const defaulted = myCards[action.payload.cardIndex]
      myCards.splice(action.payload.cardIndex, 1)
      myCards.unshift(defaulted)
      return {
        ...state,
        cards: [...myCards]
      }
    }
    case BILLING_DEFAULT_CARD_FAIL: {
      const myCards = state.cards
      myCards[action.payload.cardIndex].loadingDefault = false
      return {
        ...state,
        cards: [...myCards]
      }
    }
    default:
      return state
  }
}
