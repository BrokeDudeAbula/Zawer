import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-surface-hover">
      <h1 className="text-4xl font-bold text-ink-primary">404</h1>
      <p className="mt-2 text-ink-secondary">页面未找到</p>
      <Link
        to="/"
        className="mt-4 rounded-gm bg-gm-blue px-4 py-2 text-white hover:bg-gm-blue-hover"
      >
        返回首页
      </Link>
    </div>
  )
}
