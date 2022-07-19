// 引入dayjs
import dayjs from 'dayjs'
// 配置想对时间
const relativeTIme = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTIme)

// 配置中文包，dayjs默认
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

export default dayjs
