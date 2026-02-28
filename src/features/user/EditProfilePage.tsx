import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/auth-store'
// 使用 SVG 组件替代 heroicons

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const updateProfile = useAuthStore((state) => state.updateProfile || (() => Promise.resolve()))
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (user) {
      setNickname(user.nickname)
    }
  }, [isLoggedIn, user, navigate])

  const handleSave = async () => {
    if (!nickname.trim()) {
      alert('昵称不能为空')
      return
    }
    if (nickname.length > 20) {
      alert('昵称不能超过 20 个字')
      return
    }

    setLoading(true)
    try {
      await updateProfile({ nickname: nickname.trim() })
      navigate('/profile')
    } catch (error) {
      alert('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarClick = () => {
    alert('暂不支持更换头像')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="flex items-center space-x-4 border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-semibold text-gray-900">编辑资料</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="p-4">
        {/* 头像展示 */}
        <div className="mb-6 flex items-center justify-center">
          <button
            onClick={handleAvatarClick}
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 hover:bg-blue-200 transition-colors"
          >
            {user.nickname?.charAt(0) || 'U'}
            <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
        </div>

        {/* 昵称输入框 */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            昵称
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="请输入昵称"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            {nickname.length}/20
          </p>
        </div>
      </div>
    </div>
  )
}