<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label>消息类型:</label>
        <el-select v-model="query.type" filterable placeholder="请选择消息类型" clearable>
          <el-option
            v-for="item in dict.msg_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label>允许回复:</label>
        <el-select v-model="query.allowReceive" filterable placeholder="请选择允许回复" clearable>
          <el-option
            v-for="item in dict.allow_receive"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label>是否强提醒:</label>
        <el-select v-model="query.compulsaryWarningType" filterable placeholder="请选择是否强提醒" clearable>
          <el-option
            v-for="item in dict.compulsary_warning_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label>消息标题:</label>
        <el-input v-model="query.title" clearable placeholder="请输入消息标题" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
                <label>发送者姓名:</label>
                <el-input v-model="query.createUserName" clearable placeholder="发送者姓名" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label>发送时间:</label>
<!--        <date-range-picker-->
<!--          v-model="sendTime"-->
<!--          class="date-item"-->
<!--          value-format="timestamp"-->
<!--        />-->
        <el-date-picker
          v-model="sendTime"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item v-if="crud.status.edit" v-show="false" label="ID">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="消息类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.msg_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="允许回复" prop="allowReceive">
            <el-select v-model="form.allowReceive" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.allow_receive"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否强提醒" prop="compulsaryWarningType">
            <el-select v-model="form.compulsaryWarningType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.compulsary_warning_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消息标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="消息体">
            <el-input v-model="form.content" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="crud.status.add" label="接收主体" prop="operatorIds">
            <SelectWithService style="width: 370px;" value-key="id" label-key="name" :init-value="form.operatorIds" :multiple="true" :service="getPage" @change="changeOperators" />
          </el-form-item>

          <!--          <el-form-item label="创建时间" prop="createTime">-->
          <!--            <el-input v-model="form.createTime" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="消息发送时间" prop="sendTime">
            <el-date-picker v-model="form.sendTime" value-format="timestamp" type="datetime" style="width: 370px;" />
          </el-form-item>
          <!--          <el-form-item label="发送者ID" prop="createUserId">-->
          <!--            <el-input v-model="form.createUserId" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="发送者姓名">-->
          <!--            <el-input v-model="form.createUserName" style="width: 370px;" />-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
<!--        <el-table-column prop="id" label="ID" />-->
        <el-table-column prop="type" label="消息类型">
          <template slot-scope="scope">
            {{ dict.label.msg_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="allowReceive" label="允许回复">
          <template slot-scope="scope">
            {{ dict.label.allow_receive[scope.row.allowReceive] }}
          </template>
        </el-table-column>
        <el-table-column prop="compulsaryWarningType" label="是否强提醒">
          <template slot-scope="scope">
            {{ dict.label.compulsary_warning_type[scope.row.compulsaryWarningType] }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="消息标题" />
        <el-table-column prop="content" label="消息体" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="消息发送时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.sendTime) }}
          </template>
        </el-table-column>
<!--        <el-table-column prop="createUserId" label="发送者ID" />-->
        <el-table-column prop="createUserName" label="发送者姓名" />
        <el-table-column v-if="checkPer(['admin','msgBodyInfo:edit','msgBodyInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudMsgBodyInfo from '@/api/system/msgBodyInfo'
import { getPage } from '@/api/operators/operatorInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import SelectWithService from '@/components/SelectWithService/index'
import DateRangePicker from '@/components/DateRangePicker'
import {formatDate} from '@/utils/formatDay'

const defaultForm = { id: null, type: null, allowReceive: null, compulsaryWarningType: null, title: null, content: null, createTime: null, sendTime: null, createUserId: null, createUserName: null }
export default {
  name: 'MsgBodyInfo',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['msg_type', 'allow_receive', 'compulsary_warning_type'],
  cruds() {
    return CRUD({ title: '消息通知', url: 'msg/page', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMsgBodyInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'msgBodyInfo:add'],
        edit: ['admin', 'msgBodyInfo:edit'],
        del: ['admin', 'msgBodyInfo:del']
      },
      rules: {
        type: [
          { required: true, message: '消息类型不能为空', trigger: 'blur' }
        ],
        allowReceive: [
          { required: true, message: '允许回复不能为空', trigger: 'blur' }
        ],
        compulsaryWarningType: [
          { required: true, message: '是否强提醒不能为空', trigger: 'blur' }
        ],
        operatorIds: [
          { required: true, message: '接收主体不能为空', trigger: 'blur' }
        ],
        sendTime: [
          { required: true, message: '消息发送时间不能为空', trigger: 'blur' }
        ],
        createUserId: [
          { required: true, message: '发送者ID不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'type', display_name: '消息类型' },
        { key: 'allowReceive', display_name: '允许回复' },
        { key: 'compulsaryWarningType', display_name: '是否强提醒' },
        { key: 'title', display_name: '消息标题' },
        { key: 'createUserName', display_name: '发送者姓名' }
      ],
      // operatorIds: null,
      sendTime: null
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.query.beginSendTime = this.sendTime ? this.sendTime[0] : null
      this.crud.query.endSendTime = this.sendTime ? this.sendTime[1] : null
      return true
    },
    changeOperators(ids) {
      this.crud.form.operatorIds = ids
    },
    formatDate,
    getPage: getPage
  }
}
</script>

<style scoped>

</style>
