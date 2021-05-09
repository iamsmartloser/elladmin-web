<template>
  <div>
    <div class="detail-title">{{ detail.title }}</div>
    <div class="detail-sub-title">{{ `${formatDate(detail.sendTime)} ${detail.createUserName}` }}</div>
    <div class="detail-content">
      <div style="width: 100%;height: 100%;" v-html="detail.content" />
    </div>
    <div class="comments-wrap">
      <div>评论区</div>
      <el-input
        v-model="myComment"
        type="textarea"
        :rows="3"
        placeholder="如您有好的建议可以点击发表评论"
        style="width: 100%;margin: 8px;"
      />
      <el-button type="primary" style="margin: 8px;" round @click.prevent="releaseComment()">发表评论</el-button>
      <div v-for="(comment,index) in comments" :key="comment.id" class="comment-item">
        <div style="display: flex;justify-content: space-between;flex-wrap: wrap">

          <span style="font-weight: bold;font-size: 16px;%">
            {{ `${comment.receiveUserName} ${comment.operatorName?'对'+comment.operatorName:''} 说:` }}</span>
          <span style="">
            {{ `${formatDate(comment.createTime)}  ${index+1}楼` }}
            <el-button type="text" @click.prevent="replyClick(comment)">回复</el-button>
          </span>
        </div>
        <div style="margin: 8px 32px;padding: 8px;">{{ comment.content }}</div>
        <div v-if="replyInputId===('reply'+comment.id)" :id="'reply'+comment.id">
          <el-input
            v-model="releaseParams.content"
            type="textarea"
            :rows="3"
            placeholder="请在此处输入你的回复"
            style="width: 100%;margin: 8px;"
          />
          <el-button type="primary" style="margin: 8px;" round @click.prevent="replyComment()">提交</el-button>
          <el-button style="margin: 8px;" round @click.prevent="cancelReply()">取消</el-button>
        </div>
      </div>
      <div v-if="size*(page)>=total" style="text-align: center">
        <el-button type="text" disabled>---没有了---</el-button>
      </div>
      <div v-else style="text-align: center">
        <el-button type="text" @click.prevent="loadMore()">---加载更多---</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDay'
import { receiveList, receive } from '@/api/system/msgBodyInfo'

export default {
  name: 'MsgBodyDetail',
  data() {
    return {
      detail: null,
      myComment: '',
      comments: [],
      page: 0,
      size: 8,
      total: 0,
      releaseParams: {
        content: '', // 回复内容
        msgBodyId: null, // 消息体ID
        operatorId: null, // 平台回复时需指定运营商ID
        quoteReceiveId: null// 引用回复ID
      },
      replyInputId: null
    }
  },
  created() {
    // this.height = document.documentElement.clientHeight - 180 + 'px'
    // const tableName = this.$route.params.tableName
    // console.log('route', this.$route)
    // console.log('params', this.$route.params)

    this.detail = this.$route.params || {}
    this.releaseParams.msgBodyId = this.$route.params && this.$route.params.id
    console.log('created', this.$route.params)
    // this.getComments()
  },
  mounted() {
    console.log('mounted', this.$route.params)
    this.getComments(true)
  },
  methods: {
    formatDate,
    getComments(refresh = false) {
      const msgId = this.$route.params && this.$route.params.id
      // console.log('msgId', msgId)
      let params = { msgId, page: this.page + 1, size: this.size }
      if (refresh) {
        params = { msgId, page: 1, size: this.size }
      }
      receiveList(params).then(res => {
        if (res && res.status === 200 && res.content) {
          this.total = res.totalElements
          if (refresh) {
            this.page = 1
            this.comments = res.content || []
          } else {
            this.page = this.page + 1
            this.comments = this.comments.concat(res.content)
          }
        } else {
          this.$message.error(res && res.message || '获取评论失败')
        }
      })
    },
    loadMore() {
      this.getComments()
    },
    releaseComment() {
      this.releaseParams.operatorId = null
      this.releaseParams.quoteReceiveId = null
      this.releaseParams.content = this.myComment
      this.$nextTick(() => {
        this.replyComment()
      })
    },
    cancelReply() {
      this.clearForm()
    },
    // 点击回复
    replyClick(item) {
      console.log('replyComment item', item)
      this.replyInputId = 'reply' + item.id
      this.releaseParams.operatorId = item.receiveUserId
      // this.releaseParams.quoteReceiveId = item.quoteReceiveId
      this.releaseParams.content = ''// 先清空回复
    },

    // 回复
    replyComment() {
      const params = this.releaseParams
      const _this = this
      if (!params.content) {
        this.$message.warning('请填写发表内容')
        return
      }
      receive(params).then(res => {
        if (res && res.status === 200) {
          _this.$message.success('发布成功')
          this.clearForm()
          _this.getComments(true)
        } else {
          _this.$message.error(res && res.message || '发布失败')
        }
      })
    },
    clearForm() {
      this.releaseParams.operatorId = null
      this.releaseParams.quoteReceiveId = null
      this.releaseParams.content = null
      this.replyInputId = null
      this.myComment = null
    }
  }
}
</script>

<style scoped>
  .detail-title {
    text-align: center;
    font-size: 20px;
    padding: 8px;
    color: #444444;
  }

  .detail-sub-title {
    text-align: center;
    font-size: 14px;
    padding: 8px;
    color: #666666;
  }

  .detail-content {
    padding: 16px;
    margin: 16px 5%;
  }

  .comments-wrap {
    margin: 16px 32px;
    padding: 16px 32px;
    border-top: #cccccc 1px solid;
    /*overflow: auto;*/
    /*min-height: 400px;*/
    /*max-height: 500px;*/
  }

  .comment-item {
    padding: 8px;
    border-top: #cccccc 1px dashed;
  }
</style>
