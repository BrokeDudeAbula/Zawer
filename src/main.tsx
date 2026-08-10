import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// 高德 JS API 2.0 的搜索类插件要求先注入安全密钥，必须早于任何 AMapLoader.load 调用
declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string }
  }
}

if (import.meta.env.VITE_AMAP_SECRET) {
  window._AMapSecurityConfig = { securityJsCode: import.meta.env.VITE_AMAP_SECRET }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
