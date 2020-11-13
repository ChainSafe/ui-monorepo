import {
  AmexCardIcon,
  VisaCardIcon,
  MastercardCardIcon,
  DinersclubCardIcon,
  DiscoverCardIcon,
  JcbCardIcon,
  UnionpayCardIcon,
  SvgIconProps,
} from "@imploy/common-components"

export const DEFAULT_CVC_LENGTH = 3
export const DEFAULT_CARD_FORMAT = /(\d{1,4})/g

export type CardType =
  | "visa"
  | "mastercard"
  | "amex"
  | "dinersclub"
  | "discover"
  | "jcb"
  | "unionpay"

export type CodeName = "CVV" | "CVC" | "CID" | "CVN" | "CVE"

export interface ICardType {
  displayName: string
  type: CardType
  format: RegExp
  startPattern: RegExp
  gaps: number[]
  lengths: number[]
  code: {
    name: CodeName
    length: number
  }
  icon?: React.FC<SvgIconProps>
}

export const CARD_TYPES: ICardType[] = [
  {
    displayName: "Visa",
    type: "visa",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^4/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
      name: "CVV",
      length: 3,
    },
    icon: VisaCardIcon,
  },
  {
    displayName: "Mastercard",
    type: "mastercard",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVC",
      length: 3,
    },
    icon: MastercardCardIcon,
  },
  {
    displayName: "American Express",
    type: "amex",
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    startPattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: "CID",
      length: 4,
    },
    icon: AmexCardIcon,
  },
  {
    displayName: "Diners Club",
    type: "dinersclub",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(36|38|30[0-5])/,
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: {
      name: "CVV",
      length: 3,
    },
    icon: DinersclubCardIcon,
  },
  {
    displayName: "Discover",
    type: "discover",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(6011|65|64[4-9]|622)/,
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: {
      name: "CID",
      length: 3,
    },
    icon: DiscoverCardIcon,
  },
  {
    displayName: "JCB",
    type: "jcb",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^35/,
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: "CVV",
      length: 3,
    },
    icon: JcbCardIcon,
  },
  {
    displayName: "UnionPay",
    type: "unionpay",
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^62/,
    gaps: [4, 8, 12],
    lengths: [14, 15, 16, 17, 18, 19],
    code: {
      name: "CVN",
      length: 3,
    },
    icon: UnionpayCardIcon,
  },
]

export const getCardTypeByValue = (value: string) => {
  const cardTypes = CARD_TYPES.filter((cardType) =>
    cardType.startPattern.test(value),
  )
  return cardTypes[0] ? cardTypes[0] : undefined
}

export const getCardTypeByType = (type: CardType) =>
  CARD_TYPES.filter((cardType) => cardType.type === type)[0]
