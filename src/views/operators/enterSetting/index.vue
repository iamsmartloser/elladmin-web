<!-- 运营商入驻申请设置 -->

<template>
  <div class="page_wrap">
    <div class="head">申请入驻通道
      <el-tooltip effect="dark" content="关闭后运营商不能提交入驻申请" placement="top-start">
        <i class="el-icon-warning-outline" />
      </el-tooltip>:
      <el-switch v-model="enterSwitch" class="item" />
      <el-button type="primary" class="item" @click="onSave">保存设置</el-button>
    </div>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
        <div class="known-title">入驻申请须知</div>
        <div ref="editor" class="text" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
        <div class="known-title">预览</div>
        <div v-html="enterRule" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import E from 'wangeditor'
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import { getEnterInfo, editEnterInfo } from '@/api/operators/enter'

export default {
  name: 'EnterSetting',
  components: {},
  mixins: [],
  data() {
    return {
      enterSwitch: false,
      enterRule: '',
      editor: null
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {
    // this.initSwitch()
    this.initEditor()
    this.getEnterInfo()
  },
  methods: {
    async getEnterInfo() {
      const res = await getEnterInfo({ areaCode: '510116' }) || {}
      if (res && res.status === 200 || res.content) {
        this.enterSwitch = res.content.enterSwitch
        this.enterRule = res.content.enterRule
        this.editor.txt.html(res.content.enterRule || '')
      } else {
        this.$message.error(res && res.msg || '请求出错')
      }
    },

    // async initSwitch() {
    //   const res = await getEnterSwitch({ areaCode: '510116' }) || {}
    //   if (res && res.status === 200) {
    //     this.enterSwitch = res.content
    //   } else {
    //     this.$message.error(res && res.msg || '请求出错')
    //   }
    // },
    // 初始化富文本框
    async initEditor(content) {
      const _this = this
      this.editor = new E(this.$refs.editor)
      // 自定义菜单配置
      this.editor.customConfig.zIndex = 10
      // 文件上传
      this.editor.customConfig.customUploadImg = function(files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        files.forEach(image => {
          upload(_this.imagesUploadApi, image).then(res => {
            const data = res.data
            const url = _this.baseApi + '/file/' + data.type + '/' + data.realName
            insert(url)
          })
        })
      }
      this.editor.customConfig.onchange = (html) => {
        this.enterRule = html
      }
      this.editor.create()
    },
    async onSave() {
      const data = { areaCode: '510116', enterSwitch: this.enterSwitch, enterRule: this.enterRule }

      const form = new FormData()
      form.append('areaCode', '510116')
      form.append('enterSwitch', this.enterSwitch ? 1 : 0)
      form.append('enterRule', this.enterRule)
      const res = await editEnterInfo(form)
      if (res && res.status === 200) {
        this.$message.success(res && res.msg || '修改成功')
      } else {
        this.$message.error(res && res.msg || '请求出错')
      }
      console.log('res:', res)
    }
  }
}
</script>
<style lang="scss" scoped>
  .page_wrap {
    margin: 8px;
    /*height: calc(100vh - 120px);*/
    height: calc(100vh - 150px);
    /*height: 300px;*/

    .head{
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      border-bottom: 1px #99999955 solid;
      padding: 16px 8px;

      .item{
        margin-left: 8px;
      }
    }
    .known-title{
      padding: 16px 8px;
    }

  }
</style>
