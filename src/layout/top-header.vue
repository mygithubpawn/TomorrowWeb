<template>
  <!--  顶部-->
  <div class="clear-fix">
    <div class="header-left-box">
      <span class="top-Home-box" @click="backToHome">
      {{userWeb.value}}
      </span>
      <div class="hov-user-info float-right">
        <div class="el-dropdown-link-img float-left">
        <el-avatar  size="medium" fit="cover" :src="userInfo.avatar"></el-avatar>
        </div>
          <div class="el-dropdown-info float-right">
        <el-dropdown trigger="hover">
  <span class="el-dropdown-link">
    {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
          <el-dropdown-menu slot="dropdown" style="width: 140px">
            <el-dropdown-item
              style="line-height: 50px;font-weight: 600;color: #34495E;text-align: center">
              <i class="fa  fa-home " aria-hidden="true"></i>
              <span @click="classified">前往博客</span></el-dropdown-item>
             <el-dropdown-item
              style="line-height: 50px;font-weight: 600;color: #34495E;text-align: center">
               <i class="fa fa-graduation-cap" aria-hidden="true"></i>
               <span @click="family">个人信息</span>
               </el-dropdown-item>
             <el-dropdown-item
              style="line-height: 50px;font-weight: 600;color: #34495E;text-align: center">
               <i class="fa fa-sign-in" aria-hidden="true"></i>
               <span @click="texter">退出登陆</span>
               </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          </div>

      </div>
    </div>
    <div class="header-right-box">
    </div>
  </div>
</template>

<script>
  import * as api from '../api/api'

  export default {
    name: "top-header",
    data() {
      return {
        userWeb: [],
        userInfo:{
          userName:'',
          id:'',
          roles:'',
          avatar:'',
          email:'',
          sign:'',
        },
      }
    },
    methods: {
      backToHome(){
        this.$router.push({
          path: '/',
        })
      },
      userInfoPar(){
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
      userWebInfo() {
        api.webInfo().then(result => {
          if (result.data.code === api.success_code) {
            this.userWeb = result.data.data.webInfo;
          } else {
            return this.$message.error("网站数据加载失败!")
          }
        });
      },
      texter() {
        //跳转到文章管理页面
        api.login().then(result=>{
          if (result.data.code=api.success_code){
            this.$message.success("已退出!")
            this.$router.push({
              path: '/',
            })
          }else {
            return this.$message.error("退出异常!")
          }
        });
      },
      family() {
        //跳转到文章管理页面
        this.$router.push({
          path: '/portal/about',
        })
      },
      classified() {
        //跳转到文章管理页面
        this.$router.push({
          path: '/portal/family/classified/articles',
        })
      },
    },
    mounted() {
      this.userWebInfo();
      this.userInfoPar();
    }
  }
</script>

<style scoped>
  .header-left-box {
    color: #fff;
    font-size: 24px;
    margin-left: 10px;
    font-weight: 600;
  }
  .hov-user-info{
    margin-right: 20px;
  }
  .el-dropdown-link-img{
    margin-right: 5px;
    margin-top: 5px;
  }
  .el-dropdown-info{
    line-height: 40px;
    cursor: pointer;
  }
  .el-dropdown-info >>> .el-dropdown-menu__item{
    color: #009432 !important;
  }
  .el-dropdown-info .el-dropdown-link{
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 600;
  }
  .top-Home-box{
    cursor: pointer;
  }
</style>
