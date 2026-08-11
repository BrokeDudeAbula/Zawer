import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { formatRelativeTime } from '@/utils/date'

function ProfileHeader({ onBackHome }: { onBackHome: () => void }) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center border-b border-outline bg-white px-2">
      <button
        type="button"
        onClick={onBackHome}
        aria-label="返回主页"
        title="返回主页"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
      >
        <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <h1 className="ml-1 text-gm-lg font-medium text-ink-primary">个人中心</h1>
    </header>
  )
}

function MenuIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    star: (
      <svg
        className="h-5 w-5 text-ink-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    clock: (
      <svg
        className="h-5 w-5 text-ink-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    pencil: (
      <svg
        className="h-5 w-5 text-ink-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  }
  return icons[icon] || icons.star
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout()
    }
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex h-full flex-col bg-surface-hover">
        <ProfileHeader onBackHome={() => navigate('/')} />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-6 rounded-full bg-surface-variant p-6">
            <svg
              className="h-16 w-16 text-ink-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-ink-primary">登录后查看更多</h2>
          <p className="mb-6 text-ink-secondary">登录后查看你的 Zawer 记录</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-gm bg-gm-blue px-8 py-3 font-medium text-white transition-colors hover:bg-gm-blue-hover"
          >
            去登录
          </button>
        </div>
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
    { icon: 'star', label: '我点过的 Zawer', path: '/profile/votes' },
    { icon: 'clock', label: '浏览历史', path: '/profile/history' },
    { icon: 'pencil', label: '编辑资料', path: '/profile/edit' },
  ]

  return (
    <div className="flex h-full flex-col bg-surface-hover">
      <ProfileHeader onBackHome={() => navigate('/')} />
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="space-y-4 p-4">
          {/* 用户信息卡片 */}
          <div className="rounded-gm-lg bg-white p-6 shadow-gm-1">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gm-blue-light text-2xl font-bold text-gm-blue">
                {user.nickname?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink-primary">{user.nickname}</h2>
                <p className="text-sm text-ink-secondary">{maskPhone(user.phone)}</p>
                <p className="text-xs text-ink-tertiary">
                  注册于 {formatRelativeTime(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* 数据概览 */}
          <div className="rounded-gm-lg bg-white p-4 text-center shadow-gm-1">
            <p className="text-2xl font-normal text-ink-primary">{user.zawerVoteCount}</p>
            <p className="text-gm-base text-ink-secondary">点过 Zawer</p>
          </div>

          {/* 功能列表 */}
          <div className="rounded-gm-lg bg-white shadow-gm-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex w-full items-center justify-between border-b border-outline px-4 py-4 last:border-0 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MenuIcon icon={item.icon} />
                  <span className="text-ink-primary">{item.label}</span>
                </div>
                <svg
                  className="h-5 w-5 text-ink-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* 退出登录按钮 */}
          <button
            onClick={handleLogout}
            className="w-full rounded-gm-lg bg-white py-4 text-center font-medium text-gm-red shadow-gm-1 hover:bg-[#fce8e6] transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}
