import request from '@/utils/request'
import { convertToFormData } from '@/utils/utils'

export function add(data) {
  return request({
    url: 'lbs/storehouse/add',
    method: 'post',
    data: convertToFormData(data)
  })
}

export function del(ids) {
  console.log(ids)
  return request({
    url: 'lbs/storehouse/remove',
    method: 'post',
    data: convertToFormData({ ids: ids })
  })
}

export function edit(data) {
  return request({
    url: 'lbs/storehouse/update',
    method: 'post',
    data: convertToFormData(data)
  })
}
export default { add, edit, del }
