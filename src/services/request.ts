import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { getStoredAuthToken } from '@/utils/auth'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const responseData = error.response?.data as { message?: string | string[] } | undefined
    const message = Array.isArray(responseData?.message)
      ? responseData.message.join(', ')
      : responseData?.message || '网络请求失败，请稍后重试'
    console.error('[API Error]', message)
    return Promise.reject(error)
  },
)

export default request
