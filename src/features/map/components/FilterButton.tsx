import React from 'react'

interface FilterButtonProps {
  onClick: () => void
  hasActiveFilters: boolean
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onClick, hasActiveFilters }) => {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-24 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-lg hover:bg-gray-50 transition-colors"
    >
      <svg
        className="h-5 w-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">筛选</span>
      {hasActiveFilters && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          ●
        </span>
      )}
    </button>
  )
}
