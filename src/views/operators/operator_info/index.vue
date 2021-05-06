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
          <el-form-item label="车辆品牌ID">
            <el-input v-model="form.brandId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="codeNumber">
            <el-input v-model="form.codeNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运营商应用ID" prop="appId">
            <el-input v-model="form.appId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运营商密钥" prop="appSecret">
            <el-input v-model="form.appSecret" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="公司名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="授权车辆数" prop="vehicleScale">
            <el-input v-model="form.vehicleScale" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="实际投放车辆数" prop="vehicleRealityScale">
            <el-input v-model="form.vehicleRealityScale" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="二维码解析正则">
            <el-input v-model="form.rqRegular" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="禁行区类型（0系统自建 1自主上传）" prop="lbsNoTravelType">
            <el-input v-model="form.lbsNoTravelType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务区类型（0系统自建 1自主上传）" prop="lbsServiceType">
            <el-input v-model="form.lbsServiceType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车站类型（0系统自建 1自主上传）" prop="lbsStationType">
            <el-input v-model="form.lbsStationType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="禁停区类型（0系统自建 1自主上传）" prop="lbsNoParkingType">
            <el-input v-model="form.lbsNoParkingType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运营初始化状态（0未初始化 1已通过 2已提交审批 3未通过）" prop="initStatus">
            <el-input v-model="form.initStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="接入状态（0未接入 1已接入）" prop="access">
            <el-input v-model="form.access" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="清退状态（0未清退 1已清退）" prop="retreat">
            <el-input v-model="form.retreat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审批状态（0待审核 1已通过 2审批中 3未通过）" prop="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="申请时间（毫秒时间戳）" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
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
        <el-table-column prop="brandId" label="车辆品牌ID" />
        <el-table-column prop="codeNumber" label="统一社会信用代码" />
        <el-table-column prop="appId" label="运营商应用ID" />
        <el-table-column prop="appSecret" label="运营商密钥" />
        <el-table-column prop="name" label="公司名称" />
        <el-table-column prop="vehicleScale" label="授权车辆数" />
        <el-table-column prop="vehicleRealityScale" label="实际投放车辆数" />
        <el-table-column prop="rqRegular" label="二维码解析正则" />
        <el-table-column prop="lbsNoTravelType" label="禁行区类型（0系统自建 1自主上传）" />
        <el-table-column prop="lbsServiceType" label="服务区类型（0系统自建 1自主上传）" />
        <el-table-column prop="lbsStationType" label="车站类型（0系统自建 1自主上传）" />
        <el-table-column prop="lbsNoParkingType" label="禁停区类型（0系统自建 1自主上传）" />
        <el-table-column prop="initStatus" label="运营初始化状态（0未初始化 1已通过 2已提交审批 3未通过）" />
        <el-table-column prop="access" label="接入状态（0未接入 1已接入）" />
        <el-table-column prop="retreat" label="清退状态（0未清退 1已清退）" />
        <el-table-column prop="status" label="审批状态（0待审核 1已通过 2审批中 3未通过）" />
        <el-table-column prop="createTime" label="申请时间（毫秒时间戳）" />
        <el-table-column prop="createUserId" label="创建者用户ID" />
        <el-table-column prop="approvalInfoId" label="审批信息ID" />
        <el-table-column prop="approvalEndTime" label="审批流程结束时间（毫秒时间戳）" />
        <el-table-column v-if="checkPer(['admin','operatorInfo:edit','operatorInfo:del'])" label="操作" width="150px" align="center">
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
import crudOperatorInfo from '@/api/operators/operatorInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, brandId: null, codeNumber: null, appId: null, appSecret: null, name: null, vehicleScale: null, vehicleRealityScale: null, rqRegular: null, lbsNoTravelType: null, lbsServiceType: null, lbsStationType: null, lbsNoParkingType: null, initStatus: null, access: null, retreat: null, status: null, createTime: null, createUserId: null, approvalInfoId: null, approvalEndTime: null }
export default {
  name: 'OperatorInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '运营商信息', url: 'api/operatorInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudOperatorInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'operatorInfo:add'],
        edit: ['admin', 'operatorInfo:edit'],
        del: ['admin', 'operatorInfo:del']
      },
      rules: {
        codeNumber: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '运营商应用ID不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '运营商密钥不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        vehicleScale: [
          { required: true, message: '授权车辆数不能为空', trigger: 'blur' }
        ],
        vehicleRealityScale: [
          { required: true, message: '实际投放车辆数不能为空', trigger: 'blur' }
        ],
        lbsNoTravelType: [
          { required: true, message: '禁行区类型（0系统自建 1自主上传）不能为空', trigger: 'blur' }
        ],
        lbsServiceType: [
          { required: true, message: '服务区类型（0系统自建 1自主上传）不能为空', trigger: 'blur' }
        ],
        lbsStationType: [
          { required: true, message: '车站类型（0系统自建 1自主上传）不能为空', trigger: 'blur' }
        ],
        lbsNoParkingType: [
          { required: true, message: '禁停区类型（0系统自建 1自主上传）不能为空', trigger: 'blur' }
        ],
        initStatus: [
          { required: true, message: '运营初始化状态（0未初始化 1已通过 2已提交审批 3未通过）不能为空', trigger: 'blur' }
        ],
        access: [
          { required: true, message: '接入状态（0未接入 1已接入）不能为空', trigger: 'blur' }
        ],
        retreat: [
          { required: true, message: '清退状态（0未清退 1已清退）不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '审批状态（0待审核 1已通过 2审批中 3未通过）不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '申请时间（毫秒时间戳）不能为空', trigger: 'blur' }
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
