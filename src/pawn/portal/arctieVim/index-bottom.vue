<template>
  <div class="bottom-prompt clear-fix" id="bottom-par">
    <div class="bottom-prompt-log">
      <div class="bottom-box">
        <span @click="aboutUsTer">关于Tomorrow</span>
        <i>|</i>
        <span @click="joinUsTer">加入Tomorrow</span>
        <i>|</i>
        <span @click="contactUsTer">联系小掌柜</span>
        <div class="bottom-prompt-bottom">
          <span>努力的意义就是，以后的日子里，放眼望去，都是自己喜欢的人和事</span>
        </div>
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
    import * as api from "../../../api/api";
    export default {
        name: "index-bottom",
      data(){
        return{
          customerFeedback:'',
          CommendListPor: [],
          userInfo: {
            userName: '',
            id: '',
            roles: '',
            avatar: '',
            email: '',
            sign: '',
          },
          todayText:'',
          aboutUs:false,
          joinUs:false,
          contactUs:false,
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
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
              this.userInfo.roles = result.data.data.userFromToken.roles;
              this.userInfo.avatar = result.data.data.userFromToken.avatar;
              this.userInfo.email = result.data.data.userFromToken.email;
            } else {
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
        CommendList() {
          api.CommendList(4).then(result => {
            if (result.data.code === api.success_code) {
              this.CommendListPor = result.data.data.selectMapCommunity.records;
            } else {
              return this.$message.error("文章推荐加载失败!")
            }
          })
        },
      },
      mounted() {
        this.getUserToken();
        this.CommendList();
        this.Today();
      }
    }
</script>

<style lang="css" scoped>
  @import "../css/index-par.css";
</style>
