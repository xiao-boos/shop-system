const formatLeftTime = etime => {
  var timestamp = Date.parse(new Date());
  var surplus = etime - timestamp;
  if (surplus > 0) {
    var secondTime = surplus / 1000;// 毫秒转为秒
    var second = Math.floor(secondTime % 60);       // 计算秒
    var minute = Math.floor((secondTime / 60) % 60); // 计算分
    var hour = Math.floor((secondTime / 3600)); // 计算小时
    return [hour, minute, second].map(formatNumber).join(':')
  }
  return null;
}

// 如果是yyyy-MM-dd HH:mm:ss格式直接转Date，在iOS上不支持
// 参考链接：https://blog.csdn.net/sourcemyx/article/details/78968768
const parseDate = dateStr => {
  var arr = dateStr.split(/[- :]/);
  let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  return Date.parse(nndate);
}

// 获取当前时间 yyyy-mm-dd
const getNowDate = () => {
  // 获取当前日期
  const date = new Date();
  // 获取当前月份
  let nowMonth = date.getMonth() + 1;
  // 获取当前是几号
  let strDate = date.getDate();
  return [date.getFullYear(), nowMonth, strDate].map(formatNumber).join('-');
};

//获取n天后日期  格式yyyy-mm-dd
const dateAfter = (timeInterval) => {
  var currDate = new Date();
  var dateNew = new Date(currDate)
  dateNew.setDate(currDate.getDate() + timeInterval)
  let yearNew = dateNew.getFullYear()
  let monthNew = dateNew.getMonth() + 1
  let dayNew = dateNew.getDate()
  return [yearNew, monthNew, dayNew].map(formatNumber).join('-');
}

// 格式化给定的date，格式：yyyy-MM-dd
const formatTime=(date, fmt) => {
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 格式化给定的date，格式：yyyy-MM-dd hh:mm
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateDay = date.getDate()
    return [year, month, dateDay].map(formatNumber).join('-');
  }

// 获取指定日期为周几（中文）
const getChineseWeekday = dateStr => {
    var arr = dateStr.split(/[- :]/);
    let nndate = new Date(arr[0], arr[1] - 1, arr[2]);
    let chineseWeekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return chineseWeekdays[nndate.getDay()];
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 用于比较小程序的基础库版本
const compareVersion = (v1, v2) => {
  v1 = v1.split('.');
  v2 = v2.split('.');
  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

// rpx转px
const rpx2px = (length) => {
  let deviceWidth = wx.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
  let px = (deviceWidth / 750) * Number(length)
  return Math.floor(px);
}

// px转rpx
const px2rpx = (length) => {
  let deviceWidth = wx.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
  let rpx = (750 / deviceWidth) * Number(length)
  return Math.floor(rpx);
}

/**
 * 判断手机是否为存在底部小黑条安全距离的iphone系列
 * @returns {boolean}
 */
const isIPhoneX = () => {
  let screenHeight = wx.getSystemInfoSync().screenHeight;
  let bottom = wx.getSystemInfoSync().safeArea.bottom;
  return screenHeight !== bottom;
}

// 获取底部小黑条安全距离高度（rpx）
const getSafeAreaHeight = () => {
  let screenHeight = wx.getSystemInfoSync().screenHeight;
  let bottom = wx.getSystemInfoSync().safeArea.bottom;
  return px2rpx(screenHeight - bottom);
}

/**
 * 根据身份证号返回性别，0女1男
 * @param idCardNo 身份证号
 */
const getSexCodeByIdCardNo = (idCardNo) => {
  if (idCardNo.length === 18) {
    if (parseInt(idCardNo.charAt(16)) % 2 === 1) {
      return 1
    } else {
      return 0
    }
  }else if (idCardNo.length === 15) {
    if (parseInt(idCardNo.charAt(14) % 2 === 1)) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * 根据身份证号返回生日，格式yyyy-MM-dd
 * @param idCardNo
 * @returns {string}
 */
const getBirthdayByIdCardNo = (idCardNo) => {
  if (idCardNo.length == 18) {
    let year = idCardNo.substring(6, 10);
    let month = idCardNo.substring(10, 12);
    let day = idCardNo.substring(12, 14);
    return year + '-' + month + '-' + day;
  } else {
    let year = idCardNo.substring(6, 8);
    let month = idCardNo.substring(8, 10);
    let day = idCardNo.substring(10, 12);
    return year + '-' + month + '-' + day;
  }
}

/**
 * 根据身份证号返回年龄
 * @param idCardNo
 * @returns {number}
 */
const getAgeByIdCardNo = (idCardNo) => {
  let birthday = getBirthdayByIdCardNo(idCardNo);
  let nowDate = new Date();
  let age = nowDate.getFullYear() - parseInt(birthday.substring(0, 4));
  let var_age = 0;
  if (nowDate.getMonth() >= parseInt(birthday.substring(5, 7))) {
    var_age = age;
  } else {
    var_age = age - 1;
  }
  return (var_age < 0 ? 0 : var_age);
}

/**
 * 公用脱敏方法
 * @param str 脱敏字符串
 * @param begin 起始保留长度，从0开始
 * @param end 结束保留长度，到str.length结束
 * @returns {string}
 */
const desensitizedCommon = (str, begin, end) => {
  if (!str || (begin + end) >= str.length) {
    return "";
  }

  let leftStr = str.substring(0, begin);
  let rightStr = str.substring(str.length - end, str.length);

  let strCon = ''
  for (let i = 0; i < str.length - end - begin; i++) {
    strCon += '*';
  }
  return leftStr + strCon + rightStr;
}

/**
 * 获取当前页面路径
 * @returns {*}
 */
const getCurrentPage = () => {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  return currentPage.route;
}

/**
 * 根据身份证号获得年龄
 * @param idCard
 * @return {number}
 */
function getAgeFromIdCard(idCard) {
  const birthYear = idCard.substring(6, 10);
  const birthMonth = idCard.substring(10, 12);
  const birthDay = idCard.substring(12, 14);
  
  const d = new Date();
  const nowYear = d.getFullYear();
  const nowMonth = d.getMonth() + 1;
  const nowDay = d.getDate();
  
  let age = nowYear - birthYear;
  
  if (nowMonth < birthMonth || (nowMonth === birthMonth && nowDay < birthDay)) {
    age--;
  }
  return age;
}

module.exports = {
  formatLeftTime: formatLeftTime,
  parseDate: parseDate,
  getNowDate: getNowDate,
  dateAfter: dateAfter,
  formatDate: formatDate,
  formatTime: formatTime,
  getChineseWeekday: getChineseWeekday,
  compareVersion: compareVersion,
  rpx2px: rpx2px,
  isIPhoneX: isIPhoneX,
  getSafeAreaHeight: getSafeAreaHeight,
  getSexCodeByIdCardNo: getSexCodeByIdCardNo,
  getBirthdayByIdCardNo: getBirthdayByIdCardNo,
  getAgeByIdCardNo: getAgeByIdCardNo,
  desensitizedCommon: desensitizedCommon,
  getCurrentPage: getCurrentPage,
  getAgeFromIdCard: getAgeFromIdCard
}
