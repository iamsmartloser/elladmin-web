<template>
  <div class="wrap">
    <el-form>
      <el-row>
        <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
          <el-form-item label="">
            <Map style="width: 100%;height: 300px;display: inline-block" @ready="ready" />
          </el-form-item>
        </el-col>
        <el-col v-if="rowData" :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
          <el-form-item label="">
            <vue-qr :text="rowData.rqCode" :callback="rqCodeCallback" qid="rqCode" :size="250" style="margin-top: 20px" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-form>
      <el-row v-if="rowData">

        <!--        <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">-->
        <!--          <el-form-item label="车辆位置">-->
        <!--            <Map @ready="ready" style="width: 100%;height: 300px;display: inline-block"/>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆经纬度">
            {{ rowData.pintGCJ02 }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆编码">
            {{ rowData.carNumber }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆品牌">
            {{ rowData.brandName }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="所属运营商">
            {{ rowData.operatorName }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="投车计划ID">
            {{ rowData.vehicleLaunchesId }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆类型">
            {{ dict.label.vehicle_type[rowData.type.toString] }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆状态">
            {{ dict.label.vehicle_status[rowData.status.toString()] }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆举报状态">
            {{ dict.label.vehicle_supervise_status[rowData.reportStatus.toString()] }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆其它状态说明">
            {{ rowData.statusExplain }}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="最后上报时间">
            {{ formatDate(rowData.lastReportTime) }}
          </el-form-item>
        </el-col>
<!--        <el-button @click="getDetail()">test</el-button>-->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDay'
import { getVehicleDetail } from '@/api/operators/vehicleInfo'
import { mapGetters } from 'vuex'
import Map from '@/components/Map/index'
import map_mixins from '@/mixins/map'

export default {
  name: 'VehicleDetail',
  dicts: ['vehicle_type', 'vehicle_supervise_status', 'vehicle_status'],
  components: {
    Map
  },
  mixins: [map_mixins],
  data() {
    return {
      rowData: null
    }
  },
  methods: {
    ready(map) {
      this.map = map
      console.log('ready:', map)
      this.getDetail()
    },
    getDetail() {
      const id = this.$route.params && this.$route.params.id
      getVehicleDetail({ id }).then(res => {
        if (res && res.status === 200) {
          this.rowData = res.content
          // 加载二维码
          this.loadQrCode(res.content && res.content.rqCode)
          // 加载车辆位置
          const vehicleLocation = res.content.pintBD09.split(',')
          console.log('位置', vehicleLocation)
          const p = { lng: parseFloat(vehicleLocation[0]), lat: parseFloat(vehicleLocation[1]) }
          console.log('位置p', p)
          this.marker = this.drawMarker(p, { setViewPort: true, icon: {
            url: require('@/assets/images/bikeLogo.png'),
            size: [40, 40],
            imageSize: [40, 40],
            anchor: [0, 0]
          }})
        } else {
          this.$message.error(res && res.message || '获取车辆信息失败')
        }
      })
    },
    loadQrCode(value) {
      if (!value) return
    },
    formatDate,
    rqCodeCallback(dataUrl, id) {
      // console.log('rqCodeCallback', dataUrl, id)
    }
  }
}
</script>

<style scoped>
  .wrap{
    padding: 16px;
  }
</style>
