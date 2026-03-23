import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'

import App from './App'
import 'antd/dist/reset.css'
import './index.css'
import './styles/app.css'

const queryClient = new QueryClient() // khởi tạo query client dùng chung cho toàn app

// Điểm khởi động của ứng dụng React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#004286',
          colorSuccess: '#5FAE6F',
          colorWarning: '#F2C94C',
          colorError: '#E56B6F',
          colorBgLayout: '#EEF3FB',
          colorBgContainer: '#FFFFFF',
          colorText: '#183A70',
          colorBorderSecondary: '#D7E1F0',
          borderRadius: 16
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>
)
