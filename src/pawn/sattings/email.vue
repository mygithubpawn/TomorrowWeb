<template>
  <div class="settings-email-box">
    <div class="email-info-par">
      <div class="pass-tittle">
        <span>邮箱修改</span>
      </div>
      <div style="width: 460px;margin: 0 auto">
    <el-form label-width="100px" size="medium" :inline="true">
      <el-form-item label="邮箱" required>
        <el-input v-model="newEmail" placeholder="更新的邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isCountDowning" type="primary" @click="geVerifyCode">获取验证码</el-button>
        <el-button v-else type="primary" disabled>{{conDownText}}</el-button>
      </el-form-item>
      <br/>
      <el-form-item label="验证码" required>
        <el-input v-model="verifyCode" placeholder="验证码"></el-input>
      </el-form-item>
      <br/>
      <el-form-item class="email-button">
        <el-button @click="emailSearch">重置</el-button>
        <el-button type="primary" @click="updateEmailAddress">修改</el-button>
      </el-form-item>
    </el-form>
      </div>
  </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "email",
  data() {
    return {
      newEmail: '',
      verifyCode: '',
      verificationCode: '',
      conDownText: '重新发送(60)',
      isCountDowning: false,
      userInfo:{
        id:'',
        userName:'',
        email:'',
      },
    }
  },
  methods: {
    emailReminder(){
      api.emailReminder(this.userInfo.email,this.userInfo.userName).then(result=>{
        if (result.data.code===api.success_code) {
          this.$notify({
            title: '邮件发送成功', message: '已发送邮件提醒道友', type: 'success'
          });
        }else {
          this.$notify({
            title: '邮件发送异常', message: '邮件发送异常，请稍后再试', type: 'warning'
          });
        }
      });
    },
    getUserToken() {
      api.LoginGet().then(result => {
        if (result.data.code === api.success_code) {
          this.userInfo.userName = result.data.data.userFromToken.userName;
          this.userInfo.id = result.data.data.userFromToken.id;
          this.userInfo.email = result.data.data.userFromToken.email;
        } else {
          return this.$message.error("用户加载失败!")
        }
      });
    },
    updateEmailAddress() {
      //类容校验
      if (this.newEmail === '') {
        return this.$message.error('邮箱不可以为空');
      }
      if (this.verifyCode === '') {
        return this.$message.error('验证码不可以为空');
      }
      //发起请求
      api.updateEmailAddress(this.newEmail, this.verifyCode).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.$notify({
            title: '邮箱修改成功', message: '邮箱已修改，请牢记您的邮箱噢', type: 'success'
          });
          this.emailReminder();
          this.emailSearch();
        } else {
            this.$notify({
              title: '邮箱修改异常', message: '邮箱修改异常，请稍后再试!', type: 'warning'
            });
          this.verifyCode = '';
        }
      });
      //返回结果
    },
    emailSearch() {
      this.verifyCode = '';
      this.newEmail = '';
    },
    geVerifyCode() {
      if (this.newEmail === '') {
        return this.$message.error('邮箱不可以为空');
      }
      //校验邮箱
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!reg.test(this.newEmail)) {
        return this.$message.error('邮箱格式错误');
      }
      //发起请求
      api.geVerifyCode(this.newEmail, 'update').then(result => {
        this.startCountDown();
        let res = result.data;
        // console.log(res);
        if (res.code === api.success_code) {
          this.verificationCode = res.data.sedEmail;
          this.$notify({
            title: '发送成功', message: '验证码已发送', type: 'success'
          });
        } else {
          this.$notify({
            title: '发送异常', message: '验证码发送异常，请稍后再试!', type: 'warning'
          });
        }
      });
    },
    startCountDown() {
      //取消禁止按钮，开始倒计时
      let time = 60;
      let that = this;
      this.isCountDowning = true;
      let interval = setInterval(function () {
        //执行倒计时
        time--;
        if (time <= 0) {
          that.isCountDowning = false;
          clearInterval(interval);
        }
        that.conDownText = '重新发送(' + time + ')';
      }, 1000);
    },
  },
mounted() {
    this.getUserToken();
}
}
</script>

<style scoped>
  .pass-tittle{
    font-size: 18px;
    color: #009432;
    text-align: center;
    font-weight: 600;
    padding-top: 30px;
    margin: 0 20px 40px 20px;
  }
  .email-info-par{
    width: 600px;
    height: 400px;
    background-color: #EFF3F5;
    margin:  0 auto;
    border-radius: 4px;
  }
  .email-button {
    margin-left: 120px;
  }
</style>
