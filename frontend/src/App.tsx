import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient'
import Dashboard from './pages/Dashboard'
import ErrorBoundary from './components/Common/ErrorBoundary'
import ToastProvider from './components/Common/Toast'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
