import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import MapPage from './features/map/MapPage'
import MerchantDetailPage from './features/merchant/MerchantDetailPage'
import SearchPage from './features/merchant/SearchPage'
import { ProfilePage, LoginPage, MyVotesPage, HistoryPage, EditProfilePage } from './features/user'
import NotFound from './components/NotFound'
import { useAuthStore } from './stores/auth-store'

function App() {
  const refreshUser = useAuthStore((state) => state.refreshUser)

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 - 独立页面，不在 Layout 内 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 主应用 - 包含底部 Tab */}
        <Route element={<Layout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/merchant/:id" element={<MerchantDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 个人中心子路由 */}
          <Route path="/profile/votes" element={<MyVotesPage />} />
          <Route path="/profile/history" element={<HistoryPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
