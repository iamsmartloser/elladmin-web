import request from '@/utils/request'
import { convertToFormData } from '@/utils/utils'

// 获取运营商列表
export function getPage(data) {
  return request.get('operators/page',{
    params: data
  })
}
// 获取运营商公钥
export function getOperatorAppSecrete(data) {
  return request.get('operators/app_secret',{
    params: data
  })
}
// 重置运营商公钥
export function resetOperatorAppSecrete(data) {
  return request.get('operators/app_secret/reset',{
    params: data
  })
}
export function add(data) {
  console.log('data',data)
  return request({
    url: 'operators/add',
    method: 'post',
    data: data
  })
}

export function del(ids) {
  return request({
    url: 'operators/remove',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'operators/change',
    method: 'post',
    data: data
  })
}

export default { add, edit, del,getPage, getOperatorAppSecrete, resetOperatorAppSecrete }
