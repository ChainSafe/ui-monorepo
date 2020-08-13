import React from 'react'
import { Modal, Typography, Space, Button } from 'src/components/kit'
import { CloseCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const BodyContainer = styled.div`
  padding: 1em 0.75em 1em 0.75em;
  display: flex;
`

const FooterContainer = styled.div`
  padding: 1em 0 0 0;
  display: flex;
  justify-content: flex-end;
`

const CrossIcon = styled(CloseCircleOutlined)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5em;
  padding: 0em 0.5em 0 0;
`

const Title = styled(Typography)`
  font-weight: bold;
  margin-bottom: 0.5em;
  color: ${({ theme }) => theme.colors.primary};
`

const Description = styled(Typography)`
  color: ${({ theme }) => theme.colors.greyDark};
  font-size: 0.875em;
`

interface IProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  onOk: () => void
  okLoading?: boolean
}

const SureModal: React.FC<IProps> = props => {
  const { open, onClose, onOk, okLoading, title, description } = props

  return (
    <Modal
      visible={open}
      footer={null}
      closable={false}
      width={420}
      centered={true}
    >
      <BodyContainer>
        <CrossIcon />
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>
      </BodyContainer>
      <FooterContainer>
        <Space>
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button
            key="delete"
            type="primary"
            loading={okLoading}
            onClick={onOk}
          >
            Ok
          </Button>
        </Space>
      </FooterContainer>
    </Modal>
  )
}

export { SureModal }
