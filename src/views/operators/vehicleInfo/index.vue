<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <label class="el-form-item-label">车辆编码:</label>
        <el-input v-model="query.carNumber" clearable placeholder="车辆编码" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
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
        <label class="el-form-item-label">投车计划ID:</label>
        <el-input v-model="query.vehicleLaunchesId" clearable placeholder="投车计划ID" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">车辆类型</label>
        <el-select v-model="query.type" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.vehicel_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">车辆举报状态:</label>
        <el-select v-model="query.reportStatus" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.vehicle_supervise_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">车辆状态:</label>
        <el-select v-model="query.status" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.vehicle_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" class="rr-op-has-label" :filter-item-class="false" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item v-if="crud.status.edit" v-show="false" label="ID">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车辆品牌" prop="brandId">
            <SelectWithService
              v-if="city"
              v-model="crud.form.brandId"
              style="width: 370px;"
              :initValue="crud.form.brandId"
              clearable
              value-key="id"
              label-key="name"
              :params="brandParams"
              :service="getBrandList"
              @change="changeFormBrand"
            />
          </el-form-item>
          <el-form-item label="所属运营商" prop="operatorId">
            <SelectWithService
              v-if="city"
              v-model="crud.form.operatorId"
              style="width: 370px;"
              clearable
              :initValue="crud.form.operatorId"
              value-key="id"
              label-key="name"
              :params="operatorParams"
              :service="getPage"
              @change="changeFormOperators"
            />
          </el-form-item>
          <el-form-item label="照片">
            <el-input v-model="form.picture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车辆编码" prop="carNumber">
            <el-input v-model="form.carNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车辆二维码信息" prop="rqCode">
            <el-input v-model="form.rqCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车辆类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择" style="width: 370px;" >
              <el-option
                v-for="item in dict.vehicel_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车辆举报状态" prop="reportStatus" >
            <el-select v-model="form.reportStatus" filterable placeholder="请选择" style="width: 370px;" >
              <el-option
                v-for="item in dict.vehicle_supervise_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车辆状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 370px;" >
              <el-option
                v-for="item in dict.vehicle_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="其他状态说明">
            <el-input v-model="form.statusExplain" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <image-detail
        v-if="pictures"
        :urls="pictures"
        :visible="imageVisible"
        @close="imageVisible=false;pictures=null"
      />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="picture" label="照片">
          <template slot-scope="scope">
            <!--            <el-button @click="imageVisible=true;rowData=scope.row">test</el-button>-->
            <div style="text-align: center">
              <img
                v-if="scope.row.picture"
                style="max-width: 50px;max-height: 100px;cursor:pointer;"
                :src="scope.row.picture"
                @click="imageVisible=true;rowData=scope.row;pictures = scope.row.picture?[scope.row.picture]:[]"
              >
              <span v-else>暂无图片</span>
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="id" label="车辆ID" />-->
        <el-table-column prop="carNumber" label="车辆编码" />
        <el-table-column prop="brandName" label="车辆品牌" />
        <el-table-column prop="operatorName" label="所属运营商" />
        <el-table-column prop="vehicleLaunchesId" label="投车计划ID" />
        <el-table-column prop="rqCode" label="车辆二维码信息" />
        <el-table-column prop="type" label="车辆类型">
          <template slot-scope="scope">
            {{ dict.label.vehicel_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="reportStatus" label="车辆举报状态">
          <template slot-scope="scope">
            {{ dict.label.vehicle_supervise_status[scope.row.reportStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="车辆状态">
          <template slot-scope="scope">
            {{ dict.label.vehicle_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="statusExplain" label="其他状态说明" />
        <el-table-column prop="lng" label="经度" />
        <el-table-column prop="lat" label="纬度" />
        <el-table-column prop="lastReportTime" label="最后上报时间" />
        <el-table-column prop="createTime" label="车辆创建时间" />
        <el-table-column v-if="checkPer(['admin','vehicleInfo:edit','vehicleInfo:del'])" label="操作" width="150px" align="center">
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
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import SelectWithService from '@/components/SelectWithService/index'
import ImageDetail from '@/components/ImageDetail/index'
import vehicleInfo from '@/api/operators/vehicleInfo'
import { getPage } from '@/api/operators/operatorInfo'
import { getList } from '@/api/operators/vehicleBrandInfo'
import { formatDate } from '@/utils/formatDay'
import { mapGetters } from 'vuex'

const defaultForm = { id: null, brandId: null, operatorId: null, vehicleLaunchesId: null, picture: null, carNumber: null, rqCode: null, type: null, reportStatus: null, status: null, statusExplain: null, lng: null, lat: null, lastReportTime: null, createTime: null }
export default {
  name: 'VehicleInfo',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService, ImageDetail },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['vehicel_type', 'vehicle_supervise_status', 'vehicle_status'],
  cruds() {
    return CRUD({ title: 'vehicle', url: 'vehicle/page', queryOnPresenterCreated: false, idField: 'id', sort: 'id,desc', crudMethod: { ...vehicleInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'vehicleInfo:add'],
        edit: ['admin', 'vehicleInfo:edit'],
        del: ['admin', 'vehicleInfo:del']
      },
      rules: {
        brandId: [
          { required: true, message: '车辆品牌ID不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '所属运营商ID不能为空', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '车辆编码不能为空', trigger: 'blur' }
        ],
        rqCode: [
          { required: true, message: '车辆二维码信息不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '车辆类型（0 电单车 1自行车）不能为空', trigger: 'blur' }
        ],
        reportStatus: [
          { required: true, message: '车辆举报状态（0正常 1被举报）不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '车辆状态（0空闲中 1骑行中 2临时停车 3状态丢失 4运维中 5其他）不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'brandId', display_name: '车辆品牌ID' },
        { key: 'operatorId', display_name: '所属运营商ID' },
        { key: 'carNumber', display_name: '车辆编码' },
        { key: 'type', display_name: '车辆类型（0 电单车 1自行车）' },
        { key: 'reportStatus', display_name: '车辆举报状态（0正常 1被举报）' },
        { key: 'status', display_name: '车辆状态（0空闲中 1骑行中 2临时停车 3状态丢失 4运维中 5其他）' }
      ],
      pictures: null,
      imageVisible: false
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
  mounted() {
    this.crud.query.areaCode = this.city && this.city.areaCode
    this.crud.refresh()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    formatDate,
    getPage, // 获取运营商列表
    getBrandList: getList, // 获取品牌列表
    changeBrand(id) {
      // console.log('ids', ids)
      this.crud.query.brandId = id
    },
    changeOperators(id) {
      this.crud.query.operatorId = id
    },
    changeFormBrand(id) {
      // console.log('ids', ids)
      this.crud.form.brandId = id
    },
    changeFormOperators(id) {
      this.crud.form.operatorId = id
    },
  }
}
</script>

<style scoped>

</style>
