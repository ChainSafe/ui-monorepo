import Validator from 'validator'
import { isEmpty } from './checker'

interface IStorageDeal {
  dealDuration: string
  replicationFactor: string
}

interface IStorageDealReturn {
  errors: IStorageDeal
  isValid: boolean
  data: {
    dealDuration: number
    replicationFactor: number
  }
}

export function storageParametersValidator(
  data: IStorageDeal
): IStorageDealReturn {
  const errors: IStorageDeal = {
    dealDuration: '',
    replicationFactor: ''
  }

  let dealDurationNum, replicationFactorNum

  if (Validator.isEmpty(data.dealDuration)) {
    errors.dealDuration = 'Deal duration is required'
  } else {
    dealDurationNum = parseInt(data.dealDuration)
    if (isNaN(dealDurationNum)) {
      errors.dealDuration = 'Deal duration must be in number of days'
    }
  }

  if (Validator.isEmpty(data.replicationFactor)) {
    errors.replicationFactor = 'Replication factor is required'
  } else {
    replicationFactorNum = parseInt(data.replicationFactor)
    if (isNaN(replicationFactorNum)) {
      errors.replicationFactor = 'Replication factor must be a number'
    }
    if (replicationFactorNum < 1) {
      errors.replicationFactor = 'Replication factor must be at least 1'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
    data: {
      dealDuration: dealDurationNum as number,
      replicationFactor: replicationFactorNum as number
    }
  }
}
