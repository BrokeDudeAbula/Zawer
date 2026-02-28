import { formatRelativeTime } from '@/utils/date'

function MenuIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    star: (
      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    bookmark: (
      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    clock: (
      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    pencil: (
      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  }
  return icons[icon] || icons.star
}

export default function ProfilePage() {  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout()
    }
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="mb-6 rounded-full bg-gray-200 p-6">
          <UserIcon className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">登录后查看更多</h2>
        <p className="mb-6 text-gray-600">登录即可查看个人中心、发表点评、收藏商家</p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          去登录
        </button>
      </div>
    )
  }

  const maskPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    return phone
  }

  const menuItems = [
    { icon: 'star', label: '我的点评', path: '/profile/reviews' },
    { icon: 'bookmark', label: '我的收藏', path: '/profile/favorites' },
    { icon: 'clock', label: '浏览历史', path: '/profile/history' },
    { icon: 'pencil', label: '编辑资料', path: '/profile/edit' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="space-y-4 p-4">
        {/* 用户信息卡片 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {user.nickname?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.nickname}</h2>
              <p className="text-sm text-gray-500">{maskPhone(user.phone)}</p>
              <p className="text-xs text-gray-400">
                注册于 {formatRelativeTime(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 数据概览 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{user.reviewCount}</p>
            <p className="text-sm text-gray-500">发布点评</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{user.likeCount}</p>
            <p className="text-sm text-gray-500">获赞数</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{user.favoriteCount}</p>
            <p className="text-sm text-gray-500">收藏商家</p>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="rounded-xl bg-white shadow-sm">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MenuIcon icon={item.icon} />
                <span className="text-gray-900">{item.label}</span>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* 退出登录按钮 */}
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-white py-4 text-center font-medium text-red-500 shadow-sm hover:bg-red-50 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
