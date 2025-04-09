<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <image style="width: 100rpx;height: 100rpx;" :src="globalConfig.appInfo.logo" mode="widthFix">
      </image>
      <text class="title">华云兴综合管理智能云</text>
    </view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入手机号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入短信验证码" maxlength="6" />
        <view class="login-code"> 
          <button @click="getSmsCode" :disabled="smsCooldown" class="sms-btn">{{ smsButtonText }}</button>
        </view>
      </view>
      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="xieyi text-center">
        <text class="text-grey1">登录即代表同意</text>
        <text @click="handleUserAgrement" class="text-blue">《用户协议》</text>
        <text @click="handlePrivacy" class="text-blue">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<script>
  import { sendSmsCode } from '@/api/login_msg.js'

  export default {
    data() {
      return {
        smsCooldown: false,  // 判断是否在倒计时中
        smsButtonText: '获取验证码',  // 按钮文字
        globalConfig: getApp().globalData.config,
        loginForm: {
          phonenumber: "admin",  // 手机号
          code: "",  // 短信验证码
        }
      }
    },
    methods: {
      // 隐私协议
      handlePrivacy() {
        let site = this.globalConfig.appInfo.agreements[0]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 用户协议
      handleUserAgrement() {
        let site = this.globalConfig.appInfo.agreements[1]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 获取短信验证码
      getSmsCode() {
        if (this.smsCooldown) return;
        sendSmsCode(this.loginForm.username).then(res => {
          if (res.success) {
            this.startSmsCooldown();
          } else {
            this.$modal.msgError(res.message || '获取验证码失败');
          }
        });
      },
      // 开始短信验证码倒计时
      startSmsCooldown() {
        this.smsCooldown = true;
        let countdown = 60;
        const timer = setInterval(() => {
          if (countdown === 0) {
            clearInterval(timer);
            this.smsCooldown = false;
            this.smsButtonText = '获取验证码';
          } else {
            this.smsButtonText = `${countdown}秒后重试`;
            countdown--;
          }
        }, 1000);
      },
      // 登录方法
      async handleLogin() {
        if (this.loginForm.username === "") {
          this.$modal.msgError("请输入您的账号")
        } else if (this.loginForm.code === "") {
          this.$modal.msgError("请输入验证码")
        } else {
          this.$modal.loading("登录中，请耐心等待...")
          this.smsLogin()
        }
      },
      // 短信验证码登录
      async smsLogin() {
        const params = {
          username: this.loginForm.username,
          code: this.loginForm.code,
        };
        this.$store.dispatch('LoginWithSms', params).then(() => {
          this.$modal.closeLoading()
          this.loginSuccess()
        }).catch(() => {
          this.$modal.msgError('验证码错误或已过期');
        })
      },
      // 登录成功后，处理函数
      loginSuccess(result) {
        this.$store.dispatch('GetInfo').then(res => {
          this.$tab.reLaunch('/pages/index')
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #ffffff;
  }

  .normal-login-container {
    width: 100%;

    .logo-content {
      width: 100%;
      font-size: 21px;
      text-align: center;
      padding-top: 15%;

      image {
        border-radius: 4px;
      }

      .title {
        margin-left: 10px;
      }
    }

    .login-form-content {
      text-align: center;
      margin: 20px auto;
      margin-top: 15%;
      width: 80%;

      .input-item {
        margin: 20px auto;
        background-color: #f5f6f7;
        height: 45px;
        border-radius: 20px;

        .icon {
          font-size: 38rpx;
          margin-left: 10px;
          color: #999;
        }

        .input {
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          padding-left: 15px;
        }

      }

      .login-btn {
        margin-top: 40px;
        height: 45px;
      }

      .sms-btn {
        background-color: #5cb85c;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
      }

      .reg {
        margin-top: 15px;
      }

      .xieyi {
        color: #333;
        margin-top: 20px;
      }
    }
  }
</style>
