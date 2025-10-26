import { Component, ReactNode } from "react";

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and display errors
 *
 * Catches React component errors and displays a user-friendly error message.
 * Can be customized with a fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error info:", errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h2 className="error-boundary-title">Something went wrong</h2>
            <details className="error-boundary-details">
              <summary>Error details</summary>
              <pre className="error-boundary-pre">
                {this.state.error.toString()}
              </pre>
            </details>
            <button
              onClick={this.resetError}
              className="error-boundary-button"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
