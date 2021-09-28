/**
 * Created by wangxin on 2018/6/12.
 */
import Vue from 'vue'
/**
 * json拼接为字符串
 * @param json
 * @returns {string}
 */
export function qs (json) {
  let str = ''
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      str += key + '=' + json[key] + '&'
    }
  }
  str = str.substr(0, str.lastIndexOf('&'))
  return str
}

/**
 * 生成指定长度的随机字符
 * @param length
 * @returns {string}
 */
export function genRandomStr (length) {
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let str = ''
  for (let i = 0; i < length; i++) {
    str += arr[parseInt(Math.random() * 36)]
  }
  return str
}

/**
 * 判断字符串是否为手机号
 * @param phone
 * @return {bool}
 */
export function isPhoneNo (phone) {
  var reg = /^1\d{10}$/
  var flag = reg.test(phone)
  return flag
}

/**
 * 计算日期差
 * @param start
 * @param end
 * @returns {*}
 */
export function getDateDiff (start, end) {
  if (!end) {
    return '借阅中'
  }
  let startTime = new Date(start)
  let endTime = new Date(end)
  let time = endTime - startTime
  let seconds = time / (1000 * 60)
  let minutes
  let hours
  let resultDate = `${seconds}分钟`
  if (seconds >= 60) {
    minutes = parseInt(seconds / 60)
    seconds = seconds % 60
    resultDate = `${minutes}小时${seconds}分钟`
  }
  if (minutes >= 60) {
    hours = parseInt(minutes / 60)
    minutes = minutes % 60
    resultDate = `${hours}天${minutes}小时`
  }
  return resultDate
}

/**
 * 格式化数值为","形式
 * @param number
 * @returns {string}
 */
export function formatNumber (number) {
  return String(number).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

/**
 * 在指定闭区间生成一个随机数
 * @param rangeL
 * @param rangeR
 */
export function genRandom (rangeL, rangeR) {
  return parseInt(Math.random() * (rangeR - rangeL + 1) + rangeL)
}

/**
 * 将对象转换成数组(类似于map结构)
 * @param obj
 * @returns {Array}
 * @constructor
 */
export function obj2Array (obj) {
  let arr = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newObj = {}
      newObj.key = key
      newObj.value = obj[key]
      arr.push(newObj)
    }
  }
  return arr
}

/**
 * 时间格式化
 * @param date 时间对象
 * @param fmt 格式：'yyyy-MM-dd hh:mm:ss'
 * @returns {*} 格式化后的时间
 */
export function formatDate (date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/**
 * 去掉字符串首尾的空格
 * @param str
 */
export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 获取字符串的长度
 * @param str
 * @returns {number}
 */
export function getLength (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len += 1
    }
  }
  return len
}

/**
 * 价格校验
 * @param price
 * @returns {Number}  如果是小数，只保留两位小数
 */
export function getPrice (price) {
  if (typeof price !== 'number') {
    return
  }
  if (price <= 0) {
    return
  }
  price += ''
  let intPart = ''
  let decPart = ''
  if (price.indexOf('.') !== -1) {
    intPart = price.substr(0, price.indexOf('.'))
    decPart = price.substr(price.indexOf('.') + 1, 2)
    return parseFloat(intPart + '.' + decPart)
  } else {
    return parseFloat(price)
  }
}

/**
 *  正则判断是字符串是否位数字
 *  @param string
 *  @returns {bool}
 */
export function isNumber (value) {
  var patrn = /^(-)?\d+(\.\d+)?$/
  if (patrn.exec(value) == null || value === '') {
    return false
  } else {
    return true
  }
}

/**
 * 个性化自定义打印
 */
export function customPrint (value) {
  if (Vue.prototype.$printEnable) {
	console.log(value);
  } 
}

/**
 * 格式化请求url
 * 将其转换为对象
 * 从而直接取各个参数的值
 */
export function confirmUrl (url) {
	var theRequest = {};
    if (url.indexOf("?") != -1) {
      var str = url.substring(url.indexOf("?") + 1);
      // var str = str.substr(1); 
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
}