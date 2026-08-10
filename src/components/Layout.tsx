import { Outlet } from 'react-router-dom'

// 仿 Google Maps：不设全局 header 与底部 Tab，导航由地图页悬浮搜索栏和各页返回按钮承担
export default function Layout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      {/* 各子页面自行决定是否滚动：地图页固定不滚，列表类页面用 h-full overflow-y-auto */}
      <Outlet />
    </div>
  )
}
