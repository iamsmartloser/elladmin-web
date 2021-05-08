<template>
    <el-select v-model="value" placeholder="请选择" :multiple="multiple" @change="change" filterable
               @filter-method="filterMethod">
        <el-option
                v-for="item in dataSource"
                :key="item[valueKey]"
                :label="item[labelKey]"
                :value="item[valueKey]">
            <span style="float: left">{{ item[labelKey] }}</span>
<!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ item[valueKey] }}</span>-->
        </el-option>
        <el-option
                v-if="!multiple&&(initValue[valueKey]===value)&&(dataSource.findIndex(d=>d[valueKey]===initValue[valueKey])<0)"
                :key="initValue[valueKey]"
                :label="initValue[labelKey]"
                :value="initValue[valueKey]">
            <span style="float: left">{{ initValue[labelKey] }}</span>
<!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ initValue[valueKey] }}</span>-->
        </el-option>
        <template v-for="item in initValue">
            <el-option
                    v-if="multiple&&(value&&value.length&&value.includes(item[valueKey]))&&(dataSource.findIndex(d=>d[valueKey]===item[valueKey])<0)"
                    :key="item[valueKey]"
                    :label="item[labelKey]"
                    :value="item[valueKey]">
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
        props: {
            valueKey: {
                type: String,
                default: 'value'
            },
            labelKey: {
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
            service: {
                type: Function
            }
        },
        components: {},
        data() {
            return {
                dataSource: [],
                value: null
            }
        },
        mounted() {
            // 如果初始化有值（回填）{key,value}形式，正常为value形式但是data为空
            // console.log(this.valueKey, this.labelKey, this.data, this.data[0].code, this.initValue)
            this.dataSource = this.data || [];
            if (this.initValue && this.multiple) {
                this.value = []
                for (let val of this.initValue) {
                    if ((typeof val === 'object')) {
                        this.value.push(val[this.valueKey])
                    } else {
                        this.value.push(val)
                    }
                }
            } else if (this.initValue && !this.multiple) {
                if ((typeof this.initValue === 'object')) {
                    this.value = this.initValue[this.valueKey]
                    console.log('object', this.initValue[this.valueKey])
                } else {
                    this.value = this.initValue
                }
            }

            if (this.service) {
                this.service().then(res => {
                    if(res.status===200){
                        this.dataSource = res.content || [];
                    }
                })
            }

        },
        methods: {
            change(e) {
                console.log(e)
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

            }
        }
    }
</script>

<style>
</style>
