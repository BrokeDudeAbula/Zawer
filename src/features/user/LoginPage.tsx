import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/user'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = searchParams.get('redirect') || '/'

  const validatePhone = (value: string) => {
    return /^1[3-9]\d{9}$/.test(value)
  }

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      setError('请输入正确的手机号')
      return
    }

    try {
      await userService.sendCode(phone)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhone(phone)) {
      setError('请输入正确的手机号')
      return
    }

    if (!code.trim()) {
      setError('请输入验证码')
      return
    }

    setLoading(true)
    setError('')

    try {
      await login(phone, code)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-surface-hover flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-gm-1 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-ink-secondary hover:text-ink-primary"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="ml-1">返回</span>
        </button>
      </header>

      {/* 登录表单 */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-gm-lg shadow-gm-2 p-8">
          <h1 className="text-2xl font-bold text-center text-ink-primary mb-8">欢迎使用 Zawer</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* 手机号输入 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink-primary mb-2">
                手机号
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                maxLength={11}
                className="w-full px-4 py-3 border border-outline rounded-gm focus:ring-2 focus:ring-gm-blue focus:border-transparent outline-none transition"
              />
            </div>

            {/* 验证码输入 */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-ink-primary mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入验证码"
                  maxLength={6}
                  className="flex-1 px-4 py-3 border border-outline rounded-gm focus:ring-2 focus:ring-gm-blue focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || !validatePhone(phone)}
                  className="px-6 py-3 bg-gm-red text-white rounded-gm font-medium hover:bg-[#b1271b] disabled:bg-gray-300 disabled:cursor-not-allowed transition whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-gm-red text-sm text-center bg-[#fce8e6] py-2 px-4 rounded-gm">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gm-red text-white rounded-gm font-medium hover:bg-[#b1271b] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 测试提示 */}
          <div className="mt-6 p-4 bg-[#fef7e0] border border-[#feefc3] rounded-gm">
            <p className="text-sm text-[#b06000] text-center">
              💡 测试账号：任意手机号，验证码：<span className="font-bold">1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
