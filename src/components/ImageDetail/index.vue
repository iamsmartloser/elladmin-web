<template>
  <el-dialog
    title="图片详情"
    :visible.sync="dialogVisible"
    class="dialog"
    width="50%"
    @close="$emit('close',false)"
  >
    <el-carousel trigger="click" class="carousel">
      <el-carousel-item v-for="item in urls" :key="item" class="carousel-item">
        <img :src="item" class="img-item">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImageDetail',
  props: {
    urls: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      dialogVisible: this.visible
    }
  },
  watch:{
    visible(val){
      this.dialogVisible = val
    }
  }
}
</script>

<style scoped>
  .dialog{
      /*height: 800px;*/
    /*width: 600px;*/
  }
  .carousel{
    width: 100%;
    height: 500px;
    box-sizing: border-box;
  }
  .carousel-item{
    width: 100%;
    height: 500px;
  }
  .img-item{
    /*min-height: 200px;*/
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
