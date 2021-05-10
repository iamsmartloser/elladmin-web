import request from '@/utils/request'
import { convertToFormData } from '@/utils/utils'

export function add(data) {
  console.log('data',data)
  return request({
    url: 'msg/save',
    method: 'post',
    data: convertToFormData(data)
  })
}

export function del(ids) {
  return request({
    url: 'msg/remove',
    method: 'post',
    data: convertToFormData({ ids: ids })
  })
}

export function edit(data) {
  return request({
    url: 'msg/update',
    method: 'post',
    data: convertToFormData(data)
  })
}

// 阅读消息
export function read(data) {
  return request({
    url: 'msg/read',
    method: 'post',
    data: convertToFormData(data)
  })
}
// 查询消息回复 分页
export function receiveList(data) {
  return request.get('msg/receive/list',{params: data})
}

// 回复消息
export function receive(data) {
  return request({
    url: 'msg/receive',
    method: 'post',
    data: convertToFormData(data)
  })
}
// 获取消息详情
export function getMsgDetail(data) {
  return request({
    url: 'msg/get',
    method: 'post',
    data: convertToFormData(data)
  })
}
// 查询未读消息总数
export function msgNumber(data) {
  return request.get('msg/number',{params: data})
}
export default { add, edit, del, read, receiveList, receive,msgNumber,getMsgDetail}
