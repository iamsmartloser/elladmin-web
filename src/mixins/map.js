import { constant } from '@riophae/vue-treeselect/src/utils'

const BMap = window.BMapGL
const COLOR_CONFIG = {
  disabledColor: '#595959',
  noParkingColor: '#ff0000', // 禁停区颜色
  noReturnColor: '#ff800f', // 禁还区颜色
  blindAreaColor: '#808080', // 信号盲区颜色
  fenceColor: '#2ba045', // 禁停区颜色
  trailColor: '#1869AD', // 车辆轨迹颜色
  originTrailColor: '#f9c700', // 车辆原始轨迹颜色
  operationColor: '#1890ff', // 运维区颜色
  vehicleAreaColor: '#CDCD00', // 车辆位置区区颜色
  targetAreaColor: '#98FB98' // 车辆位置区区颜色
}
export default {
  data() {
    return {
      map: null
    }
  },
  methods: {
    // 可以从这里获取百度地图实例
    ready(map) {
      this.map = map
      console.log('ready:', map)
    },
    drawPolyline(points, polylineOptions) {
      const strokeColor = COLOR_CONFIG[polylineOptions.strokeColor]
      // 设置默认的参数
      const option = {
        strokeWeight: polylineOptions.strokeWeight || 1, // 边线的宽度，以像素为单位。
        strokeOpacity: polylineOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: polylineOptions.strokeStyle || 'solid' , // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        enableEditing: polylineOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: polylineOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      const polyline = new BMap.Polyline(points, option)
      this.map.addOverlay(polyline)
      return polyline
    },
    drawPolygon(points, polygonOptions) {
      const strokeColor = COLOR_CONFIG[polygonOptions.strokeColor]
      const fillColor = COLOR_CONFIG[polygonOptions.fillColor]
      // 设置默认的参数
      const option = {
        strokeWeight: polygonOptions.strokeWeight || 1, // 边线的宽度，以像素为单位。
        strokeOpacity: polygonOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: polygonOptions.strokeStyle || 'solid' , // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        fillColor, // 填充颜色 当参数为空时，圆形将没有填充效果。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        enableEditing: polygonOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: polygonOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      const polygon = new BMap.Polygon(points, option)
      return polygon
    },
    drawCircle(points, circleOptions) {
      const strokeColor = COLOR_CONFIG[circleOptions.strokeColor]
      const fillColor = COLOR_CONFIG[circleOptions.fillColor]
      // 设置默认的参数
      const option = {
        strokeWeight: circleOptions.strokeWeight || 1, // 边线的宽度，以像素为单位。
        strokeOpacity: circleOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: circleOptions.strokeStyle || 'solid' , // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        fillColor, // 填充颜色 当参数为空时，圆形将没有填充效果。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        enableEditing: circleOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: circleOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      const circle = new BMap.Circle(points, option)
      return circle
    },
  }
}
