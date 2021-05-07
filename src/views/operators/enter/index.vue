<!-- 运营商入驻申请 -->
<template>
  <div class="page_wrap">
    <div v-if="active===-1">
      <el-alert
        v-if="!enterSwitch"
        title="当前入驻申请通道已关闭，无法申请入驻"
        class="sentence"
        type="error"
        show-icon
        :closable="false"
      />
      <div class="known-title">共享两轮车企业在XX县投车入驻申请须知</div>
      <div class="enter-rule">
        <div style="width: 100%;height: 100%;" v-html="enterRule" />
        <el-button type="primary" :disabled="!enterSwitch" class="apply-bt" @click="apply">申请入驻</el-button>
      </div>
    </div>

    <!--  入驻申请步骤条  -->
    <el-steps v-if="active>-1" :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息" />
      <el-step title="入驻资料" />
      <el-step title="提交申请" />
    </el-steps>

  </div>
</template>

<script>
import { getEnterInfo } from '@/api/operators/enter'

export default {
  name: 'Enter',
  components: {

  },
  mixins: [],
  data() {
    return {
      enterSwitch: false,
      enterRule: '',
      active: -1
    }
  },
  mounted() {
    this.getEnterInfo()
  },
  methods: {
    async getEnterInfo() {
      const res = await getEnterInfo({ areaCode: '510116' }) || {}
      if (res && res.status === 200 || res.content) {
        this.enterSwitch = res.content.enterSwitch
        this.enterRule = res.content.enterRule
      } else {
        this.$message.error(res && res.msg || '请求出错')
      }
    },
    apply() {
      this.active = 0
    }
  }
}
</script>
<style lang="scss" scoped>
  .page_wrap {
    height: calc(100vh - 150px);
    padding: 16px;

    .known-title{
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding: 20px;
      color: #444444;
    }
    .enter-rule{
      position: relative;
      border: #999999 solid 1px;
      margin: 0 5%;
      padding: 16px;
      overflow-y: auto;
      min-height: 500px;
      max-height: 600px;

      .apply-bt{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 16px;
        margin: auto;
      }
    }
  }
</style>
