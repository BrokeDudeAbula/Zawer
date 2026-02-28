import React, { useState } from 'react'
import { reviewService } from '@/services/review'
import { getZawerEmoji } from '@/utils'
import type { DimensionRatings } from '@/types'
import { RatingStars } from './RatingStars'

interface RatingDialogProps {
  merchantId: string
  merchantName: string
  isOpen: boolean
  onClose: () => void
  onSubmitted: () => void
}

export const RatingDialog: React.FC<RatingDialogProps> = ({
  merchantId,
  merchantName,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [overallRating, setOverallRating] = useState(0)
  const [dimensionRatings, setDimensionRatings] = useState<DimensionRatings>({
    environment: 0,
    service: 0,
    price: 0,
    quality: 0,
  })
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleDimensionChange = (dimension: keyof DimensionRatings, value: number) => {
    setDimensionRatings((prev) => ({
      ...prev,
      [dimension]: value,
    }))
  }

  const handleSubmit = async () => {
    if (overallRating === 0 || content.trim().length === 0) {
      setShowError(true)
      return
    }

    try {
      setSubmitting(true)
      await reviewService.addReview({
        merchantId,
        userId: 'current-user',
        userName: '当前用户',
        rating: overallRating,
        dimensionRatings:
          dimensionRatings.environment > 0 ||
          dimensionRatings.service > 0 ||
          dimensionRatings.price > 0 ||
          dimensionRatings.quality > 0
            ? dimensionRatings
            : undefined,
        content: content.trim(),
      })
      onSubmitted()
      handleClose()
    } catch (error) {
      console.error('提交点评失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setOverallRating(0)
    setDimensionRatings({
      environment: 0,
      service: 0,
      price: 0,
      quality: 0,
    })
    setContent('')
    setShowError(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">评价商家</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">您正在评价</p>
            <p className="text-lg font-medium text-gray-900">{merchantName}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              总体评分
            </label>
            <div className="flex flex-col items-center">
              <RatingStars
                value={overallRating}
                onChange={setOverallRating}
                size="lg"
              />
              {overallRating > 0 && (
                <span className="text-4xl mt-3">{getZawerEmoji(5 - overallRating + 1)}</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              多维度评分 <span className="text-gray-400 font-normal">(可选)</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">环境</span>
                <RatingStars
                  value={dimensionRatings.environment}
                  onChange={(value) => handleDimensionChange('environment', value)}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">服务</span>
                <RatingStars
                  value={dimensionRatings.service}
                  onChange={(value) => handleDimensionChange('service', value)}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">价格</span>
                <RatingStars
                  value={dimensionRatings.price}
                  onChange={(value) => handleDimensionChange('price', value)}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">质量</span>
                <RatingStars
                  value={dimensionRatings.quality}
                  onChange={(value) => handleDimensionChange('quality', value)}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              点评内容
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setShowError(false)
              }}
              placeholder="分享您的真实体验..."
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                showError && content.trim().length === 0
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {showError && content.trim().length === 0 && (
                <span className="text-xs text-red-500">请输入点评内容</span>
              )}
              <span className={`text-xs ${content.length >= 500 ? 'text-red-500' : 'text-gray-400'} ml-auto`}>
                {content.length}/500
              </span>
            </div>
          </div>

          {showError && overallRating === 0 && (
            <p className="text-sm text-red-500 mb-4">请选择总体评分</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '提交中...' : '提交评价'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
