import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cyber/cyber.css'
import CommandCenter from './CommandCenter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CommandCenter />
  </StrictMode>,
)
