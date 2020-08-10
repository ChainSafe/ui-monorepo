import Validator from 'validator'
import { isEmpty } from './checker'

interface ICreditCard {
  cardName: string
  cardNumber: string
  cardExpMonth: string
  cardExpYear: string
  cardCVC: string
}

interface ICreditCardReturn {
  errors: ICreditCard
  isValid: boolean
}

export function creditCardValidator(data: ICreditCard): ICreditCardReturn {
  const errors = {
    cardName: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCVC: ''
  }

  if (Validator.isEmpty(data.cardName)) {
    errors.cardName = 'Name on card is required'
  }

  if (Validator.isEmpty(data.cardNumber)) {
    errors.cardNumber = 'Card number is required'
  } else {
    const cardNumber = data.cardNumber.replace(/\s/g, '')
    if (!Validator.isNumeric(cardNumber)) {
      errors.cardNumber = 'Card number is invalid'
    }
  }

  if (
    Validator.isEmpty(data.cardExpMonth) ||
    !Validator.isNumeric(data.cardExpMonth)
  ) {
    errors.cardExpMonth = 'Card expiration month is required'
  }

  if (
    Validator.isEmpty(data.cardExpYear) ||
    !Validator.isNumeric(data.cardExpYear)
  ) {
    errors.cardExpYear = 'Card expiration year is required'
  }

  if (Validator.isEmpty(data.cardCVC) || !Validator.isNumeric(data.cardCVC)) {
    errors.cardCVC = 'Card CVC is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
