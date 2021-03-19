<template>
  <div class="header">
    <!-- 标题区域 -->
    <div class="community-top-box">
      <div class="community-top-left-box float-left">
        <span @click="refresh" style="font-weight: 600">Tomorrow</span>
        <span  @click="rivers">江湖</span>
        <span @click="navigation">导航</span>
        <span v-if="userInfo.roles==='role_admin'">
          <i style="font-size: 14px" @click="admin">后台</i>
        </span>
      </div>
      <div class="community-top-right-box float-right">
        <div class="land" v-if="userInfo.id===''">
          <span @click="land">
          <i class="el-icon-user"></i>登陆</span>
        </div>
        <div class="user-info" v-else>
          <div class="el-dropdown-link-img float-left">
            <el-avatar size="medium" fit="cover" :src="userInfo.avatar"></el-avatar>
          </div>
          <div class="user-info-name-box float-right">
          <el-dropdown trigger="hover">
      <span>
       {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
       </span>
            <el-dropdown-menu slot="dropdown" style="width: 140px">
              <el-dropdown-item
                style="line-height: 50px;font-weight: 600;color: #009432;text-align: center">
                <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                <span @click="ToUserInfo">个人信息</span>
              </el-dropdown-item>
              <el-dropdown-item
                style="line-height: 50px;font-weight: 600;color: #009432;text-align: center">
                <i class="fa  fa-home " aria-hidden="true"></i>
                <span @click="goToBlog">前往博客</span></el-dropdown-item>
              <el-dropdown-item
                style="line-height: 50px;font-weight: 600;color: #009432;text-align: center">
                <i class="fa fa-modx" aria-hidden="true"></i>
                <span @click="bogBackground">博客后台</span>
              </el-dropdown-item>
              <el-dropdown-item
                style="line-height: 50px;font-weight: 600;color: #009432;text-align: center">
                <i class="fa fa-sign-in" aria-hidden="true"></i>
                <span @click="Login">退出登陆</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="lnner-header">
      <div class="web-info-box">
      <div class="web-info-heading">
        <i class="fa fa-pagelines" aria-hidden="true"></i>&thinsp;Tomorrow </div>
      <div class="web-info-title">{{webInfoTitleText}}</div>
      <div class="web-info-in">{{webInfoInText}}</div>
      </div>
    </div>
    <!-- 波浪区域 -->
    <div>
      <!-- svg 形状 -->
      <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <!-- 形状容器 -->
        <defs>
          <path id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <!-- 组合形状 -->
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <div class="web-Introduction-box">
      <div class="web-about-par">
        <span @click="aboutUsTer">关于Tomorrow</span>
        <i>|</i>
        <span @click="joinUsTer">加入Tomorrow</span>
        <i>|</i>
        <span @click="contactUsTer">联系小掌柜</span>
      </div>
      <div class="web-Introduction-par">
        <span>努力的意义就是，以后的日子里，放眼望去，都是自己喜欢的人和事</span>
      </div>
    </div>
    <div class="info-admin-box">
      <el-dialog
        size="number"
        width="900px"
        title="关于我们"
        :visible.sync="aboutUs"
        :with-header="false">
        <div class="us-top-box">
          <div style="height: 30px"></div>
          <el-card class="box-card">
            <span>《Tomorrow》诞生于2021年3月（www.xuejiqiao.com），定位为个人博客。</span>
            <div class="br-box"></div>
            <span>《Tomorrow》是一个博客平台，为每一位的热爱生活道友提供一个记录日常的博客。</span>
            <div class="br-box"></div>
            <span>今日怡句：{{todayText}}</span>
            <div class="br-box"></div>
            <span>交流群：722633922</span>
          </el-card>
          <div class="br-box"></div>
        </div>
      </el-dialog>
      <el-dialog
        size="number"
        title="加入我们"
        direction="ttb"
        :visible.sync="joinUs"
        :with-header="false">
        <div class="us-top-box">
          <div style="height: 30px"></div>
          <el-card class="box-card">
            <div class="br-box"></div>
            <span>欢迎道友的入驻，加入我们，一起远航。</span>
            <div class="br-box"></div>
            <span>今日怡句：{{todayText}}</span>
            <div class="br-box"></div>
            <span>交流群：722633922</span>
          </el-card>
          <div class="br-box"></div>
        </div>
      </el-dialog>
      <el-dialog
        size="number"
        title="联系我们"
        direction="ttb"
        :visible.sync="contactUs"
        :with-header="false">
        <div class="us-top-box">
          <div style="height: 30px"></div>
          <el-card class="box-card">
            <div class="br-box"></div>
            <span>今日怡句：{{todayText}}</span>
            <div class="br-box"></div>
            <span>交流群：722633922</span>
            <div class="message-sending-box">
              <el-form label-width="70px" size="medium">
                <el-form-item label="留言内容">
                  <el-input
                    show-word-limit
                    type="textarea"
                    minlength="0" 
                    maxlength="400"
                    resize="node"
                    placeholder="留言内容..."
                    :rows="5" v-model="customerFeedback"></el-input>
                </el-form-item>
                <el-form-item class="float-right">
                  <el-button type="primary" @click="leaveMessageContent">留 言</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <div class="br-box"></div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import * as api from "../../api/api";

  export default {
    inject:['reload'],
    name: "community",
      data(){
      return{
        webInfoTitleText:'为每一个热爱学习的人提供一个属于自己的博客',
          webInfoInText:'',
        userInfo:{
          userName:'',
          id:'',
          roles:'',
          avatar:'',
          email:'',
        },
        customerFeedback:'',
        todayText:'',
        joinUs:false,
        contactUs:false,
        aboutUs:false,
      }
      },
    methods:{
      leaveMessageContent(){
        if (this.userInfo.id===''){
          return this.$message.info("登陆之后才能留言哟!");
        }
        if (this.customerFeedback===''){
          return this.$message.info("留言内容不可以为空哟!");
        }
        api.leaveMessageContent(this.userInfo.userName,this.userInfo.email,
          this.customerFeedback).then(result=>{
          this.contactUs=false;
          if (result.data.code===api.success_code){
            this.customerFeedback='';
            return  this.$notify({
              title: '留言成功', message: '留言已提交，等待小掌柜的查看！', type: 'success'
            });
          }else {
            return  this.$notify({
              title: '留言异常', message: '留言提交异常，请稍后再试！', type: 'warning'
            });
          }
        });
      },
      Today(){
        let  items=[
          "使人疲惫的不是远方的高山，而是鞋子里的一粒沙子。",
          "深海不会因为一杯沸水而加温。",
          "人生如逆旅，我亦是行人。",
          "浮生若梦，为欢几何。",
          "布衣饭菜，可乐终身。",
          "这个世界没有什么好畏惧的，反正我们只来一次。",
          "忧郁和悲伤之间的片刻欢喜，透支了我生命全部的热情储蓄。",
          "到底是年轻，不知这世间，本就是寒来暑往，日出日落，人聚了又散。",
          "世人慌慌张张，不过是碎银几两，偏偏是这碎银几两，最能解世间万种慌张",
          "因为害怕自己不是明珠而不敢刻苦琢磨。",
          "一尘不染不是没有尘埃，而是尘埃任它飞扬，我自做自己的阳光。",
        ];
        let randomItem = items[Math.floor(Math.random() * items.length)];
        this.todayText=randomItem;
      },
      joinUsTer(){
        this.joinUs=true;
      },
      contactUsTer(){
        this.contactUs=true;
      },
      aboutUsTer(){
        this.aboutUs=true;
      },
      handleClick(){
        let  items=[
          "使人疲惫的不是远方的高山，而是鞋子里的一粒沙子",
          "深海不会因为一杯沸水而加温",
          "人生如逆旅，我亦是行人",
          "到底是年轻，不知这世间，本就是寒来暑往，日出日落，人聚了又散",
          "世人慌慌张张，不过是碎银几两，偏偏是这碎银几两，最能解世间万种慌张",
          "因为害怕自己不是明珠而不敢刻苦琢磨",
          "一尘不染不是没有尘埃，而是尘埃任它飞扬，我自做自己的阳光",
        ];
        let randomItem = items[Math.floor(Math.random() * items.length)];
        this.webInfoInText=randomItem;
      },
      admin(){
        let routeData= this.$router.resolve({
          path: '/admin/box',
        });
        window.open(routeData.href, '_blank');
      },
      rivers(){
        this.$router.push({
          path: '/portal/community/bbs',
        })
      },
      refresh(){
        this.$router.go(0)
      },
      navigation(){
        window.open("https://www.csdn.net");
      },
      bogBackground(){
        let routeData=this.$router.resolve({
          path: '/index',
        });
        window.open(routeData.href, '_blank');
      },
      goToBlog(){
        let routeData=this.$router.resolve({
          path: '/portal/family/classified/articles',
        });
        window.open(routeData.href, '_blank');
      },
      ToUserInfo(){
        this.$router.push({
          path: '/portal/about',
        })
      },
      Login(){
        api.login().then(result=>{
          if (result.data.code=api.success_code){
            this.$message.success("已退出!")
            this.refresh();
          }else {
            this.$message.warning("退出异常!")
          }
        })
      },
      land(){
        if (this.userInfo.id===''){
        let routeData=this.$router.resolve({
          path: '/login',
        });
        window.open(routeData.href, '_blank');
        }else {
          this.$router.go(0)
        }
      },
      getUserToken() {
        api.LoginGet().then(result => {
          if (result.data.code === api.success_code) {
            this.userInfo.userName = result.data.data.userFromToken.userName;
            this.userInfo.id = result.data.data.userFromToken.id;
            this.userInfo.roles = result.data.data.userFromToken.roles;
            this.userInfo.avatar = result.data.data.userFromToken.avatar;
            this.userInfo.email = result.data.data.userFromToken.email;
          }
        });
      },
    },
    mounted() {
      this.handleClick();
      this.getUserToken();
      // 单个页面路由回到浏览器顶部
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      window.pageYOffset = 0
    }
  }
</script>

<style lang="css" scoped>
  @import "css/index-par.css";
  @import "css/community.css";
</style>
