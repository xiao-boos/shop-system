// components/area-picker/index.js
import utils from '../../utils/index'
const app = getApp()
// 区域控件相关
const address = require('../../utils/area')

let isScroll = false

Component(
  utils.initComponent(app, {
    /**
     * 组件的属性列表
     */
    properties: {
      areaValue: {
        type: String,
        value: '',
        observer: function (newVal) {
          console.log(newVal)
          this.setData({
            area: newVal,
          })
        },
      },
      isEditing: {
        type: Boolean,
        value: true,
      },
    },

    /**
     * 组件的初始数据
     */
    data: {
      area: '',
      areaList: [],
      currentValue:[18, 7, 0],
      reginIndex: [18, 7, 0],
      province: null,
      city: null,
      county: null,
      // 控制地区选择弹窗,
      areaPopupShow: false,
    },

    /**
     * 生命周期
     */
    lifetimes: {
      attached() {},
      ready() {
        this._formatCityData(address)
      },
    },

    /**
     * 组件的方法列表
     */
    methods: {
      // 绑定自定义组件的点击事件
      showPopup: function () {
        this.setData({
          areaPopupShow: true,
        })
      },
      onPopupShow() {
        // 新区域控件特殊处理
        this.setData({
          areaPopupShow: true,
        })
        this.setData({
          currentValue: this.data.reginIndex,
        })
        this._formatCityData(address)
      },
      onPopupClose() {
        this.setData({
          areaPopupShow: false,
        })
        this.setData({
          currentValue: this.data.reginIndex,
        })
        this._formatCityData(address)
      },
      cancel() {
        this.setData({
          areaPopupShow: false,
        })
        this.setData({
          currentValue: this.data.reginIndex,
        })
        this._formatCityData(address)
      },

      /**
       * 确认选择地区
       * @param {Event} e
       */
      onAreaConfirm(e) {
        // 新区域控件
        let { provice, city, county } = this.data
        // 判断用户选择时间滚动是否结束，解决 picker-view bindChange 延迟问题
        if (isScroll) return
        this.setData({
          reginIndex: this.data.currentValue,
          show: false,
          area: provice.name + city.name + county.name,
          areaPopupShow: false,
        })
        const selectedArea = provice.name + city.name + county.name
        this.triggerEvent('onAreaConfirm', selectedArea)
      },

      // -----新区域控件特殊处理函数
      // 格式化全国省市区数据
      _formatCityData(cityData = []) {
        const reginIndex = this.data.currentValue
        const proviceList = this._filterData(cityData)
        const cityList = this._filterData(cityData[reginIndex[0]].children)
        const areaList = this._filterData(cityData[reginIndex[0]].children[reginIndex[1]].children)
        const provice = proviceList[reginIndex[0]]
        const city = cityList[reginIndex[1]]
        const county = areaList[reginIndex[2]]
        this.setData({
          proviceList,
          cityList,
          areaList,
          provice,
          city,
          county,
        })
      },
      // 格式化全国省市区数据 辅助函数
      _filterData(arr = []) {
        const list = []
        if (!arr) return []
        arr.forEach((v) => {
          let obj = {}
          obj.name = v.name
          obj.code = v.code
          list.push(obj)
        })
        return list
      },

      // 地区滚动开始
      bindpickstart() {
        isScroll = true
      },
      // 地区滚动结束
      bindpickend() {
        isScroll = false
      },
      // 地区滚动事件
      bindChange(e) {
        const val = e.detail.value
        let { currentValue } = this.data
        if (val[0] !== currentValue[0]) {
          currentValue = [val[0], 0, 0]
          this.setData({
            currentValue,
          })
        } else if (val[1] !== currentValue[1]) {
          currentValue = [val[0], val[1], 0]
          this.setData({
            currentValue,
          })
        } else if (val[2] !== currentValue[2]) {
          currentValue = val
          this.setData({
            currentValue,
          })
        }
        this._formatCityData(address)
      },
      //-----新区域控件特殊处理结束
    },
  })
)
