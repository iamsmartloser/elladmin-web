<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <span>
          <label class="el-form-item-label">数据来源</label>
          <el-select v-model="query.dataOrigin" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.data_origin"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <span>
          <label class="el-form-item-label">所属运营商</label>
          <SelectWithService
            v-if="city"
            style="width: 185px;"
            clearable
            value-key="id"
            label-key="name"
            :init-value="query.operatorId"
            :params="operatorParams"
            :service="getPage"
            @change="changeOperators"
          />
        </span>
        <!--        <span>-->
        <!--          <label class="el-form-item-label">所属服务区</label>-->
        <!--          <el-input v-model="query.lbsServiceId" clearable placeholder="所属服务区ID" style="width: 185px;" @keyup.enter.native="crud.toQuery" />-->
        <!--        </span>-->

        <label class="el-form-item-label">坐标类型</label>
        <el-select v-model="query.pointType" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in dict.point_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span>
          <label class="el-form-item-label">是否禁用</label>
          <el-select v-model="query.isDisable" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.is_disable"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <!--        <span>-->
        <!--          <label class="el-form-item-label">整改中</label>-->
        <!--          <el-select v-model="query.isImproving" filterable clearable placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in dict.is_improving"-->
        <!--              :key="item.id"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </span>-->
        <span>
          <label class="el-form-item-label">审批状态</label>
          <el-select v-model="query.status" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.approval_status"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <rrOperation :crud="crud" class="rr-op-has-label" :filter-item-class="false" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="数据来源" prop="dataOrigin">
            <el-select v-model="form.dataOrigin" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in dict.data_origin"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属运营商ID" prop="operatorId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="所属服务区ID" prop="lbsServiceId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="照片">
            <el-input v-model="form.picture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车站容量" prop="capacity">
            <el-input v-model="form.capacity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="坐标类型" prop="pointType">
            <el-select v-model="form.pointType" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in dict.point_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="经纬度坐标组" prop="pointValue">
            <el-input v-model="form.pointValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="辐射半径">
            <el-input v-model="form.pointRadius" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否禁用" prop="isDisable">
            <el-select v-model="form.isDisable" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in dict.is_disable"
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
      <!--   图片详情组件   -->
      <image-detail
        v-if="pictures"
        :urls="pictures"
        :visible="imageVisible"
        @close="imageVisible=false;pictures=null"
      />
      <!--   地图详情   -->
      <el-dialog
        title="地图详情"
        :visible.sync="viewVisible"
        class="dialog"
        width="60%"
        @opened="drawMap()"
        @close="clearAll(); rowData = null"
      >
        <Map style="width: 100%;height: 400px;display: inline-block" @ready="ready" />
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <!--        <el-table-column prop="id" label="ID" />-->
        <el-table-column prop="picture" label="照片">
          <template slot-scope="scope">
            <div style="text-align: center">
              <img
                v-if="scope.row.picture"
                style="max-width: 50px;max-height: 100px;cursor:pointer;"
                :src="scope.row.picture"
                @click="imageVisible=true;pictures = scope.row.picture?[scope.row.picture]:null"
              >
              <span v-else>暂无图片</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <!--        <el-table-column prop="remark" label="描述" />-->
        <el-table-column prop="capacity" label="车站容量" />
        <el-table-column prop="dataOrigin" label="数据来源">
          <template slot-scope="scope">
            {{ dict.label.data_origin[scope.row.dataOrigin] }}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="所属运营商" />
        <!--        <el-table-column prop="lbsServiceName" label="所属服务区" />-->
        <!--        <el-table-column prop="operatorApplyId" label="关联申请ID" />-->
        <el-table-column prop="pointType" label="坐标类型">
          <template slot-scope="scope">
            {{ dict.label.point_type[scope.row.pointType] }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="pointValue" label="经纬度坐标组" />-->
        <!--        <el-table-column prop="pointRadius" label="辐射半径" />-->
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="isDisable" label="是否禁用">
          <template slot-scope="scope">
            {{ dict.label.is_disable[scope.row.isDisable] }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="isImproving" label="整改中">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ dict.label.is_improving[scope.row.isImproving] }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="status" label="审批状态">
          <template slot-scope="scope">
            {{ dict.label.approval_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','lbsStation:edit','lbsStation:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <el-button icon="el-icon-view" size="mini" @click="viewVisible = true;rowData = scope.row" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudLbsStation from '@/api/lbs/lbsStation'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import ImageDetail from '@/components/ImageDetail/index'
import { formatDate } from '@/utils/formatDay'
import { getPage } from '@/api/operators/operatorInfo'
import { mapGetters } from 'vuex'
import SelectWithService from '@/components/SelectWithService/index'
import Map from '@/components/Map/index'
import map_mixins from '@/mixins/map'

const defaultForm = { id: null, dataOrigin: null, operatorId: null, lbsServiceId: null, operatorApplyId: null, picture: null, name: null, remark: null, capacity: null, pointType: null, pointValue: null, pointRadius: null, minlng: null, maxlng: null, minlat: null, maxlat: null, createTime: null, isDisable: null, isImproving: null, status: null, createUserId: null, approvalInfoId: null, approvalEndTime: null }
export default {
  name: 'LbsStation',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService, ImageDetail, Map },
  mixins: [presenter(), header(), form(defaultForm), crud(), map_mixins],
  dicts: ['data_origin', 'point_type', 'is_disable', 'is_improving', 'approval_status'],
  cruds() {
    return CRUD({ title: 'lbs_station', url: 'lbs/page', queryOnPresenterCreated: false, idField: 'id', sort: 'id,desc', crudMethod: { ...crudLbsStation }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'lbsStation:add'],
        edit: ['admin', 'lbsStation:edit'],
        del: ['admin', 'lbsStation:del']
      },
      rules: {
        dataOrigin: [
          { required: true, message: '数据来源不能为空', trigger: 'blur' }
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
        capacity: [
          { required: true, message: '车站容量不能为空', trigger: 'blur' }
        ],
        pointType: [
          { required: true, message: '坐标类型不能为空', trigger: 'blur' }
        ],
        pointValue: [
          { required: true, message: '经纬度坐标组不能为空', trigger: 'blur' }
        ],
        isDisable: [
          { required: true, message: '是否禁用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'dataOrigin', display_name: '数据来源' },
        { key: 'operatorId', display_name: '所属运营商' },
        { key: 'lbsServiceId', display_name: '所属服务区' },
        { key: 'pointType', display_name: '坐标类型' },
        { key: 'isDisable', display_name: '是否禁用' },
        { key: 'isImproving', display_name: '整改中' },
        { key: 'status', display_name: '审批状态' }
      ],
      pictures: null,
      imageVisible: false,
      rowData: null,
      viewVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ]),
    operatorParams() {
      return { page: 0, areaCode: this.city && this.city.areaCode }
    }
  },
  watch: {
    city(val) {
      this.crud.query.areaCode = val && val.areaCode
      this.crud.page.page = 1
      this.crud.refresh()
    }
  },
  beforeCreate() {
    this.crud.optShow.edit = false
    this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
  },
  mounted() {
    this.crud.query.areaCode = this.city && this.city.areaCode
    this.crud.query.type = 'station'
    this.crud.refresh()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.query.areaCode = this.city && this.city.areaCode
      this.crud.query.type = 'station'
      // 框架本身page是从0开始传，由于新写的接口需要从1开始传，所以这里需要修改,0表示查询列表部分页
      this.crud.query.page = this.crud.page.page
      return true
    },
    getPage, // 获取运营商列表
    formatDate,
    changeOperators(id) {
      this.crud.query.operatorId = id
    },
    ready(map) {
      this.map = map
      console.log('ready:', map)
    },
    drawMap() {
      const { pintBD09, pointType, isDisable } = this.rowData
      if (pointType === 0) { // 圆形 pointRadius
        const p = pintBD09.split(',')
        const point = { lng: parseFloat(p[0]), lat: parseFloat(p[1]) }
        this.drawCircle(point, null, { strokeColor: 'stationColor',
          icon: {
            url: parseInt(isDisable) ? require('@/assets/images/stationMarkTwo.png') : require('@/assets/images/stationMarkOne.png'),
            size: [36, 38],
            imageSize: [36, 38],
            anchor: [18, 38]
          }}, true)
      } else if (pointType === 1) { // 多边形
        const points = pintBD09.split(';').map(item => {
          const p = item.split(',')
          return { lng: parseFloat(p[0]), lat: parseFloat(p[1]) }
        })
        console.log('points', points)
        this.drawPolygon(points, { strokeColor: 'stationColor' }, true)
      }
    }
  }
}
</script>

<style scoped>

</style>
