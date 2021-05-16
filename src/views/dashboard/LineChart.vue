<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const colors = ['#FF005A', '#3888fa']
export default {
  mixins: [resize],
  props: {
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
    autoResize: {
      type: Boolean,
      default: true
    },
    title: {
      type: Object,
      default: () => null
    },
    data: {
      type: Object,
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
      this.setDefaultOption(this.option, val)
    },
    option(val) {
      this.setDefaultOption(val, this, data)
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setDefaultOption(this.option, this.data)
    },
    setDefaultOption(op, data) {
      // 如果传了option就按option来，没传就按默认的来
      let option = null
      if ((op && JSON.stringify(op) !== '{}')) {
        option = op
      } else {
        if (!data || JSON.stringify(data) === '{}') {
          return
        }
        const legendData = []
        let xAxisData = null
        Object.keys(data).map((key, index) => {
          legendData.push(data[key].name)
          if (index === 0) {
            xAxisData = data[key].values.map(val => val.x)
          }
        })

        option = {
          title: {
            left: 'center',
            ...this.title
          },
          xAxis: {
            data: xAxisData,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            top: 40,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            left: 'left',
            data: legendData
          },
          series: Object.keys(data).map((key, index) => {
            return {
              name: data[key].name,
              itemStyle: {
                normal: {
                  color: colors[index] || null,
                  lineStyle: {
                    color: colors[index] || null,
                    width: 2
                  }
                }
              },
              smooth: true,
              type: 'line',
              data: data[key].values.map(obj => obj.y),
              animationDuration: 2000 + index * 100,
              animationEasing: (index / 2) ? 'cubicInOut' : 'quadraticOut'
            }
          })

        }
      }
      this.chart.setOption(option)
    },
    setOptions({ expectedData, actualData } = {}) {

      // this.chart.setOption()
    }
  }
}
</script>
