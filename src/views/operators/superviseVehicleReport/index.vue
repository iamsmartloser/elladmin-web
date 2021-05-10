<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <label class="el-form-item-label">车辆品牌:</label>
        <SelectWithService
          v-if="city"
          style="width: 185px;"
          clearable
          value-key="id"
          label-key="name"
          :params="brandParams"
          :service="getBrandList"
          @change="changeBrand"
        />
        <label class="el-form-item-label">所属运营商:</label>
        <SelectWithService
          v-if="city"
          style="width: 185px;"
          clearable
          value-key="id"
          label-key="name"
          :params="operatorParams"
          :service="getPage"
          @change="changeOperators"
        />
        <label class="el-form-item-label">车牌号码:</label>
        <el-input
          v-model="query.carNumber"
          clearable
          placeholder="车牌号码"
          style="width: 185px;"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">举报类型:</label>
        <el-input
          v-model="query.type"
          clearable
          placeholder="举报类型"
          style="width: 185px;"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">举报人姓名:</label>
        <el-input
          v-model="query.userName"
          clearable
          placeholder="举报人姓名"
          style="width: 185px;"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">审批状态:</label>
        <el-select v-model="query.status" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.approval_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">运营商处置状态:</label>
        <el-select v-model="query.handleStatus" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.supervise_handle_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!--        <el-input v-model="query.handleStatus" clearable placeholder="运营商处置状态" style="width: 185px;" @keyup.enter.native="crud.toQuery" />-->
        <rrOperation :crud="crud" class="rr-op-has-label" :filter-item-class="false" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
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
                :value="item.value"
              />
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
                v-for="item in dict.supervise_handle_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <image-detail
        v-if="rowData&&rowData.picture"
        :urls="JSON.parse(rowData.picture)"
        :visible="imageVisible"
        @close="imageVisible=false;"
      />
      <image-detail
        v-if="handlePictures"
        :urls="handlePictures"
        :visible="handleImageVisible"
        @close="handleImageVisible=false;handlePictures=null"
      />
      <el-dialog v-if="rowData" title="举报详情" :visible.sync="viewVisible" @close="viewVisible=false;rowData=null">
        <div style="min-height: 400px">
          <el-form>
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="举报照片">
                  <span v-for="pic in (JSON.parse(rowData.picture)||[])">
                    <img
                      v-if="pic"
                      style="max-width: 50px;max-height: 100px;cursor:pointer;margin-right: 8px;"
                      :src="pic"
                      @click="imageVisible=true;"
                    >
                  </span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="车辆品牌">
                  {{ rowData.brandName }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="所属运营商">
                  {{ rowData.operatorName }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="车牌号码">
                  {{ rowData.carNumber }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="举报类型">
                  {{ dict.label.supervise_type[rowData.type] }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="举报说明">
                  {{ rowData.explain }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="举报人姓名">
                  {{ rowData.userName }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="举报时间">
                  {{ rowData.createTime }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="审批状态">
                  {{ dict.label.approval_status[rowData.status] }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="运营商处理状态">
                  {{ dict.label.supervise_handle_type[rowData.handleStatus] }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-for="(handle,index) in (rowData.handles||[])" style="border-top: #aaaaaa 1px dashed; ">
              <div style="padding: 8px; text-align: center">处理流程{{ index+1 }}：</div>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="处理时间">
                  {{ handle.createTime }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item handle="处理人">
                  {{ handle.userName }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="处理说明">
                  {{ handle.explain }}
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="处理照片">
                  <span v-for="pic in (JSON.parse(handle.picture)||[])">
                    <img
                      v-if="pic"
                      style="max-width: 50px;max-height: 100px;cursor:pointer;margin-right: 8px;"
                      :src="pic"
                      @click="handleImageVisible=true;handlePictures=JSON.parse(handle.picture);"
                    >
                  </span>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>

      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <!--        <el-table-column prop="id" label="ID" />-->
        <el-table-column prop="picture" label="照片">
          <template slot-scope="scope">
            <!--            <el-button @click="imageVisible=true;rowData=scope.row">test</el-button>-->
            <div style="text-align: center">
              <img
                v-if="scope.row.picture"
                style="max-width: 50px;max-height: 100px;cursor:pointer;"
                :src="JSON.parse(scope.row.picture)[0]"
                @click="imageVisible=true;rowData=scope.row"
              >
              <span v-else>暂无图片</span>
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="brandName" label="车辆品牌" />
        <el-table-column prop="operatorName" label="所属运营商" />
        <el-table-column prop="carNumber" label="车牌号码" />
        <el-table-column prop="type" label="举报类型">
          <template slot-scope="scope">
            {{ dict.label.supervise_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="explain" label="举报说明" />
        <el-table-column prop="userName" label="举报人姓名" />
        <el-table-column prop="createTime" label="举报时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态">
          <template slot-scope="scope">
            {{ dict.label.approval_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="handleStatus" label="运营商处置状态" width="120px">
          <template slot-scope="scope">
            <!--      0是未处理状态  只要不是0，就都可以查看举报详情    -->
            <el-button v-if="scope.row.handleStatus!=='0'" type="text" @click.prevent="toView(scope.row)">
              {{ dict.label.supervise_handle_type[scope.row.handleStatus]
              }}(点击查看)
            </el-button>
            <div v-else>{{ dict.label.supervise_handle_type[scope.row.handleStatus] }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="approvalEndTime" label="审批流程结束时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.approvalEndTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPer(['admin','superviseVehicleReport:edit','superviseVehicleReport:del'])"
          label="操作"
          width="150px"
          align="center"
        >
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
import { getList } from '@/api/operators/vehicleBrandInfo'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import SelectWithService from '@/components/SelectWithService/index'
import ImageDetail from '@/components/ImageDetail/index'
import { getPage } from '@/api/operators/operatorInfo'
import { formatDate } from '@/utils/formatDay'
import { mapGetters } from 'vuex'

const defaultForm = {
  id: null,
  brandId: null,
  operatorId: null,
  vehicleId: null,
  carNumber: null,
  type: null,
  picture: null,
  explain: null,
  userId: null,
  userName: null,
  createTime: null,
  status: null,
  handleStatus: null,
  approvalInfoId: null,
  approvalEndTime: null
}
export default {
  name: 'SuperviseVehicleReport',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService, ImageDetail },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['supervise_type', 'approval_status', 'supervise_handle_type'],
  cruds() {
    return CRUD({
      title: '举报管理', url: '/supervise/', queryOnPresenterCreated: false, idField: 'id', sort: 'id,desc',
      crudMethod: { ...superviseVehicleReport }
    })
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
      ],
      imageVisible: false, // 查看举报图片详情的弹窗
      rowData: null,
      viewVisible: false, // 查看举报详情的弹窗
      handleImageVisible: false, // 查看处理图片详情的弹窗
      handlePictures: null
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ]),
    brandParams() {
      return { areaCode: this.city && this.city.areaCode }
    },
    operatorParams() {
      return { page: 0, areaCode: this.city && this.city.areaCode }
    }
  },

  watch: {
    city(val) {
      this.crud.query.areaCode = val && val.areaCode
      this.crud.refresh()
    }
  },
  beforeCreate() {
    this.crud.optShow.edit = false
    this.crud.optShow.add = false
  },
  mounted() {
    this.crud.query.areaCode = this.city && this.city.areaCode
    this.crud.refresh()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    changeOperators(id) {
      this.crud.query.operatorId = id
    },
    formatDate,
    getPage, // 获取运营商列表
    getBrandList: getList, // 获取品牌列表
    changeBrand(id) {
      // console.log('ids', ids)
      this.crud.query.brandId = id
    },
    toView(row) {
      this.rowData = row
      this.viewVisible = true
    }
  }
}
</script>

<style scoped>

</style>
