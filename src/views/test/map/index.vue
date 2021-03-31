<!--&lt;!&ndash;为没配置菜单的页面提供快速测试链接&ndash;&gt;-->

<!--<template>-->
  <!--<div>-->
    <!--<baidu-map id="vue-map1" class="map" center="北京">-->
      <!--&lt;!&ndash;  控件偏移设置 :offset="{width:10,height:10}"  &ndash;&gt;-->
      <!--&lt;!&ndash;  地图类型[地图，混合]  &ndash;&gt;-->
      <!--<bm-map-type-->
        <!--:map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"-->
        <!--anchor="BMAP_ANCHOR_TOP_LEFT"-->
        <!--:offset="{width:10,height:10}"-->
      <!--/>-->

      <!--&lt;!&ndash;  城市搜索设置  &ndash;&gt;-->
      <!--<bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:100,height:10}" />-->

      <!--&lt;!&ndash; 缩放控件 &ndash;&gt;-->
      <!--<bm-navigation-->
        <!--anchor="BMAP_ANCHOR_BOTTOM_RIGHT"-->
        <!--:show-zoom-info="true"-->
        <!--:enable-geolocation="true"-->
        <!--:offset="{width:10,height:90}"-->
        <!--type="BMAP_NAVIGATION_CONTROL_ZOOM"-->
      <!--/>-->

      <!--&lt;!&ndash;  定位控件  &ndash;&gt;-->
      <!--&lt;!&ndash;<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false"&ndash;&gt;-->
      <!--&lt;!&ndash;:autoLocation="false" :offset="{width:10,height:50}"></bm-geolocation>&ndash;&gt;-->
      <!--&lt;!&ndash;  比例尺控件  &ndash;&gt;-->
      <!--<bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="{width:10,height:10}" />-->
      <!--&lt;!&ndash; 自动填充地区搜索 &ndash;&gt;-->
      <!--<bm-view class="map" />-->
      <!--<bm-control :offset="{width: 180, height: 10}">-->
        <!--<bm-auto-complete v-model="keyword" :sug-style="{zIndex: 1,height:200}">-->
          <!--<el-input v-model="keyword" placeholder="请输入地名关键字" size="mini" /> &lt;!&ndash; 这里指代一个自定义搜索框组件 &ndash;&gt;-->
        <!--</bm-auto-complete>-->
      <!--</bm-control>-->
      <!--<bm-local-search :keyword="keyword" :auto-viewport="true" style="display: none" />-->
    <!--</baidu-map>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
  <!--name: 'Map',-->
  <!--data() {-->
    <!--return {-->
      <!--keyword: ''-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--handler({ BMap, map }) {-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
  <!--.map {-->
    <!--width: 100%;-->
    <!--height: 500px;-->
  <!--}-->
<!--</style>-->
