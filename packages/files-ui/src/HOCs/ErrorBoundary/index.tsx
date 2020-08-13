/**
 *
 * ErrorBoundary
 *
 */

import React, { ReactNode } from 'react'

interface IOwnProps {
  children: ReactNode
}

type Props = IOwnProps

interface IOwnState {
  error: any
}

type State = IOwnState

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }

  // componentDidCatch(error: Error, errorInfo: any) {
  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  public render() {
    if (this.state.error) {
      // TODO Fallback error page
      // render fallback UI
      // return (
      //   <div className="error">
      //     <h1>Something bad happened and we've been notified</h1>
      //   </div>
      // );
      return this.props.children
    } else {
      // when there's not an error, render children untouched
      return this.props.children
    }
  }
}

export default ErrorBoundary
