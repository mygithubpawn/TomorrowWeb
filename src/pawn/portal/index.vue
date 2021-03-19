<template>
  <div class="blog-box">
    <div class="index-hen-er-box">
      <div id="index-top-part">
        <div id="blog-header" class="blog-header clear-fix default-border-radius">
          <div class="logo-box float-left ">
            <div class="logo" @click="userIndex">
              {{userWeb.value}}
            </div>
          </div>
          <div class="login-tips-text-box float-right" @click="domUserInfo">
            <span><i class="fa fa-align-right" style="font-size: 20px" aria-hidden="true"></i> </span>
          </div>
          <div class="navigation-box float-right">
            <router-link to="/portal/family/classified/articles">
              <span><i class="fa fa-graduation-cap" aria-hidden="true"></i>首页</span>
            </router-link>
            <el-dropdown size="medium" trigger="hover">
              <span class="el-dropdown-link">
                分类<i class="el-icon-arrow-down el-icon--right"></i>&thinsp;</span>
              <el-dropdown-menu v-if="portalList.length!==0" placement="bottom-end" slot="dropdown" style="width: 160px;max-height: 250px;overflow:auto;">
                <el-dropdown-item
                  style="font-weight: 600;color: #34495E;padding-bottom: 10px;text-align: center"
                  v-for="(portal,index) in portalList":key="index">
                  <span @click="portalName(portal)"> {{portal.name}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
                <el-dropdown-menu v-else>
                  <span style="color: #4C5156;font-size: 14px">&nbsp;&nbsp;暂无分类！&nbsp;</span>
                </el-dropdown-menu>
            </el-dropdown>
            <router-link to="/portal/link">
              <span><i class="fa fa-chain-broken" aria-hidden="true"></i>&thinsp;友链</span>
            </router-link>
              <router-link to="/portal/photo">
              <span><i class="fa fa-picture-o" aria-hidden="true"></i>&thinsp;照片墙</span>
            </router-link>

             <router-link to="/portal/timeline">
              <span><i class="fa fa-clock-o" aria-hidden="true"></i>&thinsp;时间轴</span>
            </router-link>

            <router-link to="/portal/about">
              <span><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&thinsp;关于</span>
            </router-link>
              <span @click="newsList"><i class="fa fa-bell-o" aria-hidden="true"></i>&thinsp;消息</span>
          </div>
        </div>
      </div>
    </div>
<!--    用户信息-->
    <div class="article-user-info-box">
      <el-drawer
        title=""
        size="400px"
        :visible.sync="userInfoDrawer"
        direction="rtl"
        :before-close="userInfoClose">
       <div class="routing-user-box">
         <div class="article-search-box">
           <div class="span-er">
            <i @click="searchArticle" class="fa fa-search" aria-hidden="true"></i>
           </div>
         </div>
         <div class="routing-user-par">
           <button>
             <router-link style="color: #009432" target="_blank" to="/portal/community/bbs">
             社区
             </router-link>
           </button>
           <button>
             <router-link style="color: #009432" target="_blank" to="/index">
             博客后台
             </router-link>
           </button>
           <button @click="Login">
             退出登陆
           </button>
         </div>
       </div>
        <div class="user-info-par-ti-box">
          <user-info></user-info>
        </div>
      </el-drawer>
      <div class="search-article-botton-box">
      <el-drawer
        title="搜索"
        direction="ttb"
        :visible.sync="searchArticleDrawer"
        :with-header="false">
        <div  class="search-article-top-box">
        <div class="search-article-top-par">
          <input type="text" v-model="classCapacity" @keyup.enter="carriageReturn" placeholder="请输入搜索条件">
          <i class="fa fa-search" aria-hidden="true" @click="searchCondition"></i>
        </div>
        </div>
      </el-drawer>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <index-bottom></index-bottom>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "index",
  data() {
    return {
      classCapacity: '',
      indexPath: '',
      activeIndex2: '1',
      searchArticleDrawer: false,
      userInfoDrawer: false,
      portalList: '',
      userWeb: [],
      userInfo: {
        userName: '',
        id: '',
        roles: '',
        avatar: '',
        email: '',
        sign: '',
      },
      live2dw:'hibiki',//z16
    }
  },
  methods: {
    newsList(){
      let routeData=this.$router.resolve({
        path: '/community/news/list',
      });
      window.open(routeData.href, '_blank');
    },
    Login() {
      api.login().then(result => {
        if (result.data.code = api.success_code) {
          this.$message.success("已退出!")
          this.$router.push({
            path: '/',
          })
        } else {
          return this.$message.error("退出异常!")
        }
      })
    },
    portalName(portal) {
      this.$router.push({
        path: '/portal/categories/list',
        query: {
          portalVim: portal.name,
        }
      });
    },
    portalCategoriesList() {
      api.portalCategoriesList(1, 6).then(result => {
        if (result.data.code = api.success_code) {
          this.portalList = result.data.data.categoriesList.records;
        } else {
        }
      });
    },
    carriageReturn() {
      this.searchCondition();
    },
    searchCondition() {
      if (this.classCapacity === '') {
        return this.$message.info("请输入搜索关键字...")
      }
      this.searchArticleDrawer = false;
      return this.$router.push({
        path: '/portal/class/capacity/list',
        query: {
          classCapacity: this.classCapacity,
        }
      });
      this.classCapacity = '';
    },
    searchArticle() {
      this.userInfoDrawer = false;
      this.searchArticleDrawer = true;
    },
    domUserInfo() {
      this.userInfoDrawer = true;
    },
    userInfoClose() {
      this.userInfoDrawer = false;
      this.searchArticleDrawer = false;
    },
    userIndex() {
      this.userInfoDrawer = false;
     let routeData= this.$router.resolve({
        path: '/',
      });
      window.open(routeData.href, '_blank');
    },
    userWebInfo() {
      api.webInfo().then(result => {
        if (result.data.code === api.success_code) {
          this.userWeb = result.data.data.webInfo;
        } else {
          return this.$message.error("网站数据加载失败!")
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
          this.userInfo.sign = result.data.data.userFromToken.sign;
        } else {
          return this.$message.error("用户加载失败!")
        }
      });
    },
    handleScroll() {
     let distanceTop=document.documentElement.scrollTop;
     let hin=window.innerHeight;
     // console.log("高度："+hin)
     // console.log("高度："+distanceTop)
      let indexTop=document.getElementById("index-top-part");
      let navigation=document.getElementById("navigation");
      if (this.indexPath ==='/portal/family/classified/articles' ||
        this.indexPath ==='/portal/family/classified/comment'||
        this.indexPath ==='/portal/family/classified/local'){
        indexTop.style.background='transparent';
      if (distanceTop>=hin){
      indexTop.style.background='#00202E';
      indexTop.style.boxShadow='0 14px 28px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22)';
      }else {
        indexTop.style.background='transparent';
        indexTop.style.boxShadow='';
      };
      }else {
        indexTop.style.background='#00202E';
        indexTop.style.boxShadow='0 4px 10px rgba(0,0,0,0.25), 0 2px 2px rgba(0,0,0,0.22)';
      }
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {
    $route(to, from) {
      let path=this.$route.path;
      this.indexPath=path;
      this.handleScroll();
    }
    },
  created () {
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: 'static/live2dw/',
        pluginJsPath: 'lib/',
        pluginModelPath: 'live2d-widget-model-'+this.live2dw+'/assets/',
        tagMode: false,
        debug: false,
        model: {jsonPath: '/static/live2dw/live2d-widget-model-'+this.live2dw+'/assets/'+this.live2dw+'.model.json'},
        display: {position: 'right', width: 200, height: 480,},
        mobile: {show: true},
        log: false
      })
    }, 1000)
  },
    mounted() {
      let path=this.$route.path;
      this.indexPath=path;
      this.getUserToken();
      this.portalCategoriesList();
      this.userWebInfo();
      window.addEventListener('scroll', this.handleScroll);
    },
}
</script>

<style lang="css" scoped>
  @import "./css/index-par.css";
</style>
