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
        <el-button type="primary" :disabled="!enterSwitch" class="apply-bt" @click.prevent="apply">申请入驻</el-button>
      </div>
    </div>

    <!--  入驻申请步骤条  -->
    <el-steps v-if="active>-1" :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息" />
      <el-step title="入驻资料" />
      <el-step title="提交申请" />
    </el-steps>
    <!-- 基本信息 -->
    <el-form  v-if="active===0"  ref="baseForm" :model="baseInfo" label-width="120px" class="form-wrap">
      <el-form-item label="营业执照扫描件">
        <el-upload
          action="alert"
          multiple
          :limit="1"
          :on-exceed="handleLicenseExceed"
          :on-change="handleLicenseChange"
          :on-remove="handleLicenseRemove"
          :file-list="licenseList"
          :auto-upload="false"
        >
          <el-button size="small" icon="el-icon-upload">选择文件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="运营方案">
        <el-upload
          action="alert"
          multiple
          :limit="10"
          :on-exceed="handleOperationPlanExceed"
          :on-change="handleOperationPlanChange"
          :on-remove="handleOperationPlanRemove"
          :file-list="operationPlanList"
          :auto-upload="false"
        >
          <el-button size="small" icon="el-icon-upload">选择文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 扩展信息-入驻资料 -->
    <el-form ref="extendForm" :model="extendInfo" label-width="80px" />
  </div>
</template>

<script>
import { getEnterInfo } from '@/api/operators/enter'
import { mapGetters } from 'vuex'
import { upload, uploadWithType } from '@/utils/upload'

export default {
  name: 'Enter',
  components: {

  },
  mixins: [],
  data() {
    return {
      enterSwitch: false,
      enterRule: '',
      active: -1,
      // 基本信息
      baseInfo: {},
      // 入驻资料
      extendInfo: {},
      licenseList: [], // 营业执照扫描件
      vehicleInfoList: [], // 车辆资料
      operationPlanList: []// 运营方案
      // licensePath: '', // 营业执照扫描件
      // vehicleInfoPath: '', // 车辆资料（多文件英文逗号分割）,
      // operationPlan: ''// 运营方案（多文件英文逗号分割）
    }
  },
  computed: {
    ...mapGetters([
      'fileUploadUrl',
      'baseApi'
    ])
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
    },
    // 营业执照改变，
    handleLicenseChange(file, fileList) {
      console.log('handleLicenseChange file', file)
      console.log('handleLicenseChange fileList', fileList)
      // this.licenseList = fileList
      uploadWithType(this.fileUploadUrl, file.raw, 'images').then(res => {
        if (res.status === 200 && res.content) {
          const index = fileList.findIndex(item => item.uid === file.uid)
          const { path, newName, suffix } = res.content
          fileList[index].url = path + newName + '.' + suffix
          this.licenseList = fileList
        }else {
          this.$message.error(`文件${file.name}上传出错`)
        }
      })
    },
    handleLicenseExceed(files, fileList) {
      this.$message.warning('文件数量超过最大限制1')
    },
    handleLicenseRemove(file, fileList) {
      this.licenseList = fileList
    },
    // beforeLicenseUpload(file) {
    //   // if(!file|| file instanceof Promise)
    //   console.log('beforeUpload file', file)
    //   const index = this.licenseList.findIndex(item => item.uid === file.uid)
    //   if(index > -1){
    //
    //   }
    // }
    // 上传运营方案
    handleOperationPlanExceed(files, fileList){
      this.$message.warning('文件数量超过最大限制10')
    },
    handleOperationPlanChange(file, fileList){
      console.log('handleLicenseChange file', file)
      console.log('handleLicenseChange fileList', fileList)
      uploadWithType(this.fileUploadUrl, file.raw, 'annex').then(res => {
        if (res.status === 200 && res.content) {
          const index = fileList.findIndex(item => item.uid === file.uid)
          const { path, newName, suffix } = res.content
          fileList[index].url = path + newName + '.' + suffix
          this.operationPlanList = fileList
        }else {
          this.$message.error(`文件${file.name}上传出错`)
        }
      })
    },
    handleOperationPlanRemove(file, fileList){
      this.operationPlanList = fileList
    },
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
    .form-wrap{
      padding: 16px;
    }
  }
</style>
