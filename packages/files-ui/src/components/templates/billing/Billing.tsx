import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Typography, Button } from 'src/components/kit'
import { AddCardForm } from './AddCardForm'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'src/store/store'
import { getCardsApiAction } from 'src/store/actionCreators'
import { CardBox } from './CardBox'
import { FilecoinPaymentModule } from 'src/components/modules/FilecoinPaymentModule/FilecoinPaymentModule'
import theme from 'src/assets/styles/theme.json'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
`

const LinkSpan = styled.span`
  text-decoration: underline;
  padding: 0 0.3em;
`

const ParentContainer = styled.div`
  width: 700px;
`

const AlertBox = styled.div`
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 0.5em 1em;
`

const CardFormContainer = styled.div`
  margin: 3em 0em;
  width: 500px;
  & .divider {
    margin: 35px 0;
    display: flex;
    align-items: center;
    &:before,
    &:after {
      content: '';
      display: block;
      flex-grow: 1;
      height: 1px;
      background-color: ${theme.colors.greyLight};
    }
    & span {
      display: block;
      margin: 0 20px;
    }
  }
`

const CardsContainer = styled.div`
  margin: 3em 0em;
`

const PaymentContainer = styled.div`
  margin: 3em 0em;
`

const Billing: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false)
  const dispatch = useDispatch()
  const { cards, loadingCards } = useSelector(
    (state: AppState) => state.billing
  )

  useEffect(() => {
    dispatch(getCardsApiAction())
  }, [dispatch])

  return (
    <Container>
      <ParentContainer>
        <Typography.Title level={2}>Billing</Typography.Title>
        <AlertBox>
          <Typography>ChainSafe Files is in ALPHA now.</Typography>
          <Typography>Please do not use your real credit card.</Typography>
          <Typography>
            Use one of the test cards from
            <LinkSpan>
              <a
                href="https://stripe.com/docs/testing"
                rel="noopener noreferrer"
                target="_blank"
              >
                here.
              </a>
            </LinkSpan>
          </Typography>
        </AlertBox>

        <CardsContainer>
          {!loadingCards ? (
            cards.map((card, index) => (
              <CardBox
                key={index}
                id={card.id}
                last4={card.last4}
                cardIndex={index}
                loadingDefault={card.loadingDefault}
                loadingRemove={card.loadingRemove}
              />
            ))
          ) : (
            <div>Loading payment methods...</div>
          )}
        </CardsContainer>
        <PaymentContainer>
          {showAddCard ? (
            <CardFormContainer>
              <AddCardForm />
              <Typography.Paragraph className={'divider'}>
                <span>or</span>
              </Typography.Paragraph>
              <FilecoinPaymentModule />
            </CardFormContainer>
          ) : (
            <Button type="primary" onClick={() => setShowAddCard(true)}>
              Add a payment method
            </Button>
          )}
        </PaymentContainer>
      </ParentContainer>
    </Container>
  )
}

export { Billing }
