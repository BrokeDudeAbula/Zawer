import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MapPage from './features/map/MapPage'
import MerchantDetailPage from './features/merchant/MerchantDetailPage'
import SearchPage from './features/merchant/SearchPage'
import ProfilePage from './features/user/ProfilePage'
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/merchant/:id" element={<MerchantDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
