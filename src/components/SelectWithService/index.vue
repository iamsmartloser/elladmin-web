<template>
  <el-select
    v-model="value"
    :placeholder="placeholder"
    :multiple="multiple"
    filterable
    :clearable="clearable"
    @change="change"
    @filter-method="filterMethod"
  >
    <el-option
      v-for="item in dataSource"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    >
      <span style="float: left">{{ item[labelKey] }}</span>
      <!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ item[valueKey] }}</span>-->
    </el-option>
    <el-option
      v-if="!multiple&&initValue&&(initValue[valueKey]===value)&&(dataSource.findIndex(d=>d[valueKey]===initValue[valueKey])<0)"
      :key="initValue[valueKey]"
      :label="initValue[labelKey]"
      :value="initValue[valueKey]"
    >
      <span style="float: left">{{ initValue[labelKey] }}</span>
      <!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ initValue[valueKey] }}</span>-->
    </el-option>
    <template v-for="item in initValue">
      <el-option
        v-if="multiple&&(value&&value.length&&value.includes(item[valueKey]))&&(dataSource.findIndex(d=>d[valueKey]===item[valueKey])<0)"
        :key="item[valueKey]"
        :label="item[labelKey]"
        :value="item[valueKey]"
      >
        <span style="float: left">{{ item[labelKey] }}</span>
        <!--                <span style="float: right; color: #8492a6; font-size: 13px">{{ item[valueKey] }}</span>-->
      </el-option>
    </template>

    <!--        <el-pagination-->
    <!--                v-if="dataSource&&dataSource.length>0"-->
    <!--                small-->
    <!--                layout="prev, pager, next"-->
    <!--                :total="500">-->
    <!--        </el-pagination>-->
  </el-select>

</template>

<script>

export default {
  name: 'SelectWithService',
  components: {},
  props: {
    placeholder:{
      type: String,
      default: '请选择'
    },
    valueKey: { // 实际key取值字段
      type: String,
      default: 'value'
    },
    labelKey: {// 显示字段
      type: String,
      default: 'label'
    },
    data: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    initValue: null,
    params: { // 接口传参
      type: Object,
      default: null
    },
    service: { // 接口
      type: Function,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSource: [],
      value: null
    }
  },
  watch: {
    params(val) { // 监听请求参数变化，若有变化，数据重新获取
      this.getDataFromService(val)
    },
    initValue(val) {
      console.log('initValue',val)
      this.initValueData(val)
    }
  },
  mounted() {
    // 如果初始化有值（回填）{key,value}形式，正常为value形式但是data为空
    // console.log(this.valueKey, this.labelKey, this.data, this.data[0].code, this.initValue)
    this.initValueData(this.initValue)
    this.getDataFromService(this.params)
  },
  methods: {
    initValueData(initValue) {
      if (!this.service) {
        this.dataSource = this.data || []
      }
      if (initValue && this.multiple) {
        this.value = []
        for (const val of initValue) {
          if ((typeof val === 'object')) {
            this.value.push(val[this.valueKey])
          } else {
            this.value.push(val)
          }
        }
      } else if (initValue && !this.multiple) {
        if ((typeof initValue === 'object')) {
          this.value = initValue[this.valueKey]
          console.log('object', initValue[this.valueKey])
        } else {
          this.value = initValue
        }
      } else if (!initValue) {// 如果清空了值(解决列表重置按钮不能清空问题)
        this.value = null
        this.$emit('change', null, null)
      }
    },
    change(e) {
      // console.log(e)
      if (this.multiple) {
        const selectData = this.dataSource.filter(d => e.includes(d[this.valueKey]))
        this.$emit('change', e, selectData)
      } else {
        const index = this.dataSource.findIndex(d => d[this.valueKey] === e)
        const selectData = this.dataSource[index]
        this.$emit('change', e, selectData)
      }
    },
    filterMethod() {

    },
    getDataFromService(params) {
      if (this.service) {
        this.service(params).then(res => {
          if (res.status === 200) {
            this.dataSource = res.content || []
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
