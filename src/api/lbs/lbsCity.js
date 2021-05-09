import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'lbsCity/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'lbsCity/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'lbsCity/',
    method: 'put',
    data
  })
}
// 城市列表 所有
export function getList(data) {
  return request.get('city/page',{params: data})
}

export default { add, edit, del, getList }
