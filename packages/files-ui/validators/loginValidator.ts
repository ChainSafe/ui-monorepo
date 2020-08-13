import Validator from 'validator'
import { isEmpty } from './checker'

interface ILoginInputs {
  email: string
  password: string
}

interface ILoginValReturn {
  errors: ILoginInputs
  isValid: boolean
}

export function loginValidator(data: ILoginInputs): ILoginValReturn {
  const errors = {
    email: '',
    password: ''
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

interface ISignupInputs {
  email: string
  password: string
  passwordConfirm: string
  firstName: string
  lastName: string
}

interface ISignupValReturn {
  errors: {
    email: string
    password: string
    name: string
  }
  isValid: boolean
}

export function signupValidator(data: ISignupInputs): ISignupValReturn {
  const errors = {
    email: '',
    password: '',
    name: ''
  }

  if (Validator.isEmpty(data.firstName) || Validator.isEmpty(data.lastName)) {
    errors.name = 'First and last name are required'
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (data.password !== data.passwordConfirm) {
    errors.password = 'Passwords do not match'
  }

  // const regexp = new RegExp("^(?=.*)(?=.*[a-z])(?=.*[A-Z])(?!.*).{4,8}$");
  // const regexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required'
  } else if (!Validator.isLength(data.password, { min: 8, max: undefined })) {
    errors.password = 'Password must be at least 8 characters long'
  }
  // else if (!regexp.test(data.password)) {
  //   errors.password = "Password must be alphanumeric and have uppercase and lowercase letters";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
