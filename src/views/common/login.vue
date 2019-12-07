<template>
  <div class="site-wrapper site-page--login">
    <div class="site-header__wrapper">
      <img src="~@/assets/img/logo.png" class="logo_img" style="width:250px">
    </div>
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
        </div>
        <div class="login-main">
          <div class="login-img"><img src="~@/assets/img/login_img.png"/></div>
          <div class="login-text">
            <h3 class="login-title">省税一哥后台管理</h3>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
              <el-form-item prop="username">
                <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" placeholder="验证码">
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px">
                <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="site-footer__wrapper">
      <p>©2018 北京解税宝科技有限公司版权所有，并保留所有权利</p>
      <p> 京ICP备 16029821号-1</p>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          username: '',
          password: '',
          uuid: '',
          captcha: '',
          loginType:1,
        },
        dataRule: {
          username: [
            { required: true, message: '用户名/手机号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha();
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.username,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token);
                this.$router.replace({ name: 'home' });
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    //background-color: rgba(19,181,177,1);
    overflow: hidden;
    .site-header__wrapper{
      width: 100%;
      height: 80px;
      background: #fff;
      line-height:70px;
      padding: 0 200px;
      span{
        color: rgba(19, 181, 177, 1);
        font-weight: bold;
      }
      img.logo_img{
        width: 135px;
        margin-right: 10px;
      }
      img.logo_title{
        height: 20px;
        border-left: 1px solid rgba(238, 238, 238, 1);
        padding-left: 10px;
      }
    }
    .site-footer__wrapper{
      background: rgba(48, 48, 48, 1);
      width:100%;
      height: 80px;
      position: fixed;
      bottom: 0;
      text-align: center;
      color: rgba(112, 118, 130, 1);
      padding-top: 5px;
    }
    .site-content__wrapper:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.png);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      min-height: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color:transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      left:0;
      bottom:0;
      margin: auto;
      padding:30px 10px;
      width:650px;
      height: 340px;
      background-color: #fff;
      border-radius:20px;
    }
    .login-text{
      display: inline-block;
      width:300px
    }
    .login-img{
      /*background: #DCF8FF;*/
      text-align: center;
      display: inline-block;
      width: 260px;
      margin-left: 20px;
      margin-right: 30px;
      vertical-align: top;
    }
    .login-img>img{
      width: 100%;
    }
    .login-title {
      font-size: 16px;
      margin: 8px 0 1rem 0;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 5px;
      background:rgba(19,181,177,1);
    }
  }
  .tab_btn{
    margin: 5px 0;
    text-align: center;
    color: #13b5b1;
    text-decoration: underline;
    cursor: default;
  }
  .smscode{
    position: relative;
  }
  .smscode button{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 4px 4px 0;
    color: rgba(249, 159, 18, 1);
  }
  .el-input__suffix{
    display: none !important;
  }
</style>
