interface LocateButtonProps {
  onClick: () => void
  loading?: boolean
}

export default function LocateButton({ onClick, loading = false }: LocateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-gm-2 transition-colors hover:bg-surface-hover active:bg-surface-variant disabled:opacity-60"
      title="回到我的位置"
      aria-label="回到我的位置"
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gm-blue border-t-transparent" />
      ) : (
        <svg className="h-5 w-5 text-ink-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
      )}
    </button>
  )
}
