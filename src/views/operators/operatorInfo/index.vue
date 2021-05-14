<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <span>
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
        </span>
        <span>
          <label class="el-form-item-label">统一社会信用代码</label>
          <el-input v-model="query.codeNumber" maxlength="50" clearable placeholder="统一社会信用代码" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        </span>
        <span>
          <label class="el-form-item-label">公司名称</label>
          <el-input v-model="query.name" maxlength="50" clearable placeholder="公司名称" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        </span>
        <span>
          <label class="el-form-item-label">服务区类型</label>
          <el-select v-model="query.lbsServiceType" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.lbs_created_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <span>
          <label class="el-form-item-label">车站类型</label>
          <el-select v-model="query.lbsStationType" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.lbs_created_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <span>
          <label class="el-form-item-label">禁停区类型</label>
          <el-select v-model="query.lbsNoParkingType" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.lbs_created_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
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
        <span>
          <label class="el-form-item-label">接入状态</label>
          <el-select v-model="query.access" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.access_status"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
        <span>
          <label class="el-form-item-label">清退状态</label>
          <el-select v-model="query.retreat" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in dict.retreat_status"
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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="550px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px">
          <el-form-item v-if="crud.status.edit" v-show="false" label="ID" prop="operatorId">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <!--          <el-form-item label="车辆品牌" prop="brandId">-->
          <!--            <SelectWithService-->
          <!--              v-if="city"-->
          <!--              v-model="crud.form.brandId"-->
          <!--              style="width: 370px;"-->
          <!--              :init-value="crud.form.brandId"-->
          <!--              clearable-->
          <!--              value-key="id"-->
          <!--              label-key="name"-->
          <!--              :params="brandParams"-->
          <!--              :service="getBrandList"-->
          <!--              @change="changeFormBrand"-->
          <!--            />-->
          <!--          </el-form-item>-->
                    <el-form-item v-if="crud.status.add" label="统一社会信用代码" prop="codeNumber">
                      <el-input maxlength="50" v-model="form.codeNumber" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item v-if="crud.status.add" label="公司名称" prop="name">
                      <el-input v-model="form.name" maxlength="50" style="width: 370px;" />
                    </el-form-item>
          <el-form-item v-if="crud.status.edit" label="联系人邮箱" prop="contactsEmail">
            <el-input v-model="form.contactsEmail" maxlength="50" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="crud.status.edit" label="联系人姓名" prop="contactsName">
            <el-input v-model="form.contactsName" maxlength="50" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="crud.status.edit" label="联系人电话" prop="contactsPhoneNumber">
            <el-input v-model="form.contactsPhoneNumber" maxlength="11" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="授权车辆数" prop="vehicleScale">
            <el-input-number v-model="form.vehicleScale" :min="0" :max="9999999" />
          </el-form-item>

          <!--          <el-form-item label="服务区类型" prop="lbsServiceType">-->
          <!--            <el-select v-model="form.lbsServiceType" filterable clearable placeholder="请选择" style="width: 370px;">-->
          <!--              <el-option-->
          <!--                v-for="item in dict.lbs_created_type"-->
          <!--                :key="item.id"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="车站类型" prop="lbsStationType">-->
          <!--            <el-select v-model="form.lbsStationType" filterable clearable placeholder="请选择" style="width: 370px;">-->
          <!--              <el-option-->
          <!--                v-for="item in dict.lbs_created_type"-->
          <!--                :key="item.id"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="禁停区类型" prop="lbsNoParkingType">-->
          <!--            <el-select v-model="form.lbsNoParkingType" filterable clearable placeholder="请选择" style="width: 370px;">-->
          <!--              <el-option-->
          <!--                v-for="item in dict.lbs_created_type"-->
          <!--                :key="item.id"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="审批状态" prop="status">-->
          <!--            <el-select v-model="form.status" filterable clearable placeholder="请选择" style="width: 370px;">-->
          <!--              <el-option-->
          <!--                v-for="item in dict.approval_status"-->
          <!--                :key="item.id"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--   运营商公钥查看   -->
      <el-dialog
        v-if="secretVisible"
        title="运营商公钥查看"
        :visible.sync="secretVisible"
        class="dialog"
        width="500px"
        @close="secretVisible = false;appSecret = null"
      >
        <div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            :value="appSecret"
          />
        </div>

      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <!--        <el-table-column prop="id" label="ID" />-->
        <el-table-column prop="brandName" label="车辆品牌" />
        <el-table-column prop="codeNumber" label="统一社会信用代码" />
        <el-table-column prop="appId" label="运营商应用ID" />
        <el-table-column prop="appSecret" label="运营商公钥" align="center">
          <template slot-scope="scope">
            <div style="text-align: center">
              <i class="el-icon-view" :size="40" style="margin-right: 16px;cursor: pointer;" title="获取密钥" @click.prevent="getPublicKey(scope.row, scope.$index)" />
              <el-popover v-model="resetSecretPopover[scope.row.id]" title="温馨提示" placement="top" width="180" trigger="manual">
                <p>{{ '重置后不可恢复，确定要重置吗' }}</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="resetSecretPopover[scope.row.id] = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="resetPublicKey(scope.row, scope.$index);resetSecretPopover[scope.row.id] = false">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-refresh" title="重置密钥" style="cursor: pointer;" @click.prevent="resetSecretPopover[scope.row.id] = true" />
              </el-popover>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="name" label="公司名称" />
        <el-table-column prop="vehicleScale" label="授权车辆数" />
        <el-table-column prop="vehicleRealityScale" label="实际投放车辆数" />
        <el-table-column prop="lbsServiceType" label="服务区类型">
          <template slot-scope="scope">
            {{ dict.label.lbs_created_type[scope.row.lbsServiceType] }}
          </template>
        </el-table-column>
        <el-table-column prop="lbsStationType" label="车站类型">
          <template slot-scope="scope">
            {{ dict.label.lbs_created_type[scope.row.lbsStationType] }}
          </template>
        </el-table-column>
        <el-table-column prop="lbsNoParkingType" label="禁停区类型">
          <template slot-scope="scope">
            {{ dict.label.lbs_created_type[scope.row.lbsNoParkingType] }}
          </template>
        </el-table-column>
        <el-table-column prop="access" label="接入状态">
          <template slot-scope="scope">
            {{ dict.label.access_status[scope.row.access] }}
          </template>
        </el-table-column>
        <el-table-column prop="retreat" label="清退状态">
          <template slot-scope="scope">
            {{ dict.label.retreat_status[scope.row.retreat] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态">
          <template slot-scope="scope">
            {{ dict.label.approval_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="approvalEndTime" label="审批流程结束时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.approvalEndTime) }}
          </template>
        </el-table-column>
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
import operatorInfo from '@/api/operators/operatorInfo'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import SelectWithService from '@/components/SelectWithService/index'
import { getList } from '@/api/operators/vehicleBrandInfo'
import { formatDate } from '@/utils/formatDay'
import { mapGetters } from 'vuex'

const defaultForm = { id: null, contactsEmail: null, contactsName: null, contactsPhoneNumber: null, vehicleScale: null, areaCode: null, brandId: null, codeNumber: null, appId: null, appPrivate: null, appSecret: null, name: null, vehicleScale: null, vehicleRealityScale: null, lbsServiceType: null, lbsStationType: null, lbsNoParkingType: null, access: null, retreat: null, status: null, createTime: null, createUserId: null, approvalInfoId: null, approvalEndTime: null }
// const defaultForm = { }
export default {
  name: 'OperatorInfo',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['lbs_created_type', 'access_status', 'retreat_status', 'approval_status'],
  cruds() {
    return CRUD({ title: '运营商', url: 'operators/page', queryOnPresenterCreated: false, idField: 'id', sort: 'id,desc', crudMethod: { ...operatorInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'operatorInfo:add'],
        edit: ['admin', 'operatorInfo:edit'],
        del: ['admin', 'operatorInfo:del']
      },
      rules: {
        areaCode: [
          { required: true, message: '行政区划代码不能为空', trigger: 'blur' }
        ],
        brandId: [
          { required: true, message: '车辆品牌不能为空', trigger: 'blur' }
        ],
        codeNumber: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        vehicleScale: [
          { required: true, message: '授权车辆数不能为空', trigger: 'blur' }
        ],
        lbsServiceType: [
          { required: true, message: '服务区类型不能为空', trigger: 'blur' }
        ],
        lbsStationType: [
          { required: true, message: '车站类型不能为空', trigger: 'blur' }
        ],
        lbsNoParkingType: [
          { required: true, message: '禁停区类型不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '审批状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'brandId', display_name: '车辆品牌ID' },
        { key: 'codeNumber', display_name: '统一社会信用代码' },
        { key: 'name', display_name: '公司名称' },
        { key: 'lbsServiceType', display_name: '服务区类型' },
        { key: 'lbsStationType', display_name: '车站类型' },
        { key: 'lbsNoParkingType', display_name: '禁停区类型' },
        { key: 'access', display_name: '接入状态' },
        { key: 'retreat', display_name: '清退状态' },
        { key: 'status', display_name: '审批状态' }
      ],
      secretVisible: false,
      appSecret: '',
      resetSecretPopover: {}
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ]),
    brandParams() {
      return { areaCode: this.city && this.city.areaCode }
    }
  },
  watch: {
    city(val) {
      this.crud.query.areaCode = val && val.areaCode
      this.crud.refresh()
    }
  },
  beforeCreate() {
    // this.crud.optShow.edit = false
    // this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
  },
  mounted() {
    this.crud.query.areaCode = this.city && this.city.areaCode
    this.crud.refresh()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      // 框架本身page是从0开始传，由于新写的接口需要从1开始传，所以这里需要修改
      this.crud.query.areaCode = this.city && this.city.areaCode
      this.crud.query.page = this.crud.page.page
      return true
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.crud.form.areaCode = this.city && this.city.areaCode
      this.crud.form.operatorId = this.crud.form.id
      if(this.crud.status.add){
        this.crud.form.planVehicleScale = this.crud.form.vehicleScale
      }
      return true
    },
    formatDate,
    getBrandList: getList, // 获取品牌列表
    changeBrand(id) {
      // console.log('ids', ids)
      this.crud.query.brandId = id
    },
    changeFormBrand(id) {
      // console.log('ids', ids)
      this.crud.form.brandId = id
    },
    getPublicKey(row, index) {
      console.log('getPublicKey', index)
      operatorInfo.getOperatorAppSecrete({ operatorId: row.id }).then(res => {
        if (res && res.status === 200) {
          this.appSecret = res && res.content
          this.secretVisible = true
        } else {
          this.$message.error(res && res.message || '获取公钥失败')
        }
      })
    },
    resetPublicKey(row, index) {
      console.log('resetPublicKey', index)
      operatorInfo.resetOperatorAppSecrete({ operatorId: row.id }).then(res => {
        if (res && res.status === 200) {
          this.$message.success(res && res.message || '重置公钥成功,可点击查看')
        } else {
          this.$message.error(res && res.message || '重置公钥失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
