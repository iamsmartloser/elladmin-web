<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" class="search-wrap-has-label">
        <!-- 搜索 -->
        <label class="el-form-item-label">行政区划代码:</label>
        <el-input v-model="query.areaCode" clearable placeholder="行政区划代码" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">城市名称:</label>
        <el-input v-model="query.name" clearable placeholder="城市名称" style="width: 185px;" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="行政区划代码" prop="areaCode">
            <el-input v-model="form.areaCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城市名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
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
        <el-table-column prop="areaCode" label="行政区划代码" />
        <el-table-column prop="name" label="城市名称" />
        <el-table-column prop="brandNames" label="品牌列表" />
        <el-table-column v-if="checkPer(['admin','lbsCity:edit','lbsCity:del'])" label="操作" width="150px" align="center">
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
import lbsCity from '@/api/lbs/lbsCity'

const defaultForm = { id: null, areaCode: null, name: null }
export default {
  name: 'LbsCity',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '城市', url: '/city/page', idField: 'id', sort: 'id,desc', crudMethod: { ...lbsCity }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'lbsCity:add'],
        edit: ['admin', 'lbsCity:edit'],
        del: ['admin', 'lbsCity:del']
      },
      rules: {
        areaCode: [
          { required: true, message: '行政区划代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '城市名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'areaCode', display_name: '行政区划代码' },
        { key: 'name', display_name: '城市名称' }
      ]
    }
  },
  beforeCreate() {
    this.crud.optShow.download = false
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
