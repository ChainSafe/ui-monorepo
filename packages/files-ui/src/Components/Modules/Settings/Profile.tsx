import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  TextInput,
} from "@chainsafe/common-components"

const Profile: React.FC = () => {
  return (
    <Card fullWidth>
      <CardHeader title="Profile" />
      <CardBody>
        <TextInput onChange={() => {}} size="large" label="Name" />
      </CardBody>
    </Card>
  )
}

export default Profile
