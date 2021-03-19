<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box" :class="{active:isLogin}">
        <div class="big-contain"v-if="isLogin">
          <div class="btitle">创建账户</div>
          <div class="bform-lohin">
            <input type="text" placeholder="用户名" v-model="registeredUser.userName"/>
            <div class="user-email-par-edv">
              <input style="height: 39px" type="email" placeholder="邮箱" v-model="registeredUser.email"/>
              <el-button v-if="!isCountDowning"
                         type="info" style="padding-top: 12px;padding-bottom: 12px"
                         size="mini" round
                         @click="getVerifyCode">发送验证码</el-button>
              <el-button v-else type="info" style="padding-top: 12px;padding-bottom: 12px"
                         size="mini" round
                         disabled>{{conDownText}}</el-button>
            </div>
            <input type="text" placeholder="邮箱验证码" v-model="loginInfo.email_code"/>
            <input type="password" placeholder="初始密码" v-model="registeredUser.password"/>
                        <div class="user-email-par float-left">
                          <input placeholder="验证码" v-model="loginInfo.verifyCode" @keyup.enter="registerLog">
                          <img :src="captchaPath" @click="updateVerifyCode">
                        </div>
          </div>
          <button class="bbutton-dev" @click="registerLog">注册</button>
        </div>
        <div class="big-contain" v-else>
          <div class="btitle-login">账户登录</div>
          <div class="bform">
            <input type="email" placeholder="用户名/邮箱" v-model="user.userName">
            <input type="password" placeholder="密码" v-model="user.password">
            <div class="user-email-par-dao">
              <input placeholder="验证码" v-model="loginInfo.verifyCode" @keyup.enter="login">
              <el-image v-loading="loading" :src="captchaPath" @click="updateVerifyCode">
              </el-image>
            </div>
          </div>
          <span class="retrieve-pass" @click="retrievePassword">找回密码？</span>
          <button class="bbutton" @click="login">登录</button>
        </div>
      </div>
      <div class="small-box" :class="{active:isLogin}">
        <div class="small-contain" v-if="isLogin">
          <div class="stitle">你好，朋友!</div>
          <p class="scontent">开始注册，和我们一起旅行</p>
          <button class="sbutton" @click="changeType">已有账号，前往登陆</button>
        </div>
        <div class="small-contain" v-else>
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
          <button class="sbutton" @click="changeType">没有账号，前往注册</button>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        style="background-color: #39B793"
        :close-on-click-modal="false"
        title="密码找回"
        :visible.sync="loDialogVisible"
        width="600px">
        <div>
          <retrieve-password></retrieve-password>
        </div>
        <span slot="footer" class="dialog-footer">
  </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import * as api from '../../api/api'
export default {
  name: "login-cun",
  data() {
    return {
      isLogin: false,
      loDialogVisible: false,
      loading: false,
      emailError: false,
      passwordError: false,
      existed: false,
      isCountDowning: false,
      user: {
        userName: '',
        userEmail: '',
        password: '',
      },
      registeredUser:{
        email: '',
        password: '',
        userName: ''
      },
        //邮箱验证码
      verificationCode: '',
      conDownText: '重新发送(60)',
      loginInfo: {
        verifyCode: '',
        captcha_key: '',
        email_code: '',
      },
      //图灵验证码的key
      captchaPath: '',
    }
  },
  methods: {
    retrievePassword(){
      this.loDialogVisible=true;
    },
    registerLog() {
      // console.log("用户名"+this.registeredUser.userName);
      // console.log("邮箱"+this.registeredUser.email);
      // console.log("验证码"+this.loginInfo.email_code);
      // console.log("邮箱验证码"+this.verificationCode);
      if (this.registeredUser.userName===''){
        return this.$message.error('请为自己取一个昵称吧');
      }
      if (this.registeredUser.email===''){
        return this.$message.error('邮箱不可以为空噢');
      }
      if (this.loginInfo.email_code===''){
        return this.$message.error('邮箱验证码不能为空噢');
      }
      if (this.registeredUser. password===''){
        return this.$message.error('你忘了设置密码哟');
      }
      if (this.loginInfo.verifyCode===''){
        return this.$message.error('人类验证码不能为空噢');
      }
      //发期请求
    api.registerLog(this.loginInfo.verifyCode,this.loginInfo.captcha_key
      ,this.loginInfo.email_code,this.registeredUser).then(result=>{
        // console.log(result)
      if (result.data.code=api.success_code){
        this.$notify({
          title: '注册成功', message: '欢迎加入我们', type: 'success'
        });
        this.changeType()
      }else {
        return  this.$notify({
          title: '注册异常', message:result.data.message , type: 'warning'
        });
      }
    });
    },
    getVerifyCode(){
      if (this.registeredUser.email===''){
        return this.$message.error('邮箱不可以为空');
      }
      //校验邮箱
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!reg.test(this.registeredUser.email)) {
        return this.$message.error('邮箱格式错误');
      }
      //发起请求
      api.geVerifyCode(this.registeredUser.email, 'register').then(result => {
        this.startCountDown();
        let res = result.data;
        // console.log(res);
        if (res.code === api.success_code) {
          this.verificationCode = res.data.sedEmail;
          // console.log("验证码"+this.verificationCode);
           this.$notify({
            title: '发送成功', message: '验证码已发送', type: 'success'
          });
        } else {
         return this.$notify({
            title: res.message, message: res.data.message, type: 'warning'
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
    toastE(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      })
    },
    changeType() {
      this.isLogin = !this.isLogin;
      this.user.userName = '';
      this.user.userEmail = '';
      this.user.password = '';
      this.registeredUser.password = '';
      this.registeredUser.userName = '';
      this.registeredUser.email = '';
      this.loginInfo.email_code = '';
      this.loginInfo.verifyCode = '';
      this.updateVerifyCode();
    },
    login() {
      //发起登陆
      //检查数据
      if (this.user.userName === '') {
        return this.toastE("账号不能为空");
      }
      if (this.user.password === '') {
        return this.toastE("密码不能为空");
      }
      if (this.loginInfo.verifyCode === '') {
        return this.toastE("验证码不能为空");
      }
      //向服务器提交数据
      //返回结果
      api.userSign(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.user).then(result => {
        // console.log(result);
        //判断结果
        let data = result.data;
        //提示信息
        if (data.code == api.success_code) {
          this.$message.success(data.message)
          //判断角色并跳转到相应页面
          this.$router.push({path: '/index'});
        } else {
          //更新验证码
          this.updateVerifyCode();
          this.user.password='';
          this.loginInfo.verifyCode='';
          this.toastE(data.message);
        }
      })
    },
    updateVerifyCode() {
      this.loading=true;
      this.captchaPath = api.http_uer+'/user/captcha?captcha_key=' + this.loginInfo.captcha_key + "&random" + Date.parse(new Date());
      this.loading=false;
    },
  },
  mounted() {
    //TODO:检查登录是否有效
    //如果已经登录，跳转到对应的页面
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode();
  },
}
</script>

<style lang="css" scoped>
  @import "css/login.css";
</style>
