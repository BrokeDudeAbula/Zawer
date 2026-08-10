interface CategoryChipsProps {
  categories: string[]
  selected: string[]
  onToggle: (category: string) => void
  onOpenFilter: () => void
  hasActiveFilters: boolean
}

export default function CategoryChips({
  categories,
  selected,
  onToggle,
  onOpenFilter,
  hasActiveFilters,
}: CategoryChipsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-0.5">
      <button
        type="button"
        onClick={onOpenFilter}
        className={`flex h-8 flex-shrink-0 items-center gap-1.5 rounded-pill px-3 text-gm-base font-medium shadow-gm-1 transition-colors ${
          hasActiveFilters
            ? 'bg-gm-blue text-white'
            : 'bg-white text-ink-primary hover:bg-surface-hover'
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        筛选
      </button>

      {categories.map((category) => {
        const isActive = selected.includes(category)
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            className={`h-8 flex-shrink-0 rounded-pill px-3.5 text-gm-base font-medium shadow-gm-1 transition-colors ${
              isActive
                ? 'bg-gm-blue text-white'
                : 'bg-white text-ink-primary hover:bg-surface-hover'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
