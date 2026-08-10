import { ZawerComment } from '@/types/api'

interface ZawerCommentListProps {
  comments: ZawerComment[]
  loading?: boolean
}

export default function ZawerCommentList({ comments, loading }: ZawerCommentListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gm-blue border-t-transparent" />
      </div>
    )
  }

  if (comments.length === 0) {
    return <div className="py-6 text-center text-gm-base text-ink-secondary">还没有人留下吐槽</div>
  }

  return (
    <div className="divide-y divide-outline">
      {comments.map((item) => (
        <div key={item.id} className="py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            {item.userAvatar ? (
              <img src={item.userAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant text-gm-base font-medium text-ink-secondary">
                {item.userName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-gm-base font-medium text-ink-primary">
                {item.userName}
              </div>
              <div className="text-gm-sm text-ink-secondary">
                {new Date(item.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
          <p className="mt-2 text-gm-base leading-relaxed text-ink-primary">{item.comment}</p>
        </div>
      ))}
    </div>
  )
}
