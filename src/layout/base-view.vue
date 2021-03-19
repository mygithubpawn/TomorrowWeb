<template>
  <div>
    <el-container>
      <!--      顶部-->
      <el-header id="admin-header-box">
        <topHeader></topHeader>
      </el-header>

      <!--      侧边栏-->
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="220px">
          <leftMen></leftMen>
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
  export default {
    name: "base-view"
  }
</script>

<style scoped>

  #left-menu-list-box >>> .el-menu {
    border-right: none;
    background-color: #EFF3F5;
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
    background-color: #EFF3F5;
    border-right: solid 1px #ced6e0;
    line-height: 200px;
  }


</style>
