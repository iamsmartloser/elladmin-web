import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
// 使用中文语言包
dayjs.locale('zh-cn')

/**
 * 格式化时间
 * @params { value } 格式化的日期 非Unix时间戳
 * @params { format } 格式化的格式
 * @return String
 */
export const formatDate = (value, format) => {
  if (!value) return '--'
  return dayjs(value).format(format || 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 比较时差
 */
export const formatDayDiff = (value, format) => dayjs().diff(value, format || 'day')

