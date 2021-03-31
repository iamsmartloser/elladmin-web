<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <div style="height: 300px">
    <!-- 这里最好封装为map组件 ，使用时须设置高度、 -->
    <div class="map_wrap" :id="fullScreenId">
      <div :id="mapId" class="map"  ></div>
    </div>
  </div>

</template>

<script>
import AutoComplete from './components/Autocomplete'
import { FullScreen, isFullScreen } from './components/FullScreen'
import { uuid } from '@/utils/utils'

const BMap = window.BMapGL
const mapId = 'map_' + uuid(16)
const fullScreenId = mapId + '_fullScreen_el'
// console.log('fullScreenId',fullScreenId)
export default {
  name: 'JsMap',
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
    this.initMap()
    // console.log('map:',this.map)
    // console.log('getControl:')

  },
  methods: {
    // 初始化地图，添加控件
    initMap() {
      console.log('initMap')
      //,{mapType: window.BMAP_NORMAL_MAP}
      const map = new BMap.Map(mapId)

      map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 18); // 初始化地图,设置中心点坐标和地图级别
      // map.setCurrentCity('成都市');//gl版不需要

      // 地图类型控件
      map.addControl(new BMap.MapTypeControl({
        anchor: window.BMAP_ANCHOR_TOP_LEFT,
        mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
        offset: new BMap.Size(10, 10)
      }))
      // 创建城市选择控件
      map.addControl(new BMap.CityListControl({
        anchor: window.BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(230, 10)
      }))
      // 比例尺控件
      const ctrl_sca = new BMap.ScaleControl({
        anchor: window.BMAP_ANCHOR_BOTTOM_LEFT,
        offset: new BMap.Size(80, 25) })

      // map.fullScreenId = fullScreenId
      map.addControl(ctrl_sca)
      // 缩放控件
      const ctrl_nav = new BMap.NavigationControl({
        anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
        offset: new BMap.Size(15, 40),
        // enableGeolocation: true,
        type: window.BMAP_NAVIGATION_CONTROL_ZOOM
      })
      map.addControl(ctrl_nav)
      // 定位控件
      const locationControl = new BMapGL.LocationControl({
        // 控件的停靠位置（可选，默认左上角）
        anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
        // 控件基于停靠位置的偏移量（可选）
        offset: new BMapGL.Size(10, 100)
      });
      // 将控件添加到地图上
      map.addControl(locationControl);

      // 添加自定义搜索框自动填充控件
      map.addControl(new AutoComplete())
      // 添加自定义全屏按钮控件
      map.addControl(new FullScreen(fullScreenId))

      // 开启地图功能
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      map.enableInertialDragging(); //启用地图惯性拖拽，默认禁用
      map.enableContinuousZoom(); //	启用连续缩放效果，默认禁用
      this.map = map
    },
  }
}
</script>
<style lang="scss" scoped>
  .map_wrap{
    width: 100%;
    height: 100%;
    /*height: 500px;*/
    .map{
      width: 100%;
      height: 100%;
    }
  }


</style>
