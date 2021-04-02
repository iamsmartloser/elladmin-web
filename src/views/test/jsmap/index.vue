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
      polyline: null
    }
  },
  mounted() {
    console.log('drawPolyline')
    console.log('this.map:', this.map)
    this.map.addEventListener('click', (e) => {
      console.log('click:', e)
      if (!this.polyline) {
        this.polyline = this.drawPolyline([e.point], { strokeColor: '#555' })
      } else {
        this.polyline.setPath([...this.polyline.getPath(), e.point])
      }
    })
  },
  methods: {

  }
}
</script>
<style lang="scss">
  .page_wrap {
    height: calc(100vh - 120px);
  }
</style>
