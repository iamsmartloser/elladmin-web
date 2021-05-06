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
          <el-form-item label="数据来源（0系统自建 1用户上传）" prop="dataOrigin">
            <el-input v-model="form.dataOrigin" style="width: 370px;" />
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经纬度坐标组（格式：lng1,lat1;lng2,lat2;...）" prop="pointValue">
            <el-input v-model="form.pointValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="东经">
            <el-input v-model="form.minlng" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="西经">
            <el-input v-model="form.maxlng" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="南维">
            <el-input v-model="form.minlat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="北维">
            <el-input v-model="form.maxlat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间（毫秒时间戳）" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否禁用（0未禁用 1已禁用）" prop="isDisable">
            <el-input v-model="form.isDisable" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="整改中（0否 1是）" prop="isImproving">
            <el-input v-model="form.isImproving" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审批状态（0待审核 1已通过 2未通过）" prop="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建者用户ID" prop="createUserId">
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
        <el-table-column prop="dataOrigin" label="数据来源（0系统自建 1用户上传）" />
        <el-table-column prop="operatorId" label="所属运营商ID" />
        <el-table-column prop="lbsServiceId" label="所属服务区ID" />
        <el-table-column prop="operatorApplyId" label="关联申请ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="remark" label="描述" />
        <el-table-column prop="pointValue" label="经纬度坐标组（格式：lng1,lat1;lng2,lat2;...）" />
        <el-table-column prop="minlng" label="东经" />
        <el-table-column prop="maxlng" label="西经" />
        <el-table-column prop="minlat" label="南维" />
        <el-table-column prop="maxlat" label="北维" />
        <el-table-column prop="createTime" label="创建时间（毫秒时间戳）" />
        <el-table-column prop="isDisable" label="是否禁用（0未禁用 1已禁用）" />
        <el-table-column prop="isImproving" label="整改中（0否 1是）" />
        <el-table-column prop="status" label="审批状态（0待审核 1已通过 2未通过）" />
        <el-table-column prop="createUserId" label="创建者用户ID" />
        <el-table-column prop="approvalInfoId" label="审批信息ID" />
        <el-table-column prop="approvalEndTime" label="审批流程结束时间（毫秒时间戳）" />
        <el-table-column v-if="checkPer(['admin','lbsNoParking:edit','lbsNoParking:del'])" label="操作" width="150px" align="center">
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
import crudLbsNoParking from '@/api/lbs/lbsNoParking'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, dataOrigin: null, operatorId: null, lbsServiceId: null, operatorApplyId: null, name: null, remark: null, pointValue: null, minlng: null, maxlng: null, minlat: null, maxlat: null, createTime: null, isDisable: null, isImproving: null, status: null, createUserId: null, approvalInfoId: null, approvalEndTime: null }
export default {
  name: 'LbsNoParking',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'lbs_no_parking', url: 'api/lbsNoParking', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLbsNoParking }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'lbsNoParking:add'],
        edit: ['admin', 'lbsNoParking:edit'],
        del: ['admin', 'lbsNoParking:del']
      },
      rules: {
        dataOrigin: [
          { required: true, message: '数据来源（0系统自建 1用户上传）不能为空', trigger: 'blur' }
        ],
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
        pointValue: [
          { required: true, message: '经纬度坐标组（格式：lng1,lat1;lng2,lat2;...）不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间（毫秒时间戳）不能为空', trigger: 'blur' }
        ],
        isDisable: [
          { required: true, message: '是否禁用（0未禁用 1已禁用）不能为空', trigger: 'blur' }
        ],
        isImproving: [
          { required: true, message: '整改中（0否 1是）不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '审批状态（0待审核 1已通过 2未通过）不能为空', trigger: 'blur' }
        ],
        createUserId: [
          { required: true, message: '创建者用户ID不能为空', trigger: 'blur' }
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
