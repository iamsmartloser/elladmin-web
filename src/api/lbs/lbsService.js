import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'lbsService/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'lbsService/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'lbsService/',
    method: 'put',
    data
  })
}

export default { add, edit, del }
