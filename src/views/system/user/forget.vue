<template>
  <div class="wrap">
    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="确认账号" />
      <el-step title="安全验证" />
      <el-step title="重置密码" />
    </el-steps>
    <!--  确认账号  -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="0px" class="form-wrap">
      <el-form-item
        v-show="active===0"
        prop="phone"
      >
        <el-input v-model="form.phone" maxlength="11" placeholder="请填写注册的手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <!--   安全验证   -->
      <el-form-item v-show="active===1">
        <div class="title">为了保护账号安全，需要验证手机有效性</div>
        <div class="sentence">点击以下按钮，将会发送验证码到您的手机</div>
        <div class="sentence">{{ hideStr(form.phone,3,4) }}</div>
      </el-form-item>
      <el-form-item
        v-show="active===1"
        prop="smsCode"
      >
        <el-input v-model.number="form.smsCode" maxlength="20" placeholder="手机验证码">
          <svg-icon v-if="!sendingSMS" slot="prefix" icon-class="security" class="el-input__icon input-icon" />
          <template v-if="sendingSMS" slot="append">{{ time }}s</template>
        </el-input>
      </el-form-item>
      <!--   重置密码   -->
      <el-form-item
        v-show="active===2"
        prop="password"
      >
        <el-input v-model="form.password" maxlength="20" placeholder="请输入新密码">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item
        v-show="active===2"
        prop="password2"
      >
        <el-input v-model="form.password2" maxlength="20" placeholder="请重新输入新密码">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-alert
        v-show="active===3"
        title="修改成功!"
        class="sentence"
        type="success"
        show-icon
        :closable="false"
      />
      <el-form-item>
        <el-button v-show="active===0" :loading="loading" type="primary" class="operator-button" @click.native.prevent="confirmAccount()">下一步</el-button>
        <el-button v-show="active===1&&!sendingSMS" :loading="loading" type="primary" class="operator-button" @click.native.prevent="sendSMS()">发送短信</el-button>
        <el-button v-show="active===1&&sendingSMS" :loading="loading" type="primary" class="operator-button" @click.native.prevent="validateSMS()">确定</el-button>
        <el-button v-show="active===2" type="primary" :loading="loading" class="operator-button" @click.native.prevent="resetPassword()">重置密码</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { isvalidPhone } from '@/utils/validate'
import { hideStr } from '@/utils/utils'
export default {
  name: 'Forget',
  data() {
    // 验证手机号
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写手机号'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (this.form.password2 && (this.form.password !== this.form.password2)) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        if (this.$refs.formRef.password2) {
          this.$refs.formRef.validateField('password2')
        }
        callback()
      }
    }
    // 验证密码
    const validPassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (this.form.password && (this.form.password !== this.form.password2)) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        if (this.$refs.formRef.password) {
          this.$refs.formRef.validateField('password')
        }
        callback()
      }
    }
    return {
      active: 0,
      time: 60,
      timer: null,
      sendingSMS: false,
      loading: false,
      form: {},
      rules: {
        phone: [
          { required: true, validator: validPhone }
        ],
        password: [{ required: true, triangle: 'blur', validator: validPassword }],
        password2: [{ required: true, triangle: 'blur', validator: validPassword2 }]
      }
    }
  },
  methods: {
    hideStr,
    confirmAccount() {
      const _this = this
      this.$refs.formRef.validateField('phone', errorMessage => {
        if (!errorMessage) {
          _this.active = 1
        }
      })
    },
    // 发送短信验证码
    sendSMS() {
      // 请求短信验证接口，成功后开始计时
      this.loading = true
      this.sendingSMS = true
      const _this = this
      this.timer = setInterval(() => {
        _this.loading = false
        _this.time--
        if (_this.time === -1) {
          clearInterval(_this.timer)
          _this.sendingSMS = false
          _this.time = 60
        }
      }, 1000)
    },
    validateSMS() {
      this.loading = true
      const smsCode = this.form.smsCode
      this.active = 2
      this.loading = false
    },
    // 重置密码
    resetPassword() {
      this.loading = true
      // 请求重置密码接口
      const _this = this
      this.$refs.formRef.validateField('password', errorMessage => {
        if (!errorMessage) {
          _this.active = 3
          this.loading = false
        }
      })
    }

  }
}
</script>

<style scoped>
  .wrap {
    .login {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .form-wrap {
    width: 385px;
    margin: 30px auto;
  }
  .title {
    margin: 15px 0;
    font-size: 20px;
    color: #707070;
  }
  .sentence{
    margin: 15px 0;
    /*font-size: 20px;*/
    color: #aaaaaa;
  }
  .operator-button{
    width: 100%;
    margin: 0;
  }

</style>
