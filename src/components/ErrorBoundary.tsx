import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[Momentum] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-screen px-6 bg-bg">
          <div className="bg-surface rounded-card shadow-soft p-8 max-w-md w-full text-center">
            <p className="text-4xl mb-3">😕</p>
            <h2 className="text-lg font-bold text-ink mb-2">Something went wrong</h2>
            <pre className="text-xs text-ink-muted bg-surface-soft rounded-xl p-3 text-left mb-5 overflow-auto max-h-40 whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => this.setState({ error: null })}
              className="bg-accent hover:bg-accent-strong text-white px-5 py-2.5 rounded-pill text-sm font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
