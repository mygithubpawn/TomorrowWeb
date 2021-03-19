<template>
  <div class="left-admin-box">
    <el-container>
      <!--      顶部-->
      <el-header id="admin-header-box">
       <div class="admin-span">
         <span @click="adminCommunity">Tomorrow</span>
       </div>
      </el-header>
      <!--      侧边栏-->
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="220px">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#F1F2F6"
                text-color="#34495E"
                active-text-color="#009432">
                <el-menu-item index="1">
                  <i class="fa fa-snowflake-o fa-fw fa-spin" aria-hidden="true"></i>
                  <span slot="title" @click="adminIndex">网站信息</span>
                </el-menu-item>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    <span>用户管理</span>
                  </template>
                    <el-menu-item index="2-1" @click="userAdmin">
                      <i class="fa fa-bars" aria-hidden="true"></i>&nbsp;&nbsp;用户列表</el-menu-item>
                    <el-menu-item index="2-2" @click="deactivateUser">
                      <i class="fa fa-unlock" aria-hidden="true"></i>&nbsp;&nbsp;用户解锁</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="fa fa-book" aria-hidden="true"></i>
                    <span>文章管理</span>
                  </template>
                    <el-menu-item index="3-1" @click="articleReview">
                      <i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp;&nbsp;文章审核</el-menu-item>
                    <el-menu-item index="3-2" @click="articleList"><i class="fa fa-list-ul" aria-hidden="true"></i>&nbsp;&nbsp;文章列表</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="fa fa-cogs" aria-hidden="true"></i>
                    <span>网站管理</span>
                  </template>
                    <el-menu-item index="4-1" @click="Announcement">
                      <i class="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;&nbsp;公告发布</el-menu-item>
                   <el-menu-item index="4-1" @click="AnnouncementList">
                     <i class="fa fa-envelope-open-o" aria-hidden="true"></i>&nbsp;&nbsp;公告列表</el-menu-item>
                </el-submenu>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!--        右边内容-->
        <el-main>
        <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
    import * as api from "../../api/api";

    export default {
        name: "adman-backstage",
      data(){
          return{
            isCollapse: true,
            userInfo:{
              roles:'',
            }
          }
      },

      methods:{
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.roles = result.data.data.userFromToken.roles;
              if ( this.userInfo.roles!=='role_admin'){
                this.$router.push({
                  path: '/404',
                })
              }
            }
          });
        },
        Announcement(){
          this.$router.push({
            path: '/admin/announcement',
          })
        },
        AnnouncementList(){
          this.$router.push({
            path: '/admin/announcement/list',
          })
        },
        deactivateUser(){
          this.$router.push({
            path: '/deactivate/list',
          })
        },
        adminIndex(){
          this.$router.push({
            path: '/admin/box',
          })
        },
        articleReview(){
          this.$router.push({
            path: '/admin/review',
          })
        },
        articleList(){
          this.$router.push({
            path: '/admin/list',
          })
        },
        adminCommunity(){
          this.$router.push({
            path: '/',
          })
        },
        userAdmin(){
          this.$router.push({
            path: '/user/list',
          })
        },
        passwordAdmin(){
          this.$router.push({
            path: '/user/reset-password',
          })
        }
      },
      mounted() {
          this.getUserToken();
      }
    }
</script>

<style scoped>
  .admin-span{
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  #left-menu-list-box >>> .el-menu {
    border-right: none;
    background-color: #f1f2f6;
  }

  #left-menu-list-box {
    z-index: 2000;
  }

  .main-container {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 0;
  }

  .el-header {
    background-color: #34495E;
    height: 46px !important;
    line-height: 46px;
  }

  .el-aside {
    background-color: #F1F2F6;
    border-right: solid 1px #ced6e0;
    line-height: 200px;
  }
.left-admin-box i{
  color: #009432;
}
</style>
