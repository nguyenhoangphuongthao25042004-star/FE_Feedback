import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1D4ED8',   // Primary
          colorSuccess: '#22C55E',   // Success
          colorWarning: '#F59E0B',   // Warning
          colorError: '#EF4444',     // Danger
          colorBgLayout: '#F5F7FA'   // Background
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>
)