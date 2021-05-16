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
    url: 'statistics/ratio/inspection',
    method: 'post',
    data: data
  })
}

// 本周举报占比统计
export function getSupervise(data) {
  return request({
    url: 'statistics/ratio/supervise',
    method: 'post',
    data: data
  })
}
// 本周举报分组统计
export function getSuperviseGroup(data) {
  return request({
    url: 'statistics/total/group/supervise',
    method: 'post',
    data: data
  })
}
// 举报已处理、巡检记录列表
export function getSuperviseInspection(data) {
  return request({
    url: 'statistics/total/every_day/supervise_inspection',
    method: 'post',
    data: data
  })
}

