const BMap = window.BMapGL
const COLOR_CONFIG = {
  'disabledColor': '#595959',
  'noParkingColor': '#ff0000', // 禁停区颜色
  'noReturnColor': '#ff800f', // 禁还区颜色
  'blindAreaColor': '#808080', // 信号盲区颜色
  'fenceColor': '#2ba045', // 禁停区颜色
  'trailColor': '#1869AD', // 车辆轨迹颜色
  'originTrailColor': '#f9c700', // 车辆原始轨迹颜色
  'operationColor': '#1890ff', // 运维区颜色
  'vehicleAreaColor': '#CDCD00', // 车辆位置区区颜色
  'targetAreaColor': '#98FB98' // 车辆位置区区颜色
}
export default {
  data() {
    return {
      map: null,
      drawingManager: null,
    }
  },
  methods: {
    // 可以从这里获取百度地图实例
    ready(map) {
      this.map = map
      console.log('ready:', map)
    },
    drawMarker(point, markerOptions) {
      const marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), markerOptions)
      this.map.addOverlay(marker)
      return marker
    },
    drawPolyline(points, polylineOptions) {
      console.log('drawPolyline begin')
      const strokeColor = COLOR_CONFIG[polylineOptions.strokeColor]
      console.log('strokeColor:', strokeColor)
      // 设置默认的参数
      const option = {
        strokeWeight: polylineOptions.strokeWeight || 2, // 边线的宽度，以像素为单位。
        strokeOpacity: polylineOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: polylineOptions.strokeStyle || 'solid', // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        enableEditing: polylineOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: polylineOptions.enableClicking || true // 是否响应点击事件，默认为true
      }

      const polyline = new BMap.Polyline(points.map(p => { return new BMap.Point(p.lng, p.lat) }), option)
      this.map.addOverlay(polyline)
      console.log('drawPolyline end')
      return polyline
    },
    drawPolygon(points, polygonOptions) {
      const strokeColor = COLOR_CONFIG[polygonOptions.strokeColor]
      const fillColor = COLOR_CONFIG[polygonOptions.fillColor]
      // 设置默认的参数
      const option = {
        strokeWeight: polygonOptions.strokeWeight || 2, // 边线的宽度，以像素为单位。
        strokeOpacity: polygonOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: polygonOptions.strokeStyle || 'solid', // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        fillColor, // 填充颜色 当参数为空时，圆形将没有填充效果。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        enableEditing: polygonOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: polygonOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      const polygon = new BMap.Polygon(points.map(p => { return new BMap.Point(p.lng, p.lat) }), option)
      this.map.addOverlay(polygon)
      return polygon
    },
    drawCircle(point, radius, circleOptions) {
      const r = radius || 50
      const strokeColor = COLOR_CONFIG[circleOptions.strokeColor]
      const fillColor = COLOR_CONFIG[circleOptions.fillColor]
      // 设置默认的参数
      const option = {
        strokeWeight: circleOptions.strokeWeight || 2, // 边线的宽度，以像素为单位。
        strokeOpacity: circleOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: circleOptions.strokeStyle || 'solid', // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        fillColor, // 填充颜色 当参数为空时，圆形将没有填充效果。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        enableEditing: circleOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: circleOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      let centerPoint = new BMap.Point(point.lng, point.lat)
      const circle = new BMap.Circle(centerPoint, r, option)
      this.map.addOverlay(circle)
      // console.log('circle:', circle)
      let radiusLabel=null
      // 如果允许编辑
      if (option.enableEditing) {
        radiusLabel = new BMap.Label(`R:<input id="circle_radius" type="number" value="50"/>`)
        radiusLabel.setPosition(centerPoint)
        radiusLabel.setOffset(new BMap.Size(0, 8))
        radiusLabel.setStyle({ border: '1px #555 solid', padding: '5px', borderRadius: '3px' })
        this.map.addOverlay(radiusLabel)
        const radiusInputEl = document.getElementById('circle_radius')
        radiusInputEl.style = 'border: none; width: 50px;'
        radiusInputEl.addEventListener('input', (e) => {
          // console.log('input:', e)
          if (e.target.value) {
            circle.setRadius(e.target.value)
          }
        })
        circle.addEventListener('lineupdate', (e) => {
          console.log('lineupdate:', e.overlay)
          const tempR = Math.floor(e.overlay.radius)
          const center = e.overlay.vertexMarkers[0]?e.overlay.vertexMarkers[0].latLng:null
          if(!center){
            return
          }

          centerPoint = new BMap.Point(center.lng, center.lat)
          radiusLabel.setPosition(centerPoint)
          radiusInputEl.value = tempR
        })
      }
      return {circle, radiusLabel}
    },
    // setDrawingMode:BMAP_DRAWING_MARKER\BMAP_DRAWING_POLYLINE\
    // BMAP_DRAWING_RECTANGLE\BMAP_DRAWING_POLYGON\BMAP_DRAWING_CIRCLE
    createDrawingManager() {
      const styleOptions = {
        strokeColor: '#5E87DB', // 边线颜色
        fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 2, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2 // 填充透明度，取值范围0-1
      }
      const labelOptions = {
        borderRadius: '2px',
        background: '#FFFBCC',
        border: '1px solid #E1E1E1',
        color: '#703A04',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px'
      }
      // 实例化鼠标绘制工具
      if (!this.drawingManager) {
        this.drawingManager = new window.BMapGLLib.DrawingManager(this.map, {
          // isOpen: true,        // 是否开启绘制模式
          enableCalculate: false, // 绘制是否进行测距测面
          enableSorption: false, // 是否开启边界吸附功能
          // sorptiondistance: 20, // 边界吸附距离
          circleOptions: styleOptions, // 圆的样式
          polylineOptions: styleOptions, // 线的样式
          polygonOptions: styleOptions, // 多边形的样式
          rectangleOptions: styleOptions, // 矩形的样式
          labelOptions: labelOptions // label样式
        })
      }
      return this.drawingManager
    }
  }
}
