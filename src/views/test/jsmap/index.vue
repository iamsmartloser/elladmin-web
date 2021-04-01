<!--为没配置菜单的页面提供快速测试链接-->

<template>
  <div class="page_wrap">
    <Map>
      <template v-slot:formPane>
        <span class="form_pane_slot">formPane</span>
      </template>

    </Map>
  </div>

</template>

<script>
import Map from '@/components/Map/index'

export default {
  name: 'JsMap',
  components:{
    Map
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="scss">
  .page_wrap{
    height: calc( 100vh - 120px);
  }
</style>
