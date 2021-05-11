import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'vehicleInfo/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'vehicleInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'vehicleInfo/',
    method: 'put',
    data
  })
}
export function getVehicleDetail(data) {
  return request.get('vehicle/get',{params:data})
}
export default { add, edit, del, getVehicleDetail}
