import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import MapPage from './features/map/MapPage'
import MerchantDetailPage from './features/merchant/MerchantDetailPage'
import SearchPage from './features/merchant/SearchPage'
import ProfilePage from './features/user/ProfilePage'
import LoginPage from './features/user/LoginPage'
import NotFound from './components/NotFound'
import { useAuthStore } from './stores/auth-store'

// 占位组件 - 后续 sub agent 会实现
const FavoritesPage = () => <div className="p-4">我的收藏 - 开发中</div>
const ReviewsPage = () => <div className="p-4">我的点评 - 开发中</div>
const HistoryPage = () => <div className="p-4">浏览历史 - 开发中</div>
const EditProfilePage = () => <div className="p-4">编辑资料 - 开发中</div>

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
          <Route path="/profile/favorites" element={<FavoritesPage />} />
          <Route path="/profile/reviews" element={<ReviewsPage />} />
          <Route path="/profile/history" element={<HistoryPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
