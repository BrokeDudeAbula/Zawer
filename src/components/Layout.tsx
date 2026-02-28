import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="border-b bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Zawer</h1>
      </header>

      {/* 中间内容区 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* 底部 Tab 栏 */}
      <nav className="border-t bg-white">
        <div className="flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center py-3 text-sm ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            地图
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center py-3 text-sm ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            搜索
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center py-3 text-sm ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            我的
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
