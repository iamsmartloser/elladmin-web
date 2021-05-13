import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'lbsStation/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'lbsStation/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'lbsStation/',
    method: 'put',
    data
  })
}

export default { add, edit, del }
