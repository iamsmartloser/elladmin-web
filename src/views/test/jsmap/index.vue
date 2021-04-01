<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <div class="page_wrap">
    <Map>
      <template v-slot:formPane>
        <span class="form_pane_slot" draggable="true">
          <el-form label-position="top" label-width="80px" :model="formData">
            <el-form-item label="区域范围（在地图上点击选取）">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="活动区域">
              <el-input v-model="formData.region" />
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input v-model="formData.type" />
            </el-form-item>
          </el-form>
        </span>
      </template>

    </Map>
  </div>

</template>

<script>
import Map from '@/components/Map/index'

export default {
  name: 'JsMap',
  components: {
    Map
  },
  data() {
    return {
      formData:{}
    }
  },
  mounted() {

  },
  methods: {}
}
</script>
<style lang="scss">
  .page_wrap {
    height: calc(100vh - 120px);
  }
</style>
