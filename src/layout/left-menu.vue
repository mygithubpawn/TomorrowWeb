<template>
  <div>
    <el-menu
      default-active="0"
      :unique-opened="true"
      class="el-menu-vertical-demo">
      <!--      遍历菜单类容-->
      <template v-for="(item, index)  in menuList">
        <!--      路由跳转-->
        <router-link :to="item.path" v-if="!item.children &&!item.hidden" :key="index">
          <el-menu-item :index="index+''" v-if="!item.children" :key="index">
            <i :class="item.icon" style="color:#34495E "></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-if="item.children &&!item.hidden" :key="index" :index="index+''">
          <template slot="title">
            <i :class="item.icon" style="color: #34495E"></i>
            <span>{{item.name}}</span>
          </template>

          <router-link :to="subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex">
            <el-menu-item :index="index+'-'+subIndex">
              <i :class="subItem.icon" style="color:#009432"></i>
              <span slot="title">{{subItem.name}}</span>
            </el-menu-item>
          </router-link>
        </el-submenu>

      </template>
    </el-menu>
  </div>
</template>

<script>
  import {routes} from '../router'

  export default {
    data() {
      return {
        menuList: []
      }
    },
    name: "left-menu",
    mounted() {
      let menuList = routes[0];
      this.menuList = menuList.children;
    }

  }
</script>

<style scoped>

</style>
