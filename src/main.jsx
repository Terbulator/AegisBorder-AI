import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './i18n'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StrictMode>
  </ErrorBoundary>,
)
