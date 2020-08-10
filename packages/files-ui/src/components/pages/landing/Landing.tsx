import React from 'react'
import { AppState } from 'src/store/store'
import { useSelector } from 'react-redux'
import { Fps } from 'src/components/templates/fps/fps'
import { Landing } from 'src/components/templates/landing/Landing'
import { DashboardLayout } from 'src/components/layouts/DashboardLayout'

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth)

  return isAuthenticated ? (
    <DashboardLayout>
      <Fps />
    </DashboardLayout>
  ) : (
    <Landing />
  )
}

export { LandingPage }
