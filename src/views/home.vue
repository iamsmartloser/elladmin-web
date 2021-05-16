<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!--      <github-corner class="github-corner" />-->
      <panel-group :data="totalData"/>

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :data="superviseInspectionData" :title="{text:'巡检举报日统计'}"/>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <pie-chart :data="inspectionData" :title="{text:'今日巡检记录'}"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <pie-chart :data="superviseData" :title="{text:'本周举报类型'}"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
            <bar-chart :data="superviseGroupData" :title="{text:'本周举报类型'}"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RadarChart from '@/components/Echarts/RadarChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import { getTotal, getInspection, getSupervise, getSuperviseGroup, getSuperviseInspection } from '@/api/statistics/statistics'
import { mapGetters } from 'vuex'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RadarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      totalData: {},// 数量统计
      inspectionData: null,// 今日巡检
      superviseData: null,// 本周举报
      superviseGroupData: null,// 举报分组统计
      superviseInspectionData: null// 举报已处理、巡检记录列表
    }
  },
  computed: {
    ...mapGetters([
      'city',
      'user'
    ])
  },
  watch: {
    city(val) {
      // 刷新
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const areaCode = this.city && this.city.areaCode
      if (!areaCode) {
        return
      }
      // 获取数量统计
      getTotal({ areaCode }).then(res => {
        if (res && res.status === 200) {
          this.totalData = res.content || {}
        }
      })
      // 获取巡检占比统计
      getInspection({ areaCode, cycle: 1 }).then(res => {
        if (res && res.status === 200) {
          this.inspectionData = res.content || {}
        }
      })
      // 获取举报类型占比统计
      getSupervise({ areaCode, cycle: 1}).then(res => {
        if (res && res.status === 200) {
          this.superviseData = res.content || {}
        }
      })
      // 举报分组统计
      getSuperviseGroup({ areaCode, cycle: 2 }).then(res => {
        if (res && res.status === 200) {
          this.superviseGroupData = res.content || {}
        }
      })
      // 举报已处理、巡检记录列表
      getSuperviseInspection({ areaCode, cycle: 2 }).then(res => {
        if (res && res.status === 200&&res.content) {
          // const result=[{name:'举报已处理',value:[]},{name:'巡检记录数',value:[]}]
          // this.superviseInspectionData = res.content.map((item)=>{
          //   result[0].value.push(item.superviseHandle)
          //   result[1].value.push(item.inspection)
          // })
          // this.superviseInspectionData = result
          this.superviseInspectionData = res.content || null
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
