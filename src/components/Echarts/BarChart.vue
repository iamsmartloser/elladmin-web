<template>
  <div v-loading="loading" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    title: {
      type: Object,
      default: () => null
    },
    data: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data(val) {
      this.setDefaultOption()
    },
    option(val) {
      this.setDefaultOption()
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // this.chart.setOption(this.getDefaultOption())
      this.setDefaultOption()
    },
    setDefaultOption() {
      // 如果传了option就按option来，没传就按默认的来
      let option = null
      if ((this.option && JSON.stringify(this.option) !== '{}')) {
        option = this.option
      } else {
        if (!this.data) {
          return
        }
        const legendData = []
        const rows = {}
        this.data.map(item => {
          legendData.push(item.name||'')
          if(item.values){
            item.values.map(val=>{
              if(!rows[val.group.toString()]){
                rows[val.group.toString()]=[]
                rows[val.group.toString()].push(val)
              }else {
                rows[val.group.toString()].push(val)
              }
            })
          }
        })
        option = {
          title: {
            left: 'center',
            ...this.title
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['0', '1']
          },
          grid: {
            top: 40,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: legendData,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: Object.keys(rows).map(key=>{
            console.log(rows[key].map(v=>v.value))
            return {
              name: rows[key][0].groupName,
              type: 'bar',
              stack: 'vistors',
              barWidth: '100',
              data: rows[key].map(v=>v.value),
              animationDuration
            }
          })
        }
      }
      this.chart.setOption(option)
    }
  }
}
</script>
