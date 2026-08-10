import { useState } from 'react'

interface ZawerButtonProps {
  voted: boolean
  submitting: boolean
  onSubmit: (comment?: string) => void
}

export default function ZawerButton({ voted, submitting, onSubmit }: ZawerButtonProps) {
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')

  const handleClick = () => {
    // 已经点过的话直接取消，不必再问吐槽内容
    if (voted) {
      onSubmit()
      return
    }
    setShowComment(true)
  }

  const handleConfirm = () => {
    onSubmit(comment.trim() || undefined)
    setShowComment(false)
    setComment('')
  }

  if (showComment) {
    return (
      <div className="space-y-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          autoFocus
          rows={2}
          maxLength={500}
          placeholder="坑在哪？（选填）"
          className="w-full resize-none rounded-gm border border-outline px-3 py-2 text-gm-base text-ink-primary placeholder:text-ink-secondary focus:border-gm-blue focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowComment(false)
              setComment('')
            }}
            className="flex-1 rounded-pill border border-outline py-2.5 text-gm-base font-medium text-ink-primary transition-colors hover:bg-surface-hover"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 rounded-pill bg-zawer-danger py-2.5 text-gm-base font-medium text-white transition-colors hover:bg-[#b1271b] disabled:opacity-60"
          >
            {submitting ? '提交中…' : comment.trim() ? '确认 Zawer' : '直接 Zawer'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={submitting}
      className={`flex w-full items-center justify-center gap-2 rounded-pill py-3 text-gm-base font-medium transition-colors disabled:opacity-60 ${
        voted
          ? 'border border-zawer-danger bg-white text-zawer-danger hover:bg-[#fce8e6]'
          : 'bg-zawer-danger text-white hover:bg-[#b1271b]'
      }`}
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 002 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5a2 2 0 00-2-2zm4 0v12h4V3h-4z" />
      </svg>
      {voted ? '已点 Zawer，点击取消' : '这家店 Zawer'}
    </button>
  )
}
