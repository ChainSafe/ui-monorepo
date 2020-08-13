import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography, Input, Button, Message } from 'src/components/kit'
import { formatCreditCardNumber } from 'src/util/cardHelpers'
import { creditCardValidator } from 'src/validators/billingValidator'
import { addCardApiAction } from 'src/store/actionCreators'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'src/store/store'

const FormContainer = styled.form``

const RightSpaceBox = styled.div`
  margin-right: 8px;
  width: 100%;
`

const LeftSpaceBox = styled.div`
  margin-left: 8px;
  width: 100%;
`

const CardNumberContainer = styled(RightSpaceBox)`
  min-width: 230px;
`

const BothSpaceBox = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  width: 100%;
`

const PaddedBox = styled.div`
  padding: 0.5em 0em;
`

const InputGroup = styled.div`
  display: flex;
`

const ButtonBox = styled.div`
  margin: 1em 0;
`

const ContentContainer = styled.div`
  margin: 1em 0em;
  width: 500px;
`

const AddCardForm: React.FC = () => {
  const [cardInputs, setCardInputs] = useState({
    cardName: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCVC: ''
  })

  const [creditCardError, setCreditCardError] = useState({
    cardName: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCVC: '',
    message: ''
  })

  const handleCreditCardNumberInputChange = (event: any) => {
    event.persist()
    setCardInputs(inputs => ({
      ...inputs,
      [event.target.name]: formatCreditCardNumber(event.target.value)
    }))
  }

  const handleCreditCardInputChange = (event: any) => {
    event.persist()
    setCardInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }))
  }

  const secondInputError = () => {
    return (
      creditCardError.cardNumber ||
      creditCardError.cardExpMonth ||
      creditCardError.cardExpYear ||
      creditCardError.cardCVC ||
      creditCardError.message
    )
  }

  const dispatch = useDispatch()
  const { loadingAddCard } = useSelector((state: AppState) => state.billing)

  const onAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    const { errors, isValid } = creditCardValidator(cardInputs)
    setCreditCardError({ ...creditCardError, ...errors })
    if (!isValid) {
      return
    }

    const onSuccess = () => {
      setCardInputs({
        cardName: '',
        cardNumber: '',
        cardExpMonth: '',
        cardExpYear: '',
        cardCVC: ''
      })
    }
    dispatch(addCardApiAction(cardInputs, onSuccess))
  }

  return (
    <FormContainer onSubmit={onAddCard}>
      <Typography.Title level={4}>Add a payment method</Typography.Title>
      <ContentContainer>
        <PaddedBox>
          <Input
            placeholder="Name on card"
            value={cardInputs.cardName}
            name="cardName"
            onChange={handleCreditCardInputChange}
          />
          {creditCardError.cardName && (
            <Message type="error" message={creditCardError.cardName} />
          )}
        </PaddedBox>
        <PaddedBox>
          <InputGroup>
            <CardNumberContainer>
              <Input
                placeholder="Card number"
                value={cardInputs.cardNumber}
                name="cardNumber"
                onChange={handleCreditCardNumberInputChange}
              />
            </CardNumberContainer>
            <BothSpaceBox>
              <Input
                placeholder="MM"
                name="cardExpMonth"
                value={cardInputs.cardExpMonth}
                onChange={handleCreditCardInputChange}
              />
            </BothSpaceBox>
            <BothSpaceBox>
              <Input
                placeholder="YYYY"
                name="cardExpYear"
                value={cardInputs.cardExpYear}
                onChange={handleCreditCardInputChange}
              />
            </BothSpaceBox>
            <LeftSpaceBox>
              <Input
                placeholder="CVC"
                name="cardCVC"
                value={cardInputs.cardCVC}
                onChange={handleCreditCardInputChange}
              />
            </LeftSpaceBox>
          </InputGroup>
          {secondInputError() && (
            <Message type="error" message={secondInputError()} />
          )}
        </PaddedBox>
        <ButtonBox>
          <Button htmlType="submit" loading={loadingAddCard}>
            Add card
          </Button>
        </ButtonBox>
      </ContentContainer>
    </FormContainer>
  )
}

export { AddCardForm }
