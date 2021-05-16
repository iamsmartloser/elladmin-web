<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">巡检类型</label>
        <el-input v-model="query.type" clearable placeholder="巡检类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">巡检人员</label>
        <el-input v-model="query.userName" clearable placeholder="巡检人员" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">巡检员角色类型</label>
        <el-input v-model="query.userRoleType" clearable placeholder="巡检员角色类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">巡检员所属运营商</label>
        <el-input v-model="query.userOperatorId" clearable placeholder="巡检员所属运营商" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.createTime"
          start-placeholder="createTimeStart"
          end-placeholder="createTimeStart"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="巡检类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.inspection_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检前照片">
            <el-input v-model="form.beforePicture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="巡检后照片">
            <el-input v-model="form.afterPicture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="巡检说明">
            <el-input v-model="form.explains" style="width: 370px;" />
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
        <el-table-column prop="type" label="巡检类型">
          <template slot-scope="scope">
            {{ dict.label.inspection_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="beforePicture" label="巡检前照片" />
        <el-table-column prop="afterPicture" label="巡检后照片" />
        <el-table-column prop="explains" label="巡检说明" />
        <el-table-column prop="userName" label="巡检人员" />
        <el-table-column prop="userRoleType" label="巡检员角色类型">
          <template slot-scope="scope">
            {{ dict.label.inspection_role_type[scope.row.userRoleType] }}
          </template>
        </el-table-column>
        <el-table-column prop="userOperatorId" label="巡检员所属运营商" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="userOrganizeName" label="巡检员所属机构名称" />
        <el-table-column v-if="checkPer(['admin','inspectionLog:edit','inspectionLog:del'])" label="操作" width="150px" align="center">
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
import crudInspectionLog from '@/api/operators/inspectionLog'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, type: null, beforePicture: null, afterPicture: null, explains: null, userId: null, userName: null, userRoleType: null, userOperatorId: null, createTime: null, userOrganizeName: null }
export default {
  name: 'InspectionLog',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['inspection_type', 'inspection_role_type'],
  cruds() {
    return CRUD({ title: '城市巡检管理', url: '/inspection/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudInspectionLog }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'inspectionLog:add'],
        edit: ['admin', 'inspectionLog:edit'],
        del: ['admin', 'inspectionLog:del']
      },
      rules: {
        type: [
          { required: true, message: '巡检类型不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'type', display_name: '巡检类型' },
        { key: 'userName', display_name: '巡检人员' },
        { key: 'userRoleType', display_name: '巡检员角色类型' },
        { key: 'userOperatorId', display_name: '巡检员所属运营商' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
