<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <label class="el-form-item-label">车辆品牌ID</label>
        <el-input v-model="query.brandId" clearable placeholder="车辆品牌ID" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属运营商ID</label>
        <el-input v-model="query.operatorId" clearable placeholder="所属运营商ID" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">车牌号码</label>
        <el-input v-model="query.carNumber" clearable placeholder="车牌号码" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">举报类型</label>
        <el-input v-model="query.type" clearable placeholder="举报类型" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">举报人姓名</label>
        <el-input v-model="query.userName" clearable placeholder="举报人姓名" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">审批状态</label>
        <el-input v-model="query.status" clearable placeholder="审批状态（0待审核 1已通过 2审批中 3未通过）" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">运营商处置状态</label>
        <el-input v-model="query.handleStatus" clearable placeholder="运营商处置状态" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
<!--        <date-range-picker-->
<!--          v-model="query.createTime"-->
<!--          start-placeholder="createTimeStart"-->
<!--          end-placeholder="createTimeStart"-->
<!--          class="date-item"-->
<!--        />-->
        <rrOperation :crud="crud" class="rr-op-has-label" :filter-item-class="false" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="车辆品牌ID" prop="brandId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="所属运营商ID" prop="operatorId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="车牌号码">
            <el-input v-model="form.carNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="举报类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.supervise_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="照片">
            <el-input v-model="form.picture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="举报说明">
            <el-input v-model="form.explain" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="举报时间" prop="createTime">
            <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运营商处置状态" prop="handleStatus">
            <el-select v-model="form.handleStatus" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.approval_status"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
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
        <el-table-column prop="operatorId" label="所属运营商ID" />
        <el-table-column prop="carNumber" label="车牌号码" />
        <el-table-column prop="type" label="举报类型">
          <template slot-scope="scope">
            {{ dict.label.supervise_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="picture" label="照片" />
        <el-table-column prop="explain" label="举报说明" />
        <el-table-column prop="userName" label="举报人姓名" />
        <el-table-column prop="createTime" label="举报时间" />
        <el-table-column prop="status" label="审批状态">
          <template slot-scope="scope">
            {{ dict.label.approval_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="handleStatus" label="运营商处置状态">
          <template slot-scope="scope">
            {{ dict.label.approval_status[scope.row.handleStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="approvalEndTime" label="审批流程结束时间" />
        <el-table-column v-if="checkPer(['admin','superviseVehicleReport:edit','superviseVehicleReport:del'])" label="操作" width="150px" align="center">
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
  import superviseVehicleReport from '@/api/operators/superviseVehicleReport'
    import CRUD, {crud, form, header, presenter} from '@crud/crud'
    import rrOperation from '@crud/RR.operation'
    import crudOperation from '@crud/CRUD.operation'
    import udOperation from '@crud/UD.operation'
    import pagination from '@crud/Pagination'

    const defaultForm = { id: null, brandId: null, operatorId: null, vehicleId: null, carNumber: null, type: null, picture: null, explain: null, userId: null, userName: null, createTime: null, status: null, handleStatus: null, approvalInfoId: null, approvalEndTime: null }
export default {
  name: 'SuperviseVehicleReport',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['supervise_type', 'approval_status', 'approval_status'],
  cruds() {
    return CRUD({ title: '举报管理', url: '/supervise/', idField: 'id', sort: 'id,desc', crudMethod: { ...superviseVehicleReport }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'superviseVehicleReport:add'],
        edit: ['admin', 'superviseVehicleReport:edit'],
        del: ['admin', 'superviseVehicleReport:del']
      },
      rules: {
        brandId: [
          { required: true, message: '车辆品牌ID不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '所属运营商ID不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '举报类型不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '举报时间不能为空', trigger: 'blur' }
        ],
        handleStatus: [
          { required: true, message: '运营商处置状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'brandId', display_name: '车辆品牌ID' },
        { key: 'operatorId', display_name: '所属运营商ID' },
        { key: 'carNumber', display_name: '车牌号码' },
        { key: 'type', display_name: '举报类型' },
        { key: 'userName', display_name: '举报人姓名' },
        { key: 'status', display_name: '审批状态' },
        { key: 'handleStatus', display_name: '运营商处置状态' }
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
