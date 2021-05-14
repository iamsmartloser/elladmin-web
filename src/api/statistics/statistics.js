import request from '@/utils/request'
import { convertToFormData } from '@/utils/utils'

// 数量统计
export function getTotal(data) {
  return request({
    url: 'statistics/total',
    method: 'post',
    data: data
  })
}

// 今日巡检占比统计
export function getInspection(data) {
  return request({
    url: 'statistics/ratio/today/inspection',
    method: 'post',
    data: data
  })
}

