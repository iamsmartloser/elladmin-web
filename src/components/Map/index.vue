<template>
  <!-- 使用时须设置父容器高度、 -->
  <div :id="fullScreenId" class="map_wrap">
    <div :id="mapId" class="map"/>
    <!-- 地图上的表单覆盖层 -->
    <slot name="formPane"/>
  </div>

</template>

<script>
  import AutoComplete from './Autocomplete'
  import { FullScreen } from './FullScreen'
  import { uuid } from '@/utils/utils'

  const BMap = window.BMapGL
  const mapId = 'map_' + uuid(16)
  const fullScreenId = mapId + '_fullScreen_el'

  export default {
    props: {
      mapType: {// 地图类型控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_TOP_RIGHT, 10, 10]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      cityList: {// 创建城市选择控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_TOP_LEFT, 10, 10]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      scale: {// 比例尺控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_BOTTOM_LEFT, 80, 25]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      navigation: {// 缩放控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_BOTTOM_RIGHT, 15, 40]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      location: {// 定位控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_BOTTOM_RIGHT, 10, 100]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      autoComplete: {// 自定义搜索框自动填充控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_TOP_LEFT, 10, 50]// [是否显示，显示位置，宽度偏移，长度偏移]
        }
      },
      fullScreen: {// 自定义全屏按钮控件
        type: Array,
        default: function() {
          return [true, window.BMAP_ANCHOR_BOTTOM_RIGHT, 12, 0]
        }
      },
      polylines: {
        type: Array
      }
    },
    data() {
      return {
        map: null,
        mapId,
        fullScreenId,
        full: false
      }
    },
    mounted() {
      // console.log('mounted', mapId)
      this.createMap()
      // console.log('map:',this.map)
    },
    methods: {
      // 创建地图，添加控件,开启地图功能
      createMap() {
        console.log('initMap')
        const map = new BMap.Map(mapId)
        map.centerAndZoom('成都市', 17) // 创建地图,设置中心点坐标和地图级别

        // 地图类型控件
        if (this.mapType[0]) {
          map.addControl(new BMap.MapTypeControl({
            anchor: this.mapType[1],
            mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
            offset: new BMap.Size(this.mapType[2], this.mapType[3])
          }))
        }

        // 创建城市选择控件
        if (this.cityList[0]) {
          map.addControl(new BMap.CityListControl({
            anchor: this.cityList[1],
            offset: new BMap.Size(this.cityList[2], this.cityList[3])
          }))
        }

        // 比例尺控件
        if (this.scale[0]) {
          map.addControl(new BMap.ScaleControl({
            anchor: this.scale[1],
            offset: new BMap.Size(this.scale[2], this.scale[3])
          }))
        }

        // 缩放控件
        if (this.navigation[0]) {
          map.addControl(new BMap.NavigationControl({
            anchor: this.navigation[1],
            offset: new BMap.Size(this.navigation[2], this.navigation[3]),
            type: window.BMAP_NAVIGATION_CONTROL_ZOOM
          }))
        }

        // 定位控件
        if (this.location[0]) {
          map.addControl(new BMap.LocationControl({
            anchor: this.location[1],
            offset: new BMap.Size(this.location[2], this.location[3])
          }))
        }

        // 添加自定义搜索框自动填充控件
        if (this.autoComplete[0]) {
          map.addControl(new AutoComplete({
            anchor: this.autoComplete[1],
            offset: new BMap.Size(this.autoComplete[2], this.autoComplete[3])
          }))
        }

        // 添加自定义全屏按钮控件
        if (this.fullScreen[0]) {
          map.addControl(new FullScreen({
            fullScreenId,
            anchor: this.fullScreen[1],
            offset: new BMap.Size(this.fullScreen[2], this.fullScreen[3])
          }))
        }

        // 开启地图功能
        map.enableScrollWheelZoom() // 启用地图滚轮放大缩小
        map.enableInertialDragging() // 启用地图惯性拖拽，默认禁用
        map.enableContinuousZoom() //	启用连续缩放效果，默认禁用
        this.map = map
        this.$emit('ready', map)
      }
    }
  }
</script>
<style lang="scss">
  /*.page_wrap{*/
  /*  height: calc( 100vh - 120px);*/
  /*}*/

  .map_wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /*height: 500px;*/
    .map {
      width: 100%;
      height: 100%;

    }

    .form_pane_slot {
      position: absolute;
      z-index: 20;
      top: 100px;
      left: 10px;
      padding: 10px;
      background: #fff;
      border-radius: 5px;
      width: 300px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
  }

  /*修复自动完成搜索框不能点击问题*/
  .tangram-suggestion-main {
    z-index: 20 !important;
    height: 300px;
    overflow: auto;
  }
</style>
