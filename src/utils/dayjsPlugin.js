import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const timeFromNow = (timestamp) => {
  return dayjs(timestamp * 1000).fromNow()
}

/**
 * Convert unix timestamp to specific format
 * @param {number} timestamp
 * @param {string} format
 * @returns
 */
const formatTime = (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return dayjs(timestamp * 1000).format(format)
}

export default {
  install (Vue) {
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$timeFromNow = timeFromNow
    Vue.prototype.$formatTime = formatTime
  }
}
