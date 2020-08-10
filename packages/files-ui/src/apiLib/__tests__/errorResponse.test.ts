import {
  convertErrors,
  handleApiErr,
  handleApiErrPublic
} from '../errorResponse'

const getError = (data: any, status = 400) => ({
  config: {},
  isAxiosError: true,
  message: '',
  name: '',
  toJSON: () => ({}),
  response: {
    status,
    data,
    config: {},
    headers: {},
    statusText: '',
    request: {}
  }
})

jest.mock('../../store/actionCreators', () => ({
  logoutAndReset: jest.fn()
}))

describe('convert errors function', () => {
  it('should return undefined on undefined input', () => {
    // convertErrors
    const myErrors = getError(undefined)
    const convertedError = convertErrors(myErrors)
    const errorResponse = convertedError.response

    expect(errorResponse).toMatchObject({ data: undefined })
  })

  it('should return null on null input', () => {
    // convertErrors
    const myErrors = getError(null)
    const convertedError = convertErrors(myErrors)
    const errorResponse = convertedError.response

    expect(errorResponse).toMatchObject({ data: null })
  })

  it('should return undefined on non array input', () => {
    // convertErrors
    const myErrors = getError({ random: 'random' })
    const convertedError = convertErrors(myErrors)
    const errorResponse = convertedError.response

    expect(errorResponse).toMatchObject({ data: undefined })
  })

  it('should return object without message with only type', () => {
    // convertErrors
    const myErrors = getError([{ type: 'random' }])
    const convertedError = convertErrors(myErrors)
    const errorResponse = convertedError.response

    expect(errorResponse).toMatchObject({
      data: {
        random: undefined
      }
    })
  })

  it('should return object with good array', () => {
    // convertErrors
    const myErrors = getError([{ type: 'random', message: 'random' }])
    const convertedError = convertErrors(myErrors)
    const errorResponse = convertedError.response

    expect(errorResponse).toMatchObject({
      data: {
        random: 'random'
      }
    })
  })
})

describe('handle public api error', () => {
  it('no status should return on status 504 error', () => {
    const myError = {
      config: {},
      isAxiosError: true,
      message: '',
      name: '',
      toJSON: () => ({}),
      response: undefined
    }

    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 504,
      message: 'Unknown error'
    })
  })

  it('on status 500 error', () => {
    const myError = getError({}, 500)
    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 500,
      data: {}
    })
  })

  it('on status 401 error', () => {
    const myError = getError({}, 401)
    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 401,
      data: {}
    })
  })

  it('on status 400 error', () => {
    const myError = getError({}, 400)
    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 400,
      data: {}
    })
  })

  it('on status 403 error', () => {
    const myError = getError({}, 403)
    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 403,
      data: {}
    })
  })

  it('on status 300 error, not processed error', () => {
    const myError = getError({}, 300)
    const errorData = handleApiErrPublic(myError)

    expect(errorData).toMatchObject({
      status: 300,
      data: {}
    })
  })
})

describe('handle api error private', () => {
  const dispatch = jest.fn()

  it('no status should return on status 504 error', () => {
    const myError = {
      config: {},
      isAxiosError: true,
      message: '',
      name: '',
      toJSON: () => ({}),
      response: undefined
    }

    const errorData = handleApiErr(myError, dispatch)

    expect(errorData).toMatchObject({
      status: 504,
      message: 'Unknown error'
    })
  })

  it('on status 500 error', () => {
    const myError = getError({}, 500)
    const errorData = handleApiErr(myError, dispatch)

    expect(errorData).toMatchObject({
      status: 500,
      data: {}
    })
  })

  it('on 401 redirect and dispatch', () => {
    const myError = getError({}, 401)
    const errorData = handleApiErr(myError, dispatch)

    expect(dispatch).toHaveBeenCalled()
    expect(errorData).toMatchObject({
      status: 401,
      data: {}
    })
  })

  it('on status 400 error', () => {
    const myError = getError({}, 400)
    const errorData = handleApiErr(myError, dispatch)

    expect(errorData).toMatchObject({
      status: 400,
      data: {}
    })
  })

  it('on status 403 error', () => {
    const myError = getError({}, 403)
    const errorData = handleApiErr(myError, dispatch)

    expect(errorData).toMatchObject({
      status: 403,
      data: {}
    })
  })

  it('on status 300 error, not processed error', () => {
    const myError = getError({}, 300)
    const errorData = handleApiErr(myError, dispatch)

    expect(errorData).toMatchObject({
      status: 300,
      data: {}
    })
  })
})
