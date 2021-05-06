<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属运营商ID" prop="operatorId">
            <el-input v-model="form.operatorId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属服务区ID" prop="lbsServiceId">
            <el-input v-model="form.lbsServiceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联申请ID">
            <el-input v-model="form.operatorApplyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库类型（0综合 1维修库）">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="照片">
            <el-input v-model="form.picture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="东经">
            <el-input v-model="form.lng" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="南维">
            <el-input v-model="form.lat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人姓名">
            <el-input v-model="form.contactsName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人电话">
            <el-input v-model="form.contactsPhoneNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否禁用（0未禁用 1已禁用）" prop="isDisable">
            <el-input v-model="form.isDisable" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="最后一次培训时间" prop="lastSafetyTrainingTime">
            <el-input v-model="form.lastSafetyTrainingTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间（毫秒时间戳）" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审批状态（0待审核 1已通过 2审批中 3未通过）" prop="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="申请人ID" prop="createUserId">
            <el-input v-model="form.createUserId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审批信息ID">
            <el-input v-model="form.approvalInfoId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审批流程结束时间（毫秒时间戳）">
            <el-input v-model="form.approvalEndTime" style="width: 370px;" />
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
        <el-table-column prop="operatorId" label="所属运营商ID" />
        <el-table-column prop="lbsServiceId" label="所属服务区ID" />
        <el-table-column prop="operatorApplyId" label="关联申请ID" />
        <el-table-column prop="type" label="仓库类型（0综合 1维修库）" />
        <el-table-column prop="picture" label="照片" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="remark" label="描述" />
        <el-table-column prop="lng" label="东经" />
        <el-table-column prop="lat" label="南维" />
        <el-table-column prop="contactsName" label="联系人姓名" />
        <el-table-column prop="contactsPhoneNumber" label="联系人电话" />
        <el-table-column prop="isDisable" label="是否禁用（0未禁用 1已禁用）" />
        <el-table-column prop="lastSafetyTrainingTime" label="最后一次培训时间" />
        <el-table-column prop="createTime" label="创建时间（毫秒时间戳）" />
        <el-table-column prop="status" label="审批状态（0待审核 1已通过 2审批中 3未通过）" />
        <el-table-column prop="createUserId" label="申请人ID" />
        <el-table-column prop="approvalInfoId" label="审批信息ID" />
        <el-table-column prop="approvalEndTime" label="审批流程结束时间（毫秒时间戳）" />
        <el-table-column v-if="checkPer(['admin','lbsStorehouse:edit','lbsStorehouse:del'])" label="操作" width="150px" align="center">
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
import crudLbsStorehouse from '@/api/lbs/lbsStorehouse'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, operatorId: null, lbsServiceId: null, operatorApplyId: null, type: null, picture: null, name: null, remark: null, lng: null, lat: null, contactsName: null, contactsPhoneNumber: null, isDisable: null, lastSafetyTrainingTime: null, createTime: null, status: null, createUserId: null, approvalInfoId: null, approvalEndTime: null }
export default {
  name: 'LbsStorehouse',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '仓库', url: '/lbs/page', query: { type: 'storehouse' }, idField: 'id', sort: 'id,desc', crudMethod: { ...crudLbsStorehouse }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'lbsStorehouse:add'],
        edit: ['admin', 'lbsStorehouse:edit'],
        del: ['admin', 'lbsStorehouse:del']
      },
      rules: {
        operatorId: [
          { required: true, message: '所属运营商ID不能为空', trigger: 'blur' }
        ],
        lbsServiceId: [
          { required: true, message: '所属服务区ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        isDisable: [
          { required: true, message: '是否禁用（0未禁用 1已禁用）不能为空', trigger: 'blur' }
        ],
        lastSafetyTrainingTime: [
          { required: true, message: '最后一次培训时间不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间（毫秒时间戳）不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '审批状态（0待审核 1已通过 2审批中 3未通过）不能为空', trigger: 'blur' }
        ],
        createUserId: [
          { required: true, message: '申请人ID不能为空', trigger: 'blur' }
        ]
      }}
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
