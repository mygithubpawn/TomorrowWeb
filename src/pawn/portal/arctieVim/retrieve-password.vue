<template>
    <div class="pass-hiv-box">
    <div class="pass-form-box">
      <el-form  label-width="80px" size="medium">
        <div class="pass-er-box">
        <el-form-item label="邮箱" required>
          <el-input v-model="info.email" placeholder="绑定的邮箱"></el-input>
            <el-button v-if="!isCountDowning" type="primary" @click="geVerifyCode">获取验证码</el-button>
            <el-button v-else type="primary" disabled>{{conDownText}}</el-button>
        </el-form-item>
        </div>
        <el-form-item label="验证码" required>
          <el-input v-model="verificationCode" placeholder="邮箱验证码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input type="password" v-model="info.password" placeholder="新的密码"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="updatePass('ruleForm')">提交</el-button>
      </el-form-item>
      </el-form>
    </div>
    </div>
</template>

<script>
    import * as api from "../../../api/api";

    export default {
        name: "retrieve-password",
      data(){
          return{
            conDownText: '重新发送(60)',
            isCountDowning: false,
            verificationCode:'',
            info:{
              email:'',
              password:'',
            },
            userInfo:{
              id:'',
              userName:'',
              email:'',
            },
          }
      },
      methods:{
        passwordReminder(){
          api.passwordReminder(this.userInfo.email,this.userInfo.userName).then(result=>{
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
        refresh() {
          this.$router.push({
            path: '/',
          })
        },
        Login(){
          api.login().then(result=>{
            if (result.data.code=api.success_code){
              this.refresh();
            }
          })
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
          remove(){
            this.info.email='';
            this.info.password='';
            this.verificationCode='';
          },
        updatePass(){
          if (this.info.email === ''){
            return this.$message.error('邮箱不可以为空哟');
          };
          if (this.info.password === ''){
            return this.$message.error('密码不可以为空哟');
          };
          if (this.verificationCode === ''){
            return this.$message.error('验证码不可以为空哟');
          };
        api.updatePassword(this.verificationCode,this.info).then(result=>{
          if (result.data.code===api.success_code){
            this.$notify({
              title: '密码更新成功', message: '密码已更新,请牢记您的新密码噢', type: 'success'
            });
            this.Login();
            this.passwordReminder();
          return this.remove();
          }else {
            this.$notify({
              title: result.data.message, message: '密码跟新异常，请稍后再试，或联系管理员', type: 'warning'
            });
            this.info.verificationCode='';
            this.info.password='';
          }
        });
        },
        geVerifyCode() {
          if (this.info.email === '') {
            return this.$message.error('邮箱不可以为空哟');
          }
          //校验邮箱
          let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
          if (!reg.test(this.info.email)) {
            return this.$message.error('检查一下邮箱格式吧');
          }
          //发起请求
          api.geVerifyCode(this.info.email, 'forget').then(result => {
            this.startCountDown();
            let res = result.data;
            // console.log(res);
            if (res.code === api.success_code) {
              this.$notify({
                title: '发送成功', message: '验证码已发送', type: 'success'
              });
            } else {
              this.$notify({
                title: res.message, message: '验证码发送异常，请稍后再试!', type: 'warning'
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
  .pass-er-box >>> .el-input{
    /*float: left;*/
    width: 60%;
  }
  .pass-form-box{
    margin: 0 auto;
    width: 70%;
  }
  .pass-hiv-box{
    margin: 0 auto;
  }
</style>
