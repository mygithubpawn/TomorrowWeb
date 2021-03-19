<template>
    <div class="manage-img-index-box">
     <div class="manage-img-index-par">
          <el-menu class="el-menu-demo" mode="horizontal"
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b">
            <el-menu-item index="1">
              <router-link style="font-size: 20px"  to="/content/photo-album">我的相册</router-link>
            </el-menu-item>
             <el-menu-item index="2">
              <router-link style="font-size: 20px"  to="">待开发</router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <router-link  style="font-size: 20px" to="/content/cover-image">文章封面</router-link>
            </el-menu-item>
          </el-menu>
     </div>
          <div>
<router-view></router-view>
          </div>
    </div>
</template>

<script>
    export default {
        name: "manage-image"
    }
</script>

<style lang="css" scoped>
    @import "css/manage-image.css";
</style>
