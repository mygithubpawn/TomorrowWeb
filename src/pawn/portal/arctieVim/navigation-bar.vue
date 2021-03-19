<template>
  <div class="community-top-box-lun">
    <div class="community-top-box-apr">
      <div class="community-top-left-box float-left">
        <span @click="refresh" style="font-weight: 600">Tomorrow</span>
        <span @click="rivers">江湖</span>
        <span @click="navigation">导航</span>
      </div>
      <div class="community-top-right-box float-right">
        <div class="land" v-if="userInfo.id===''">
          <span @click="land">
          <i class="el-icon-user"></i>
            登陆</span>
        </div>
        <div class="user-info" v-else>
          <div class="user-info-news-box float-left">
            <el-dropdown trigger="click">
              <el-badge :value="contentNewsEr":max="99" class="item" type="warning">
                <i class="fa fa-bell-o" aria-hidden="true" @click="loadNews"></i>
              </el-badge>
              <el-dropdown-menu slot="dropdown" style="color: #4C5156">
                <div class="dropdown-news-list clear-fix">
                  <template>
                    <el-tabs>
                      <el-tab-pane>
                        <span slot="label" class="tab-span-box"><i class="fa fa-bullhorn" aria-hidden="true"></i></span>
                              <div class="ter-list-box">
                                <div style="text-align: center;" v-if="announcementNewsList.length===0">
                                      <span style="font-size: 14px;color: #6F8894">暂无公告&nbsp;!</span>
                                </div>
                                <div v-else >
                                <div class="news-content-box" v-for="(item,index) in announcementNewsList":key="index">
                                  <span class="news-comment-par" @click="detailContentAnn(item)" v-text="item.content"></span>
                                </div>
                                <div class="see-more-box">
                                  <span @click="newsList">查看全部&nbsp;&nbsp;<i class="fa fa-angle-double-right" aria-hidden="true"></i></span>
                                </div>
                                </div>
                              </div>
                      </el-tab-pane>
                      <el-tab-pane>
                        <span slot="label" class="tab-span-box"><i class="fa fa-commenting-o" aria-hidden="true"></i></span>
                        <div class="ter-list-box">
                          <div style="text-align: center;" v-if="waitNewsList.length===0">
                            <span style="font-size: 14px;color: #6F8894">暂无消息&nbsp;!</span>
                          </div>
                          <div v-else >
                          <div class="news-content-box" v-for="(item,index) in waitNewsList":key="index">
                            <span class="news-comment-par" @click="detailContent(item)" v-text="item.content"></span>
                          </div>
                            <div class="see-more-box">
                              <span @click="newsList">查看全部&nbsp;&nbsp;<i class="fa fa-angle-double-right" aria-hidden="true"></i></span>
                            </div>
                          </div>
                        </div>
                      </el-tab-pane>
<!--                       <el-tab-pane>-->
<!--                        <span slot="label" class="tab-span-box"><i class="fa fa-thumbs-up" aria-hidden="true"></i></span>-->

<!--                      </el-tab-pane>-->
                      <el-tab-pane>
                        <span slot="label" class="tab-span-box"><i class="fa fa-user-plus" aria-hidden="true"></i></span>
                        <div class="ter-list-box">
                          <div style="text-align: center;" v-if="linksList.length===0">
                            <span style="font-size: 14px;color: #6F8894">暂无友链&nbsp;!</span>
                         </div>
                          <div v-else >
                            <div class="news-content-box" v-for="(item,index) in linksList":key="index">
                              <span class="news-comment-par float-left" @click="linkUrl(item)" v-text="item.name"></span>
                              <span class="news-comment-par-inx float-left">
                                更新于:
                              </span>
                              <span class="news-comment-par-inx" v-text="formatDate(item.updateTime)"></span>
                            </div>
                            <div class="see-more-box">
                              <span @click="newsLink">查看全部&nbsp;&nbsp;<i class="fa fa-angle-double-right" aria-hidden="true"></i></span>
                            </div>
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </template>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
                  style="line-height: 50px;font-weight: 600;color: #6F8894;text-align: center">
                  <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                  <span @click="ToUserInfo">个人信息</span>
                </el-dropdown-item>
                <el-dropdown-item
                  style="line-height: 50px;font-weight: 600;color: #6F8894;text-align: center">
                  <i class="fa  fa-home " aria-hidden="true"></i>
                  <span @click="goToBlog">前往博客</span></el-dropdown-item>
                <el-dropdown-item
                  style="line-height: 50px;font-weight: 600;color: #6F8894;text-align: center">
                  <i class="fa fa-modx" aria-hidden="true"></i>
                  <span @click="bogBackground">博客后台</span>
                </el-dropdown-item>
                <el-dropdown-item
                  style="line-height: 50px;font-weight: 600;color: #6F8894;text-align: center">
                  <i class="fa fa-sign-in" aria-hidden="true"></i>
                  <span @click="Login">退出登陆</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from "../../../api/api";
  import * as dateUtils from "../../../utils/date";

  export default {
    name: "navigation-bar",
    data(){
      return{
        userInfo:{
          userName:'',
          id:'',
          roles:'',
          avatar:'',
        },
          announcementNewsList:[],
          waitNewsList:[],
        contentNewsEr:'',
        readingTen:'',
        linksList:[],
      }
    },
    methods:{
      linkUrl(item){
        let routeData=this.$router.resolve({
          path: item.url,
        });
        window.open(routeData.href, '_blank');
      },
      linksListDer(){
        api.listLinks().then(result => {
          if (result.data.code === api.success_code) {
            this.linksList = result.data.data.friendsList;
            // console.log(result.data)
          }
        });
      },
      newsList(){
        let routeData=this.$router.resolve({
          path: '/community/news/list',
        });
        window.open(routeData.href, '_blank');
      },
      detailContentAnn(item){
        this.readingTen='该公告为自动删除';
        this.$alert(item.content, {
          confirmButtonText: '已阅',
          callback: action => {
            this.$message({
              type: 'info',
              message:this.readingTen,
            });
            this.contentNewsTer();
          }
        });
      },
      formatDate(dateStr) {
        let date = new Date(dateStr);
        return dateUtils.formatDate(date, 'yyyy-MM-dd');
      },
      detailContent(item){
        api.alreadyNews(item.id).then(result=>{
          if (result.data.code==api.success_code){
            this.readingTen='已查看';
          }else {
            this.readingTen='查看异常';
          }
        });
        this.$alert(item.content,'消息详情', {
          confirmButtonText: '已阅',
          callback: action => {
            this.$message({
              type: 'info',
              message:this.readingTen,
            });
            this.contentNewsTer();
          }
        });
      },
      loadNews(){
        this.annNewsList();
        this.linksListDer();
        this.waitNewsListPar();
      },
      waitNewsListPar(){
        api.waitNews(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code) {
            this.waitNewsList=result.data.data.newsList;
          }else {
            this.$message.warning("数据加载失败，请稍后再试")
          }
        });
      },
      annNewsList(){
        api.announcementNews().then(result=>{
          if (result.data.code===api.success_code) {
            this.announcementNewsList = result.data.data.newsList;
          }else {
            this.$message.warning("数据加载失败，请稍后再试")
          }
        });
      },
      contentNewsTer(){
        api.contentNews(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.contentNewsEr=result.data.data.integerContent;
          }
        });
      },
      land(){
        let routeData=this.$router.resolve({
          path: '/login',
        });
        window.open(routeData.href, '_blank');
      },
      newsLink(){
        let routeData=this.$router.resolve({
          path: '/portal/link',
        });
        window.open(routeData.href, '_blank');
      },
      rivers(){
        this.$router.push({
          path: '/portal/community/bbs',
        })
      },
      refresh(){
        this.$router.push({
          path: '/',
        })
      },
      bogBackground(){
       let routeData=this.$router.resolve({
          path: '/index',
        })
        window.open(routeData.href, '_blank');
      },
      goToBlog(){
        let routeData=this.$router.resolve({
          path: '/portal/family/classified/articles',
        })
      window.open(routeData.href, '_blank');
      },
      ToUserInfo(){
        this.$router.push({
          path: '/portal/about',
        })
      },
      navigation(){
        window.open("https://www.csdn.net");
      },
      getUserToken() {
        api.LoginGet().then(result => {
          if (result.data.code === api.success_code) {
            this.userInfo.userName = result.data.data.userFromToken.userName;
            this.userInfo.id = result.data.data.userFromToken.id;
            this.userInfo.roles = result.data.data.userFromToken.roles;
            this.userInfo.avatar = result.data.data.userFromToken.avatar;
            this.contentNewsTer();
          }
        });
      },
      Login(){
        api.login().then(result=>{
          if (result.data.code=api.success_code){
            this.$message.success("已退出!")
            this.refresh();
          }else {
            return this.$message.error("退出异常!")
          }
        })
      },
    },
    mounted() {
      this.getUserToken();
      // 单个页面路由回到浏览器顶部
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      window.pageYOffset = 0
    }
  }
</script>

<style lang="css" scoped>
  @import "../css/rivers-and-lakes.css";
</style>
