/**
 * 本地缓存类,可配置缓存时间,长久保存
 */
class localStorageEngine {
  constructor() {
    this.ok = true;
    this.key = '';
    this.expTime = 0;
  }

  getItem() {
    if (this.ok) {
      let value = wx.getStorageSync(this.key);
      if (value && value !== 'undefined') {
        value = JSON.parse(value);
        this.expTime = value.expTime;
      } else {
        return null;
      }
      return value.data;
    }
    return null;
  }

  setItem(time, value) {
    if (this.ok) {
      value = JSON.stringify({ data: value, expTime: time });
      wx.setStorageSync(this.key, value);
      return true;
    }
    return false;
  }

  removeItem() {
    if (this.ok) {
      wx.removeStorageSync(this.key);
      this.expTime = 0;
      return true;
    }
    return false;
  }
}
class Cache extends localStorageEngine {
  constructor(key) {
    super();
    this.key = key;
    this.value = null;
  }

  setCache(value, time, local) {
    if (time) {
      this.expTime = Math.ceil(Date.now() / 1000) + time;
    }
    this.value = value;
    if (local) {
      this.setItem(this.expTime, value);
    }
  }

  getCache(local) {
    if (this.hasCache(local)) {
      return this.value;
    }
    return null;
  }

  clearCache(local) {
    this.value = null;
    if (local) this.removeItem();
  }

  hasCache(local) {
    if (!this.value && local) this.value = this.getItem();
    if (this.expTime !== 0 && Math.ceil(Date.now() / 1000) > this.expTime) {
      this.clearCache(local);
      return false;
    }
    return !!this.value;
  }
}
class CacheManage {
  constructor() {
    this.cacheMap = {};
  }

  getItem(key, local) {
    /**
     * 获取缓存
     * key 密钥
     * local 是否本地缓存
     */
    if (!this.cacheMap[key]) {
      this.cacheMap[key] = CacheManage.makeCache(key);
    }
    return this.cacheMap[key].getCache(local);
  }

  setItem(key, value, time, local) {
    /**
     * 设置缓存
     * key 密钥
     * value 值
     * time 缓存时间
     * local 是否本地缓存
     */
    if (!this.cacheMap[key]) {
      this.cacheMap[key] = CacheManage.makeCache(key);
    }
    this.cacheMap[key].setCache(value, time, local);
  }

  removeItem(key, local) {
    if (this.cacheMap[key]) {
      this.cacheMap[key].clearCache(local);
    }
  }

  static getApiCacheKey() {
    return '';
  }

  static makeCache(key) {
    return new Cache(key);
  }
}
export default new CacheManage();
