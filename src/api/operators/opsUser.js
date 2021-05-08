import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'opsUser/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'opsUser/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'opsUser/',
    method: 'put',
    data
  })
}

export default { add, edit, del }
