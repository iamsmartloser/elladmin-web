import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'vehicleBrandInfo/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'vehicleBrandInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'vehicleBrandInfo/',
    method: 'put',
    data
  })
}

export function getList(data) {
  return request.get('brand/list', {
    params: data
  })
}

export default { add, edit, del, getList }
