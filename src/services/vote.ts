import type {
  AmapPoi,
  MyVote,
  PaginatedResponse,
  ToggleVoteResult,
  ZawerComment,
} from '@/types/api'
import request from '@/services/request'

export interface ToggleVotePayload {
  merchantId: string
  // 商家尚未入库时一并提交高德 POI 信息，由后端据此建档
  poi?: AmapPoi
  comment?: string
}

export const voteService = {
  async toggle(payload: ToggleVotePayload): Promise<ToggleVoteResult> {
    const response = await request.post('/votes', payload)
    return response as unknown as ToggleVoteResult
  },

  async hasVoted(merchantId: string): Promise<{ voted: boolean }> {
    const response = await request.get(`/votes/merchant/${merchantId}/voted`)
    return response as unknown as { voted: boolean }
  },

  async getComments(merchantId: string, page = 1, pageSize = 10) {
    const response = await request.get(`/votes/merchant/${merchantId}/comments`, {
      params: { page, pageSize },
    })
    return response as unknown as PaginatedResponse<ZawerComment>
  },

  async getMyVotes(): Promise<MyVote[]> {
    const response = await request.get('/votes/me')
    return response as unknown as MyVote[]
  },
}
