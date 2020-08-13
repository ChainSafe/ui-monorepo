import {
  addCardApi,
  getCardsApi,
  setDefaultCardApi,
  removeCardApi,
  getCardTokenFromStripe
} from '../billingApi'
import {
  ADD_CARD_ROUTE,
  GET_CARDS_ROUTE,
  SET_DEFAULT_CARD_ROUTE,
  REMOVE_CARD_ROUTE,
  STRIPE_ADD_CARD
} from '../apiRoutes'
import MockAdapter from 'axios-mock-adapter'
import { privateAPICall } from '../apiRequest'
import axios from 'axios'

const mockAxios = new MockAdapter(axios)
const mockPrivate = new MockAdapter(privateAPICall)

const cardData = {
  card: {
    number: '',
    exp_month: 1,
    exp_year: 1,
    cvc: ''
  }
}

describe('Get stripe card API ', () => {
  it('API should resolve on successful response', () => {
    mockAxios.onPost(STRIPE_ADD_CARD).reply(200, { message: 'success' })

    const spy = jest.spyOn(axios, 'post')
    return getCardTokenFromStripe(cardData).then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject on bad request', () => {
    mockAxios
      .onPost(STRIPE_ADD_CARD)
      .reply(400, { message: 'Card data incorrect' })

    const spy = jest.spyOn(axios, 'post')
    return getCardTokenFromStripe(cardData).catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Add payment card API ', () => {
  it('API should resolve on successful response', () => {
    mockPrivate.onPost(ADD_CARD_ROUTE).reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'post')
    return addCardApi('id').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onPost(ADD_CARD_ROUTE)
      .reply(400, [{ type: 'general', message: 'ID not valid' }])

    const spy = jest.spyOn(privateAPICall, 'post')
    return addCardApi('id').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Get cards API', () => {
  it('API should resolve on successful response', () => {
    mockPrivate.onGet(GET_CARDS_ROUTE).reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'get')
    return getCardsApi().then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onGet(GET_CARDS_ROUTE)
      .reply(500, [{ type: 'general', message: 'Server error' }])

    const spy = jest.spyOn(privateAPICall, 'get')
    return getCardsApi().catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Set default cards API', () => {
  it('API should resolve on successful response', () => {
    mockPrivate
      .onPatch(SET_DEFAULT_CARD_ROUTE)
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'patch')
    return setDefaultCardApi('id').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onPatch(SET_DEFAULT_CARD_ROUTE)
      .reply(500, [{ type: 'general', message: 'Server error' }])

    const spy = jest.spyOn(privateAPICall, 'patch')
    return setDefaultCardApi('id').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Remove cards API', () => {
  it('API should resolve on successful response', () => {
    mockPrivate
      .onDelete(REMOVE_CARD_ROUTE('1'))
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'delete')
    return removeCardApi('1').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onDelete(REMOVE_CARD_ROUTE('1'))
      .reply(404, [{ type: 'general', message: 'Card not found' }])

    const spy = jest.spyOn(privateAPICall, 'delete')
    return removeCardApi('1').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})
