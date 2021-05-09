import request from '@/utils/request'
import { convertToFormData } from '@/utils/utils'

export function add(data) {
  return request({
    url: 'city/save',
    method: 'post',
    data: convertToFormData(data)
  })
}

export function del(ids) {
  return request({
    url: 'city/remove',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/city/update',
    method: 'put',
    data
  })
}
// 城市列表 所有
export function getList(data) {
  return request.get('city/page',{params: data})
}

export default { add, edit, del, getList }
