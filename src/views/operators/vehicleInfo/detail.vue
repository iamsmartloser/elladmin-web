<template>
  <div v-if="rowData" class="wrap">
    <el-form>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="车身二维码">
            <!--            <canvas id="qrcode" />-->
<!--            <div id="qrCode" ref="qrCodeDiv" />-->
            <vue-qr :text="rowData.rqCode" :callback="rqCodeCallback" qid="testid"></vue-qr>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="车辆经纬度">
            {{ `${rowData.lat},${rowData.lng}` }}
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
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import QRCode from 'qrcodejs2'

import { formatDate } from '@/utils/formatDay'
import { getVehicleDetail } from '@/api/operators/vehicleInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'VehicleDetail',
  dicts: ['vehicle_type', 'vehicle_supervise_status', 'vehicle_status'],
  // component:{
  //   VueQr
  // },
  data() {
    return {
      rowData: null
    }
  },
  computed: {

  },
  created() {
    this.getDetail()
  },
  mounted() {
    console.log('dics', this.dict)
  },
  methods: {
    getDetail() {
      const id = this.$route.params && this.$route.params.id
      getVehicleDetail({ id }).then(res => {
        if (res && res.status === 200) {
          this.rowData = res.content
          this.loadQrCode(res.content && res.content.rqCode)
        } else {
          this.$message.error(res && res.message || '获取车辆信息失败')
        }
      })
    },
    loadQrCode(value) {
      if (!value) return
      // QRCode.toCanvas(document.getElementById('qrcode'), value, function (error) {
      //   if (error) console.error(error)
      //   console.log('QRCode success!');
      // })
      // new QRCode(document.getElementById('qrcode'), {
      //   text: value,
      //   width: 128,
      //   height: 128,
      //   colorDark: '#000000',
      //   colorLight: '#ffffff',
      //   correctLevel: QRCode.CorrectLevel.H,
      //   callback: (error) => {
      //     if (error) console.error(error)
      //     console.log('qrcode success!')
      //   }
      // })
      // new QRCode(this.$refs.qrCodeDiv, {
      //   text: 'https://www.baidu.com',
      //   width: 200,
      //   height: 200,
      //   colorDark: '#333333', // 二维码颜色
      //   colorLight: '#ffffff', // 二维码背景色
      //   correctLevel: QRCode.CorrectLevel.L// 容错率，L/M/H
      // })
    },
    formatDate,
    rqCodeCallback(dataUrl,id){
      console.log('rqCodeCallback',dataUrl, id)
    }
  }
}
</script>

<style scoped>
  .wrap{
    padding: 16px;
  }
</style>
