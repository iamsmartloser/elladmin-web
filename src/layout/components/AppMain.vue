<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
/*.app-main {*/
/*  !* 50= navbar  50  *!*/
/*  min-height: calc(100vh - 50px);*/
/*  width: 100%;*/
/*  position: relative;*/
/*  overflow: hidden;*/
/*}*/
.app-main {
  /* 50= navbar  50  */
  height: calc(100% - 50px );
  /*min-height: calc(100% - 50px);!*这里修改了一下*!*/
  width: 100%;
  position: relative;
  overflow: hidden;
  /*overflow: auto;!*这里修改了一下*!*/
  padding-bottom: 33px; /* 这里修改了一下,添加了padding,防止页脚遮挡页面底部 */
}
.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100% - 84px);/* 这里修改了一下,100vh */
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
