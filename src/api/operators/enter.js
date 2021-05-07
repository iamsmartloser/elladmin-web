import request from '@/utils/request'

// 获取运营商入驻条件
export function getEnterInfo(params) {
  return request({
    url: 'dict/enter_info',
    method: 'get',
    params
  })
}

// 修改运营商入驻条件
export function editEnterInfo(data) {
  return request.post('dict/enter_info/edit', data)
}
// export function editEnterInfo(data) {
//   return request({
//     url: 'dict/enter_info/edit',
//     method: 'post',
//     data
//   })
// }
// // 获取运营商入驻开关
// export function getEnterSwitch(params) {
//   return request({
//     url: 'dict/enter_switch',
//     method: 'get',
//     params
//   })
// }
//
// // 修改运营商入驻开关
// export function editEnterSwitch(data) {
//   return request({
//     url: 'dict/enter_switch/edit',
//     method: 'post',
//     data
//   })
// }
// // 获取运营商入驻规则
// export function getEnterRule(params) {
//   return request({
//     url: '/dict/enter_rule',
//     method: 'get',
//     params
//   })
// }
export default { getEnterInfo, editEnterInfo }
