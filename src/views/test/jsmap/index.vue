<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <div class="page_wrap">
    <button @click="editPolyline">画折线</button>
    <button @click="clear('polyline')">清除折线</button>
    <button @click="editPolygon">画多边形</button>
    <button @click="clear('polygon')">清多边形</button>
    <button @click="editCircle">画圆</button>
    <button @click="clear('circle')">清除圆</button>
    <button @click="heatMap()">显示热力图</button>
    <button @click="markerClusterer()">显示点聚合</button>

    <!--    <button @click="clear('circle')">开启鼠标测距</button>-->
    <!--    <button @click="open">开启画图工具</button>-->
    <!--    <button @click="reEdit">重新编辑</button>-->
    <button @click="getInfo">获取信息</button>
    <Map @ready="ready">
      <!--      <template v-slot:formPane>-->
      <!--        <span class="form_pane_slot" draggable="true">-->
      <!--          <el-form label-position="top" label-width="80px" :model="formData">-->
      <!--            <el-form-item label="区域范围（在地图上点击选取）">-->
      <!--              <el-input v-model="formData.name" />-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="活动区域">-->
      <!--              <el-input v-model="formData.region" />-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="活动形式">-->
      <!--              <el-input v-model="formData.type" />-->
      <!--            </el-form-item>-->
      <!--          </el-form>-->
      <!--        </span>-->
      <!--      </template>-->

    </Map>
  </div>

</template>

<script>
import Map from '@/components/Map/index'
import map_mixins from '@/mixins/map'

const points = [
  { 'lng': 116.418261, 'lat': 39.921984, 'count': 50 },
  { 'lng': 116.423332, 'lat': 39.916532, 'count': 51 },
  { 'lng': 116.419787, 'lat': 39.930658, 'count': 15 },
  { 'lng': 116.418455, 'lat': 39.920921, 'count': 40 },
  { 'lng': 116.418843, 'lat': 39.915516, 'count': 100 },
  { 'lng': 116.42546, 'lat': 39.918503, 'count': 6 },
  { 'lng': 116.423289, 'lat': 39.919989, 'count': 18 },
  { 'lng': 116.418162, 'lat': 39.915051, 'count': 80 },
  { 'lng': 116.422039, 'lat': 39.91782, 'count': 11 },
  { 'lng': 116.41387, 'lat': 39.917253, 'count': 7 },
  { 'lng': 116.41773, 'lat': 39.919426, 'count': 42 },
  { 'lng': 116.421107, 'lat': 39.916445, 'count': 4 },
  { 'lng': 116.417521, 'lat': 39.917943, 'count': 27 },
  { 'lng': 116.419812, 'lat': 39.920836, 'count': 23 },
  { 'lng': 116.420682, 'lat': 39.91463, 'count': 60 },
  { 'lng': 116.415424, 'lat': 39.924675, 'count': 8 },
  { 'lng': 116.419242, 'lat': 39.914509, 'count': 15 },
  { 'lng': 116.422766, 'lat': 39.921408, 'count': 25 },
  { 'lng': 116.421674, 'lat': 39.924396, 'count': 21 },
  { 'lng': 116.427268, 'lat': 39.92267, 'count': 1 },
  { 'lng': 116.417721, 'lat': 39.920034, 'count': 51 },
  { 'lng': 116.412456, 'lat': 39.92667, 'count': 7 },
  { 'lng': 116.420432, 'lat': 39.919114, 'count': 11 },
  { 'lng': 116.425013, 'lat': 39.921611, 'count': 35 },
  { 'lng': 116.418733, 'lat': 39.931037, 'count': 22 },
  { 'lng': 116.419336, 'lat': 39.931134, 'count': 4 },
  { 'lng': 116.413557, 'lat': 39.923254, 'count': 5 },
  { 'lng': 116.418367, 'lat': 39.92943, 'count': 3 },
  { 'lng': 116.424312, 'lat': 39.919621, 'count': 100 },
  { 'lng': 116.423874, 'lat': 39.919447, 'count': 87 },
  { 'lng': 116.424225, 'lat': 39.923091, 'count': 32 },
  { 'lng': 116.417801, 'lat': 39.921854, 'count': 44 },
  { 'lng': 116.417129, 'lat': 39.928227, 'count': 21 },
  { 'lng': 116.426426, 'lat': 39.922286, 'count': 80 },
  { 'lng': 116.421597, 'lat': 39.91948, 'count': 32 },
  { 'lng': 116.423895, 'lat': 39.920787, 'count': 26 },
  { 'lng': 116.423563, 'lat': 39.921197, 'count': 17 },
  { 'lng': 116.417982, 'lat': 39.922547, 'count': 17 },
  { 'lng': 116.426126, 'lat': 39.921938, 'count': 25 },
  { 'lng': 116.42326, 'lat': 39.915782, 'count': 100 },
  { 'lng': 116.419239, 'lat': 39.916759, 'count': 39 },
  { 'lng': 116.417185, 'lat': 39.929123, 'count': 11 },
  { 'lng': 116.417237, 'lat': 39.927518, 'count': 9 },
  { 'lng': 116.417784, 'lat': 39.915754, 'count': 47 },
  { 'lng': 116.420193, 'lat': 39.917061, 'count': 52 },
  { 'lng': 116.422735, 'lat': 39.915619, 'count': 100 },
  { 'lng': 116.418495, 'lat': 39.915958, 'count': 46 },
  { 'lng': 116.416292, 'lat': 39.931166, 'count': 9 },
  { 'lng': 116.419916, 'lat': 39.924055, 'count': 8 },
  { 'lng': 116.42189, 'lat': 39.921308, 'count': 11 },
  { 'lng': 116.413765, 'lat': 39.929376, 'count': 3 },
  { 'lng': 116.418232, 'lat': 39.920348, 'count': 50 },
  { 'lng': 116.417554, 'lat': 39.930511, 'count': 15 },
  { 'lng': 116.418568, 'lat': 39.918161, 'count': 23 },
  { 'lng': 116.413461, 'lat': 39.926306, 'count': 3 },
  { 'lng': 116.42232, 'lat': 39.92161, 'count': 13 },
  { 'lng': 116.4174, 'lat': 39.928616, 'count': 6 },
  { 'lng': 116.424679, 'lat': 39.915499, 'count': 21 },
  { 'lng': 116.42171, 'lat': 39.915738, 'count': 29 },
  { 'lng': 116.417836, 'lat': 39.916998, 'count': 99 },
  { 'lng': 116.420755, 'lat': 39.928001, 'count': 10 },
  { 'lng': 116.414077, 'lat': 39.930655, 'count': 14 },
  { 'lng': 116.426092, 'lat': 39.922995, 'count': 16 },
  { 'lng': 116.41535, 'lat': 39.931054, 'count': 15 },
  { 'lng': 116.413022, 'lat': 39.921895, 'count': 13 },
  { 'lng': 116.415551, 'lat': 39.913373, 'count': 17 },
  { 'lng': 116.421191, 'lat': 39.926572, 'count': 1 },
  { 'lng': 116.419612, 'lat': 39.917119, 'count': 9 },
  { 'lng': 116.418237, 'lat': 39.921337, 'count': 54 },
  { 'lng': 116.423776, 'lat': 39.921919, 'count': 26 },
  { 'lng': 116.417694, 'lat': 39.92536, 'count': 17 },
  { 'lng': 116.415377, 'lat': 39.914137, 'count': 19 },
  { 'lng': 116.417434, 'lat': 39.914394, 'count': 43 },
  { 'lng': 116.42588, 'lat': 39.922622, 'count': 27 },
  { 'lng': 116.418345, 'lat': 39.919467, 'count': 8 },
  { 'lng': 116.426883, 'lat': 39.917171, 'count': 3 },
  { 'lng': 116.423877, 'lat': 39.916659, 'count': 34 },
  { 'lng': 116.415712, 'lat': 39.915613, 'count': 14 },
  { 'lng': 116.419869, 'lat': 39.931416, 'count': 12 },
  { 'lng': 116.416956, 'lat': 39.925377, 'count': 11 },
  { 'lng': 116.42066, 'lat': 39.925017, 'count': 38 },
  { 'lng': 116.416244, 'lat': 39.920215, 'count': 91 },
  { 'lng': 116.41929, 'lat': 39.915908, 'count': 54 },
  { 'lng': 116.422116, 'lat': 39.919658, 'count': 21 },
  { 'lng': 116.4183, 'lat': 39.925015, 'count': 15 },
  { 'lng': 116.421969, 'lat': 39.913527, 'count': 3 },
  { 'lng': 116.422936, 'lat': 39.921854, 'count': 24 },
  { 'lng': 116.41905, 'lat': 39.929217, 'count': 12 },
  { 'lng': 116.424579, 'lat': 39.914987, 'count': 57 },
  { 'lng': 116.42076, 'lat': 39.915251, 'count': 70 },
  { 'lng': 116.425867, 'lat': 39.918989, 'count': 8 }]

export default {
  name: 'JsMap',
  components: {
    Map
  },
  mixins: [map_mixins],
  data() {
    return {
      polyline: null,
      polylinePoints: [],
      marker: null,
      polygonPoints: [],
      polygon: null,
      circle: null,
      radiusLabel: null,
      lineupdate: false
    }
  },
  mounted() {
    // console.log('drawPolyline')
    // console.log('this.map:', this.map)
    this.map.setDefaultCursor('pointer') // 设置鼠标默认的指针样式为手
  },
  methods: {
    editPolyline() {
      this.map.addEventListener('click', (e) => {
        // console.log('click:', e)
        if (this.polylinePoints.length === 0) {
          const p = { lng: e.point.lng, lat: e.point.lat }
          this.polylinePoints.push(p)
          this.marker = this.drawMarker(p)
          // this.marker.enableDragging()
        } else {
          // this.$nextTick(()=>{
          if (this.lineupdate) {
            this.lineupdate = false
            this.polylinePoints = this.polyline.getPath().map(item => {
              // console.log(item)
              return { lat: item.lat, lng: item.lng }
            })
          } else {
            if (this.marker) {
              this.map.removeOverlay(this.marker)
              this.marker = null
            } else {
              this.map.removeOverlay(this.polyline)
            }
            this.polylinePoints.push({ lng: e.point.lng, lat: e.point.lat })
            this.polyline = this.drawPolyline(this.polylinePoints, { strokeColor: 'fenceColor' })
            this.polyline.enableEditing()

            this.polyline.addEventListener('lineupdate', (e) => {
              // console.log('lineupdate:', e)
              this.lineupdate = true
            })
            console.log('drawPolyline after:', this.polyline)
          }
          // })
        }
      })
    },
    editPolygon() {
      this.map.addEventListener('click', (e) => {
        console.log('click:', e)
        if (this.polygonPoints.length === 0) {
          const p = { lng: e.point.lng, lat: e.point.lat }
          this.polygonPoints.push(p)
          this.marker = this.drawMarker(p)
          // this.marker.enableDragging()
        } else {
          if (this.lineupdate) {
            this.lineupdate = false
            this.polygonPoints = this.polygon.getPath().map(item => {
              // console.log(item)
              return { lat: item.lat, lng: item.lng }
            })
          } else {
            if (this.marker) {
              this.map.removeOverlay(this.marker)
              this.marker = null
            } else {
              this.map.removeOverlay(this.polygon)
            }
            this.polygonPoints.push({ lng: e.point.lng, lat: e.point.lat })
            this.polygon = this.drawPolygon(this.polygonPoints, { strokeColor: 'fenceColor' })
            this.polygon.enableEditing()
            this.polygon.addEventListener('lineupdate', (e) => {
              // console.log('lineupdate:', e)
              this.lineupdate = true
            })

            // this.polygon.nc[0]
            console.log('polygonPoints after:', this.polygon)
          }
        }
      })
    },
    editCircle() {
      this.map.addEventListener('click', (e) => {
        console.log('click:', e)
        if (!this.circle) {
          const p = { lng: e.point.lng, lat: e.point.lat }
          const { circle, radiusLabel } = this.drawCircle(p, null, { strokeColor: 'fenceColor', enableEditing: true })
          this.radiusLabel = radiusLabel
          this.circle = circle
        }
      })
    },
    heatMap() {
      this.drawHeatMap(points)
    },
    markerClusterer(){
      this.drawMarkerClustererFromPointsArr(points,
        {
          url: require('@/assets/images/logo.png'),
          size: [30, 30],
          imageSize: [40, 40],
          anchor: [0, 0]
        })
    },
    clear(type) {
      switch (type) {
        case 'polyline':
          this.map.removeOverlay(this.polyline)
          this.map.removeOverlay(this.marker)
          this.polylinePoints = []
          this.polyline = null
          break
        case 'polygon':
          this.map.removeOverlay(this.polygon)
          this.map.removeOverlay(this.marker)
          this.polygonPoints = []
          this.polygon = null
          break
        case 'circle':
          this.map.removeOverlay(this.radiusLabel)
          this.map.removeOverlay(this.circle)
          this.circle = null
          break
        default:
          break
      }
    },
    getInfo() {
      console.log('circle', this.circle)
      console.log('polyline', this.polyline)
      console.log('polygon', this.polygon)
    }
  }
}
</script>
<style lang="scss">
  .page_wrap {
    /*height: calc(100vh - 120px);*/
    height: calc(100vh - 150px);
    /*height: 300px;*/
  }
</style>
