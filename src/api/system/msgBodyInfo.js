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

export function read(data) {
  return request({
    url: 'msg/read',
    method: 'post',
    data: convertToFormData(data)
  })
}
export default { add, edit, del, read}
