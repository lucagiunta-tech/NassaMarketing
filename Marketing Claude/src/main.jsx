import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/app.css'
import './styles/fixes.css'
import App from './App.jsx'
import ClientPortal from './ClientPortal.jsx'
import { AppErrorBoundary } from './ErrorBoundary.jsx'
import { parseClientRoute } from './utils/clientAuth.js'

const { isClientMode, clientId, token } = parseClientRoute();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      {isClientMode
        ? <ClientPortal clientId={clientId} token={token} />
        : <App />
      }
    </AppErrorBoundary>
  </StrictMode>,
)
