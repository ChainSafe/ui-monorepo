export interface IConstants {
  popup: {
    width: number
    height: number // Maximum allowed at time of writing: chrome
  }
  modal: {
    height: {
      high: string
      normal: string
      low: string
    }
  }
  borderRadius: {
    full: {
      borderRadius: number
    }
    half: {
      borderRadius: number
    }
    quarter: {
      borderRadius: number
    }
    eighth: {
      borderRadius: number
    }
  }
  zIndex: {
    level1: number
    level2: number
    level3: number
    level4: number
  }
}

const constants: IConstants = {
  popup: {
    width: 328,
    height: 600 // Maximum allowed at time of writing: chrome
  },
  modal: {
    height: {
      high: '90vh',
      normal: '82vh',
      low: '70vh'
    }
  },
  borderRadius: {
    full: {
      borderRadius: 16
    },
    half: {
      borderRadius: 8
    },
    quarter: {
      borderRadius: 4
    },
    eighth: {
      borderRadius: 2
    }
  },
  zIndex: {
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4
  }
}

export type IConstantsInput = {
  readonly [K in keyof IConstants]+?: IConstants[K]
}

const createConstants = (constantsInput?: IConstantsInput): IConstants => {
  const newConstants: IConstants = {
    ...constants,
    ...constantsInput
  }

  return newConstants
}

export default createConstants
