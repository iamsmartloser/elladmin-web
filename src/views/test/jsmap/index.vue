<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <div class="page_wrap">
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
      polygon: null
    }
  },
  mounted() {
    // console.log('drawPolyline')
    // console.log('this.map:', this.map)
    this.map.setDefaultCursor('pointer') // 设置鼠标默认的指针样式为手
    // this.editPolyline();
    // this.editPolygon()
    this.editCircle()
  },
  methods: {
    editPolyline() {
      this.map.addEventListener('click', (e) => {
        console.log('click:', e)
        if (this.polylinePoints.length === 0) {
          const p = { lng: e.latlng.lng, lat: e.latlng.lat }
          this.polylinePoints.push(p)
          this.marker = this.drawMarker(p)
          this.marker.enableDragging()
        } else {
          if (this.marker) {
            this.map.removeOverlay(this.marker)
            this.marker = null
          } else {
            this.map.removeOverlay(this.polyline)
          }
          this.polylinePoints.push({ lng: e.latlng.lng, lat: e.latlng.lat })
          this.polyline = this.drawPolyline(this.polylinePoints, { strokeColor: 'fenceColor' })
          this.polyline.enableEditing()
          console.log('drawPolyline after:', this.polyline)
        }
      })
    },
    editPolygon() {
      this.map.addEventListener('click', (e) => {
        console.log('click:', e)
        if (this.polygonPoints.length === 0) {
          const p = { lng: e.latlng.lng, lat: e.latlng.lat }
          this.polygonPoints.push(p)
          this.marker = this.drawMarker(p)
          this.marker.enableDragging()
        } else {
          if (this.marker) {
            this.map.removeOverlay(this.marker)
            this.marker = null
          } else {
            this.map.removeOverlay(this.polygon)
          }
          this.polygonPoints.push({ lng: e.latlng.lng, lat: e.latlng.lat })
          this.polygon = this.drawPolygon(this.polygonPoints, { strokeColor: 'fenceColor' })
          this.polygon.enableEditing()
          console.log('polygonPoints after:', this.polygon)
        }
      })
    },
    editCircle() {
      this.map.addEventListener('click', (e) => {
        console.log('click:', e)
          if (!this.circle) {
          const p = { lng: e.latlng.lng, lat: e.latlng.lat }
          this.circle = this.drawCircle(p, null, { strokeColor: 'fenceColor', enableEditing: true })
          // this.circle.enableEditing()
          //   // 编辑事件回调
          // this.circle.addEventListener('lineupdate',(e)=>{
          //   console.log('lineupdate:',e.overlay.vertexMarkers[0].latLng)
          //   console.log('lineupdate latLng:',e.overlay.latLng)
          //   console.log('lineupdate radius:',e.overlay.radius)
          // })
          // console.log('editCircle after:', this.circle)
        }
      })
    },
    // drawByManager() {
    //   this.createDrawingManager()
    //   this.drawingManager.setDrawingMode(window.BMAP_DRAWING_CIRCLE)
    //   this.drawingManager.open()
    //   this.drawingManager.addEventListener('circlecomplete', function(overlay) {
    //     console.log('circlecomplete:', overlay)
    //   })
    // }
  }
}
</script>
<style lang="scss">
  .page_wrap {
    height: calc(100vh - 120px);
  }
</style>
