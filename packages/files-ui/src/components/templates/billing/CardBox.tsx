import React, { useState } from 'react'
import styled from 'styled-components'
import {
  removeCardApiAction,
  setDefaultCardApiAction
} from 'src/store/actionCreators'
import { useDispatch } from 'react-redux'
import { Button } from 'src/components/kit'
import { SureModal } from 'src/components/organisms/modals/SureModal'

const Container = styled.div`
  margin: 1.5em 0em;
  width: 400px;
`

const ButtonContainer = styled.div`
  display: flex;
`

const FlexGrow = styled.div`
  flex: 1;
`

const CardNumberBox = styled.div`
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.greyLight};
  padding: 0.5em 1em;
`

interface IProps {
  cardIndex: number
  id: string
  last4: string
  loadingRemove: boolean
  loadingDefault: boolean
}

const CardBox: React.FC<IProps> = props => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { cardIndex, id, last4, loadingDefault, loadingRemove } = props
  const dispatch = useDispatch()

  const onRemoveCard = () => {
    dispatch(removeCardApiAction(cardIndex, id, onCloseDeleteModal))
  }

  const onDefaultCard = () => {
    dispatch(setDefaultCardApiAction(cardIndex, id))
  }

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true)
  }

  return (
    <Container>
      {cardIndex === 0 ? (
        <div>
          Default payment method
          <CardNumberBox>**** **** **** {last4}</CardNumberBox>
        </div>
      ) : (
        <div>
          <ButtonContainer>
            <FlexGrow />
            <Button
              size="small"
              type="text"
              onClick={onDefaultCard}
              disabled={loadingDefault}
            >
              Set default
            </Button>
            <Button size="small" type="text" onClick={onOpenDeleteModal}>
              Remove card
            </Button>
          </ButtonContainer>
          <CardNumberBox>**** **** **** {last4}</CardNumberBox>
        </div>
      )}
      <SureModal
        title="Are you sure you want to remove this payment method"
        description="Payment method will be deleted permanently"
        open={showDeleteModal}
        onClose={onCloseDeleteModal}
        onOk={onRemoveCard}
        okLoading={loadingRemove}
      />
    </Container>
  )
}

export { CardBox }
