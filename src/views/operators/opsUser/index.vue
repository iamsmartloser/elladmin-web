<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <label v-if="!isOperators(user&&user.roles)" class="el-form-item-label">运营商ID</label>
        <el-input v-if="!isOperators(user&&user.roles)" v-model="query.operatorId" clearable placeholder="运营商ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">运维员姓名:</label>
        <el-input v-model="query.name" clearable placeholder="运维员姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">运维员电话:</label>
        <el-input v-model="query.phoneNumber" clearable placeholder="运维员电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">运维员状态:</label>
        <el-select v-model="query.status" filterable placeholder="运维员状态" clearable>
          <el-option
            v-for="item in dict.ops_user_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">是否接收短信:</label>
        <el-select v-model="query.receiveSms" filterable placeholder="是否接收短信" clearable>
          <el-option
            v-for="item in dict.ops_user_receive_sms"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation class="rr-op-has-label" :filter-item-class="false" :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="运维员姓名" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运维员电话" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运维员邮箱">
            <el-input v-model="form.contactsEmail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运维员职务">
            <el-input v-model="form.duties" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运维员状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="运维员状态" clearable style="width: 370px;">
              <el-option
                v-for="item in dict.ops_user_status.map(d=>{d.value=parseInt(d.value);return d})"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
<!--            <el-radio v-model="form.status" v-for="item in dict.ops_user_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>-->
          </el-form-item>
          <el-form-item label="是否接收短信" prop="receiveSms">
            <el-select v-model="form.receiveSms" filterable placeholder="是否接收短信" clearable style="width: 370px;">
              <el-option
                v-for="item in dict.ops_user_receive_sms.map(d=>{d.value=parseInt(d.value);return d})"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
<!--            <el-radio v-model="form.receiveSms" v-for="item in dict.ops_user_receive_sms" :key="item.id" :label="item.value">{{ item.label }}</el-radio>-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="operatorId" label="运营商ID" />
        <el-table-column prop="name" label="运维员姓名" />
        <el-table-column prop="phoneNumber" label="运维员电话" />
        <el-table-column prop="contactsEmail" label="运维员邮箱" />
        <el-table-column prop="duties" label="运维员职务" />
        <el-table-column prop="status" label="运维员状态">
          <template slot-scope="scope">
            {{ dict.label.ops_user_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveSms" label="是否接收短信">
          <template slot-scope="scope">
            {{ dict.label.ops_user_receive_sms[scope.row.receiveSms] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','opsUser:edit','opsUser:del'])" label="操作" width="150px" align="center">
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
import crudOpsUser from '@/api/operators/opsUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import {isOperators} from '@/utils/utils'
import { mapGetters } from 'vuex'

const defaultForm = { id: null, operatorId: null, name: null, phoneNumber: null, contactsEmail: null, duties: null, status: null, receiveSms: null }
export default {
  name: 'OpsUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['ops_user_status', 'ops_user_receive_sms'],
  cruds() {
    return CRUD({ title: 'ops', url: '/opsUser/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudOpsUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'opsUser:add'],
        edit: ['admin', 'opsUser:edit'],
        del: ['admin', 'opsUser:del']
      },
      rules: {
        name: [
          { required: true, message: '运维员姓名不能为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '运维员电话不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '运维员状态不能为空', trigger: 'blur' }
        ],
        receiveSms: [
          { required: true, message: '是否接收短信不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'operatorId', display_name: '运营商ID' },
        { key: 'name', display_name: '运维员姓名' },
        { key: 'phoneNumber', display_name: '运维员电话' },
        { key: 'status', display_name: '运维员状态' },
        { key: 'receiveSms', display_name: '是否接收短信' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    isOperators,
  }
}
</script>

<style scoped>

</style>
