'use client'

import { Component } from 'react'

// The WebGL canvas is the one part of the site that can fail on a user's
// machine. Swallow it so a GPU problem never takes the page down with it.
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('3D model failed to render', {
      message: error instanceof Error ? error.message : null
    })
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default ModelErrorBoundary
