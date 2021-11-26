/**
 * Created by wangxin on 2018/6/12.
 */
import Vue from 'vue'

export function getDeviceUUID() {
	let deviceId = uni.getStorageSync('uni_deviceId') ||
		uni.getSystemInfoSync().deviceId ||
		uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2);

	uni.setStorageSync('uni_deviceId', deviceId)
	return deviceId;
}



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

export const _debounce = (fn, t) => {
	const delay = t || 500; 
	let timer;
	return function() {
		let args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			timer = null;
			fn.apply(this, args);
		}, delay);
	}
};

export const _throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {};
    // 定时器回调函数
    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      // 用于下面函数的第一个 if 判断
      previous = options.leading === false ? 0 : _.now();
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      // 获得当前时间戳
      var now = _.now();
      // 首次进入前者肯定为 true
	  // 如果需要第一次不执行函数
	  // 就将上次时间戳设为当前的
      // 这样在接下来计算 remaining 的值时会大于0
      if (!previous && options.leading === false) previous = now;
      // 计算剩余时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 如果当前调用已经大于上次调用时间 + wait
      // 或者用户手动调了时间
 	  // 如果设置了 trailing，只会进入这个条件
	  // 如果没有设置 leading，那么第一次会进入这个条件
	  // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
	  // 其实还是会进入的，因为定时器的延时
	  // 并不是准确的时间，很可能你设置了2秒
	  // 但是他需要2.2秒才触发，这时候就会进入这个条件
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing
	    // 没有的话就开启一个定时器
        // 并且不能不能同时设置 leading 和 trailing
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };