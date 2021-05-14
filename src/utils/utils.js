/**
 *工具函数集
 */

// uuid
export const uuid = (len = 32, radix = null) => {
  const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const chars = str.split('')
  const uuid = []
  radix = radix || chars.length
  if (len) {
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export function convertToFormData(data) {
  const formData = new FormData()
  if (!data) {
    return formData
  }
  // 如果传进对象为数组  返回数组
  if (data instanceof Array) {
    return data
    // return formData.append(item, data[item])
  }
  Object.keys(data).forEach((item) => {
    if (data[item] instanceof Array) {
      formData.append(item, data[item])
      // for (const value of data[item].values()) {
      //   formData.append(item, value)
      // }
    } else if (data[item] instanceof Object) {
      for (const key of Object.keys(data[item])) {
        formData.append(item + '.' + key, data[item][key])
      }
    } else if ((data[item]!==undefined)&&(data[item]!==null)) {
      formData.append(item, data[item])
    }
  })
  return formData
}

export function hideStr(str, frontLen, endLen) {
  if (!str) return ''
  let newStr
  const len = str.length - frontLen - endLen
  if (str.length === 2) {
    newStr = str.substring(0, 1) + '*'
  } else if (str.length > 2) {
    let char = ''
    for (let i = 0; i < len; i++) {
      char += '*'
    }
    newStr = str.substring(0, frontLen) + char + str.substring(str.length - endLen)
  } else {
    newStr = str
  }
  return newStr
}

// 判断是否是运营商
export function isOperators(roles) {
  if (!roles) return false
  // 运营商id为40，是不变的
  return roles.findIndex(r => r.id === 40) > -1
}
