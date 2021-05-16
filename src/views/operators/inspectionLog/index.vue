<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <span>
          <label class="el-form-item-label">巡检类型</label>
          <el-select v-model="query.type" filterable placeholder="请选择">
            <el-option
              v-for="item in dict.inspection_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
<!--        <span>-->
<!--          <label class="el-form-item-label">巡检人员</label>-->
<!--          <el-input v-model="query.userName" clearable placeholder="巡检人员" style="width: 185px;" @keyup.enter.native="crud.toQuery" />-->
<!--        </span>-->

        <span>
          <label class="el-form-item-label">查询其他运营商</label>
          <el-checkbox v-model="query.other"></el-checkbox>
          <SelectWithService
            v-if="(query.other)&&city"
            style="width: 185px;"
            placeholder="请选择运营商"
            clearable
            value-key="id"
            label-key="name"
            :init-value="query.userOperatorId"
            :params="operatorParams"
            :service="getPage"
            @change="changeOperators"
          />
        </span>
        <!--        <label class="el-form-item-label">巡检员所属运营商</label>-->
        <!--        <el-input v-model="query.userOperatorId" clearable placeholder="巡检员所属运营商" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <span>
          <label class="el-form-item-label">时间</label>
<!--          <date-range-picker-->
<!--            v-model="query.createTime"-->
<!--            type="datetimerange"-->
<!--            value-format="timestamp"-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--          />-->
          <el-date-picker
            v-model="query.createTime"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </span>

        <rrOperation :crud="crud" class="rr-op-has-label" :filter-item-class="false" />
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
          <!--          <el-form-item label="巡检前照片">-->
          <!--            <el-input v-model="form.beforePicture" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="巡检后照片">-->
          <!--            <el-input v-model="form.afterPicture" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="巡检说明">
            <el-input v-model="form.explains" style="width: 370px;" />
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
        <el-table-column prop="type" label="巡检类型">
          <template slot-scope="scope">
            {{ dict.label.inspection_type[scope.row.type] }}
          </template>
        </el-table-column>

        <el-table-column prop="explains" label="巡检说明" />
        <el-table-column prop="userName" label="巡检人员" />
        <!--        <el-table-column prop="userRoleType" label="巡检员角色类型">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ dict.label.inspection_role_type[scope.row.userRoleType] }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="operatorName" label="巡检员所属运营商" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="userOrganizeName" label="巡检员所属机构名称" />-->
        <!--        <el-table-column v-if="checkPer(['admin','inspectionLog:edit','inspectionLog:del'])" label="操作" width="150px" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <udOperation-->
        <!--              :data="scope.row"-->
        <!--              :permission="permission"-->
        <!--            />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
import { getPage } from '@/api/operators/operatorInfo'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/formatDay'
import SelectWithService from '@/components/SelectWithService/index'
import ImageDetail from '@/components/ImageDetail/index'

const defaultForm = { id: null, type: null, beforePicture: null, afterPicture: null, explains: null, userId: null, userName: null, userRoleType: null, userOperatorId: null, createTime: null, userOrganizeName: null }
export default {
  name: 'InspectionLog',
  components: { pagination, crudOperation, rrOperation, udOperation, SelectWithService, ImageDetail },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['inspection_type'],
  cruds() {
    return CRUD({ title: '城市巡检', url: '/inspection/', queryOnPresenterCreated: false, query:{other:false},idField: 'id', sort: 'id,desc', crudMethod: { ...crudInspectionLog }})
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
      ],
      pictures: null,
      imageVisible: false,
      checkOtherOp: false
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
      // this.crud.query.own = true
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
    // this.crud.query.own = true
    this.crud.refresh()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      // console.log('crud.query.createTime',this.crud.query.createTime)
      this.crud.query.areaCode = this.city && this.city.areaCode
      return true
    },
    getPage, // 获取运营商列表
    formatDate,
    changeOperators(id) {
      this.crud.query.userOperatorId = id
    }
  }
}
</script>

<style scoped>

</style>
