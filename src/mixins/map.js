const BMap = window.BMap
const BMapLib = window.BMapLib
const COLOR_CONFIG = {
  'disabledColor': '#595959',
  'stationColor': '#5770D3', // 车站颜色
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
      drawingManager: null
    }
  },
  methods: {
    // 可以从这里获取百度地图实例
    // ready(map) {
    //   this.map = map
    //   console.log('ready:', map)
    // },
    // 画点
    drawMarker(point, markerOptions) {
      const { icon: img, setViewPort = false, ...rest } = markerOptions || {}
      let icon = null
      if (img) {
        const { url, size, imageSize, anchor } = img
        icon = new BMap.Icon(url, new BMap.Size(size[0], size[1]), {
          imageSize: new BMap.Size(imageSize[0], imageSize[1]),
          anchor: new BMap.Size(anchor[0], anchor[1])
        })
      }
      const p = new BMap.Point(point.lng, point.lat)
      if (setViewPort) {
        setTimeout(() => {
          this.map.setViewport([p])
        }, 500)
      }
      const marker = new BMap.Marker(p, { icon, draggingCursor: 'pointer', title: null, ...rest })
      this.map.addOverlay(marker)

      return marker
    },
    // 画线
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
        enableClicking: polylineOptions.enableClicking || false // 是否响应点击事件，默认为true
      }

      const polyline = new BMap.Polyline(points.map(p => {
        return new BMap.Point(p.lng, p.lat)
      }), option)
      this.map.addOverlay(polyline)
      console.log('drawPolyline end')
      return polyline
    },
    // 画多边形
    drawPolygon(points, polygonOptions, setViewPort = false) {
      const strokeColor = COLOR_CONFIG[polygonOptions.strokeColor]
      console.log('polygonOptions.fillColor', polygonOptions.fillColor)
      const fillColor = COLOR_CONFIG[polygonOptions.fillColor||polygonOptions.strokeColor]
      console.log('fillColor', fillColor)
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
      const ps = points.map(p => {
        return new BMap.Point(p.lng, p.lat)
      })
      const polygon = new BMap.Polygon(ps, option)
      this.map.addOverlay(polygon)
      if (setViewPort) {
        setTimeout(() => {
          this.map.setViewport(ps)
        }, 0)
      }
      return polygon
    },
    // 画圆
    drawCircle(point, radius, circleOptions, setViewPort = false) {
      const r = radius || 50
      const strokeColor = COLOR_CONFIG[circleOptions.strokeColor]
      const fillColor = COLOR_CONFIG[circleOptions.fillColor||circleOptions.strokeColor]
      // 设置默认的参数
      const option = {
        strokeWeight: circleOptions.strokeWeight || 2, // 边线的宽度，以像素为单位。
        strokeOpacity: circleOptions.strokeOpacity || 1, // 边线透明度，取值范围0 - 1。
        strokeStyle: circleOptions.strokeStyle || 'solid', // 边线的样式，solid或dashed。
        strokeColor, // 边线的颜色
        fillColor, // 填充颜色 当参数为空时，圆形将没有填充效果。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        // enableEditing: circleOptions.enableEditing || false, // 是否启用编辑，默认不启用
        enableClicking: circleOptions.enableClicking || true // 是否响应点击事件，默认为true
      }
      console.log('point:', point)
      let centerPoint = new BMap.Point(point.lng, point.lat)
      const circle = new BMap.Circle(centerPoint, r, option)
      this.map.addOverlay(circle)
      console.log('circle2:', circle)
      // 如果需要画中心点图标
      if(circleOptions.icon){
        const { url, size, imageSize, anchor } = circleOptions.icon
        const icon = new BMap.Icon(url, new BMap.Size(size[0], size[1]), {
          imageSize: new BMap.Size(imageSize[0], imageSize[1]),
          anchor: new BMap.Size(anchor[0], anchor[1])
        })
        const marker = new BMap.Marker(centerPoint, { icon,  title: null,})
        this.map.addOverlay(marker)
      }
      let radiusLabel = null
      // 如果允许编辑
      if (circleOptions.enableEditing) {
        circle.enableEditing()
        radiusLabel = new BMap.Label(`R:<input id="circle_radius" type="number" value="50"/>`)
        radiusLabel.setPosition(centerPoint)
        radiusLabel.setOffset(new BMap.Size(0, 8))
        radiusLabel.setStyle({ border: '1px #555 solid', padding: '5px', borderRadius: '3px' })
        this.map.addOverlay(radiusLabel)
        const radiusInputEl = document.getElementById('circle_radius')
        radiusInputEl.style = 'border: none; width: 50px;'
        radiusInputEl.addEventListener('input', (e) => {
          console.log('input:', e)
          if (e.target.value) {
            circle.setRadius(e.target.value)
          }
        })
        circle.addEventListener('lineupdate', (e) => {
          console.log('lineupdate:', e)
          const tempR = Math.floor(e.target.Fa)
          const center = e.target.point ? e.target.point : null
          if (!center) {
            return
          }
          centerPoint = new BMap.Point(center.lng, center.lat)
          radiusLabel.setPosition(centerPoint)
          radiusInputEl.value = tempR
        })
      }
      if (setViewPort) {
        setTimeout(() => {
          this.map.setViewport([centerPoint])
        }, 0)
      }
      return { circle, radiusLabel }
    },

    // 热力图
    drawHeatMap(points, options) {
      if (!this.isSupportCanvas()) {
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
      }
      const { max = 25, radius = 100, ...rest } = options || {}
      const heatmapOverlay = new BMapLib.HeatmapOverlay({ radius })
      this.map.addOverlay(heatmapOverlay)
      heatmapOverlay.setDataSet({ data: points, max })
      heatmapOverlay.setOptions(rest)
      this.map.setViewport(points.map(point => {
        return new BMap.Point(point.lng, point.lat)
      }))
      return heatmapOverlay
    },
    // 点聚合
    drawMarkerClustererFromPointsArr(points, iconOptions) {
      let icon = null
      if (iconOptions) {
        const { url, size, imageSize, anchor } = iconOptions
        icon = new BMap.Icon(url, new BMap.Size(size[0], size[1]), {
          imageSize: new BMap.Size(imageSize[0], imageSize[1]),
          anchor: new BMap.Size(anchor[0], anchor[1])
        })
      }
      const markers = points.map(item => {
        return new BMap.Marker(new BMap.Point(item.lng, item.lat), { icon })
      })
      const markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers })
      return markerClusterer
    },
    // 点聚合
    drawMarkerClustererFromMarkers(markers) {
      const markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers })
      return markerClusterer
    },
    // 判断浏览区是否支持canvas
    isSupportCanvas() {
      const elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
    // 腾讯地图坐标转百度地图
    txMap_to_bdMap(lat, lng) {
      const pi = 3.14159265358979324 * 3000.0 / 180.0
      const x = lng
      const y = lat
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi)
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi)
      lng = z * Math.cos(theta) + 0.0065
      lat = z * Math.sin(theta) + 0.006
      return { 'lat': lat, 'lng': lng }
    },
    clearAll() {
      this.map.clearOverlays()
    },
  }
}
