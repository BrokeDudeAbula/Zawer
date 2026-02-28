import React, { useState } from 'react'
import { reviewService } from '@/services/review'
import { formatRelativeTime } from '@/utils'
import type { Review } from '@/types'
import { RatingStars } from './RatingStars'

interface ReviewItemProps {
  review: Review
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likes, setLikes] = useState(review.likes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = async () => {
    if (isLiked) return
    try {
      await reviewService.likeReview(review.id)
      setLikes((prev) => prev + 1)
      setIsLiked(true)
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const getUserAvatar = () => {
    if (review.userAvatar) {
      return (
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    }
    const firstChar = review.userName.charAt(0).toUpperCase()
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
        {firstChar}
      </div>
    )
  }

  const contentLines = review.content.split('\n')
  const shouldShowExpandButton = contentLines.length > 3

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        {getUserAvatar()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="font-medium text-gray-900">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars value={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500">{review.rating}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>
          <div
            className={`text-gray-700 text-sm leading-relaxed ${
              !isExpanded && shouldShowExpandButton ? 'line-clamp-3' : ''
            }`}
          >
            {review.content}
          </div>
          {shouldShowExpandButton && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-sm mt-1 hover:text-blue-600"
            >
              {isExpanded ? '收起' : '展开全文'}
            </button>
          )}
          <button
            type="button"
            onClick={handleLike}
            disabled={isLiked}
            className={`flex items-center gap-1 mt-3 text-sm transition-colors ${
              isLiked
                ? 'text-red-500 cursor-default'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-2'}`}
              viewBox="0 0 24 24"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
