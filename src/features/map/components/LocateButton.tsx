interface LocateButtonProps {
  onClick: () => void
  loading?: boolean
}

export default function LocateButton({ onClick, loading = false }: LocateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="absolute bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
      title="回到我的位置"
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      ) : (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  )
}
