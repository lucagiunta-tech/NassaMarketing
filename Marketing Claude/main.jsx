import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MarketingStudio from './MarketingStudio.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketingStudio />
  </StrictMode>
)
