import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function MapSearchBar() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(isLoggedIn ? '/profile' : '/login')
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate('/search')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate('/search')
      }}
      className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-pill bg-white pl-4 pr-1.5 shadow-gm-2 transition-shadow hover:shadow-gm-3"
    >
      <svg
        className="h-5 w-5 flex-shrink-0 text-ink-secondary"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <span className="flex-1 truncate text-gm-base text-ink-secondary">在这里搜索</span>

      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label={isLoggedIn ? '个人中心' : '登录'}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-variant text-gm-base font-medium text-ink-secondary transition-colors hover:bg-outline"
      >
        {isLoggedIn && user?.avatar ? (
          <img src={user.avatar} alt="" className="h-full w-full object-cover" />
        ) : isLoggedIn && user?.nickname ? (
          user.nickname.slice(0, 1)
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </button>
    </div>
  )
}
