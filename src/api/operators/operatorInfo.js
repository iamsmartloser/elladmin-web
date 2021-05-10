import request from '@/utils/request'

export function getPage(data) {
  return request.get('operators/page',{
    params: data
  })
}

export function add(data) {
  return request({
    url: 'api/operatorInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/operatorInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/operatorInfo',
    method: 'put',
    data
  })
}

export default { add, edit, del,getPage }
