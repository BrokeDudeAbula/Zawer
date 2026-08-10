import { useNavigate } from 'react-router-dom'

interface LoginGuardProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginGuard({ isOpen, onClose }: LoginGuardProps) {
  const navigate = useNavigate()

  if (!isOpen) {
    return null
  }

  const handleGoToLogin = () => {
    onClose()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 居中弹窗 */}
      <div className="relative bg-white rounded-gm-lg shadow-2xl p-8 mx-4 max-w-sm w-full z-10">
        {/* 图标 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#fef7e0] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gm-yellow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 提示文字 */}
        <h3 className="text-xl font-bold text-center text-ink-primary mb-2">请先登录</h3>
        <p className="text-center text-ink-secondary mb-6">请先登录后再操作此功能</p>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-outline text-ink-primary rounded-gm font-medium hover:bg-surface-hover transition"
          >
            取消
          </button>
          <button
            onClick={handleGoToLogin}
            className="flex-1 py-3 px-4 bg-gm-red text-white rounded-gm font-medium hover:bg-[#b1271b] transition"
          >
            去登录
          </button>
        </div>
      </div>
    </div>
  )
}
