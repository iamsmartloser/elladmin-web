<template>
  <div v-loading="loading" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
      default: () => null
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
        const legendData = this.data && this.data.map(item => {
          return item.name
        })
        option = {
          title: {
            left: 'center',
            ...this.title
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: legendData
          },
          grid: {
            top: 40,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          calculable: true,
          series: [
            {
              name: '占比详情:',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: this.data,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        }
      }
      this.chart.setOption(option)
    }
  }
}
</script>
