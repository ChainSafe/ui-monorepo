export interface IUser {
  id: string
  email: string
  firstName: string
  lastName: string
  verified: boolean
  billing: boolean
  address: string
  joinedDate: Date
  emailChanged: Date
}

export interface IPaymentCard {
  id: string
  last4: string
}

export type IAppTheme = 'light' | 'dark'
