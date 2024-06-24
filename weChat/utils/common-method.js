// 返回首页
export function backToHome() {
  wx.switchTab({
    url: '/pages/index/home2/index',
  })
}

// 判断值是否为空，为空则弹出toast提示
export function ifEmptyToast(val, toastContent) {
  if (!val || val.trim() == '') {
    wx.showToast({
      title: toastContent,
      icon: 'none',
    })
    return true
  }

  return false
}
// 校验手机号
export function checkPhoneNumber(phoneNumber) {
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if (!reg.test(phoneNumber.trim())) {
        wx.showToast({
            title: '请正确填写手机号！',
            icon: 'none',
            duration: 1500,
        })
        return true
    }
    return false
}

// 去掉前缀/pages/及后缀/index，例如：/page/register/to-register/index => register/to-register
export function formatPageUrl(url) {
  if (url && url.trim() != '') {
    url = url.replace('/pages/', '')
    url = url.substr(0, url.length - 6)
    return url
  }
  return ''
}


export function formatDate(date) {
  let taskStartTime
  if (date.getMonth() < 9) {
    taskStartTime = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-"
  } else {
    taskStartTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
  }
  if (date.getDate() < 10) {
    taskStartTime += "0" + date.getDate()
  } else {
    taskStartTime += date.getDate()
  }
  return taskStartTime;
}

// 以下方法主要用于小数的基本运算，防止丢精
// 除法
export function accDivide(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return accMulti((r1 / r2), pow(10, t2 - t1));
}

//乘法
export function accMulti(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//加法
export function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

//减法
export function accMinus(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}