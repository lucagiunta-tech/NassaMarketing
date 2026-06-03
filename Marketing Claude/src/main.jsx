import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/app.css'
import App from './App.jsx'
import ClientPortal from './ClientPortal.jsx'
import { AppErrorBoundary } from './ErrorBoundary.jsx'
import { parseClientRoute } from './utils/clientAuth.js'

const { isClientMode, projectId, token } = parseClientRoute();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      {isClientMode
        ? <ClientPortal projectId={projectId} token={token} />
        : <App />
      }
    </AppErrorBoundary>
  </StrictMode>,
)
