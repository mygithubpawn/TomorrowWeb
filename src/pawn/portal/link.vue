<template>
  <div class="link-index-box">
    <div style="width: 100%;height: 90px"></div>
    <div class="link-index-par">
      <div v-if="linksList.length!==0">
  <div class="link-index-friendship">
        <div class="link-list-box float-left" v-for="(item,index) in linksList" :key="index">
          <div class="link-image">
            <a :href="item.url" target="view_window">
            <el-image fit="cover" :src="item.logo" style="width: 250px;height: 80px"></el-image>
            </a>
          </div>
          <div class="link-name">
              <span v-text="item.name"></span>
            <span style="font-size: 12px;color: #4C5156">更新于:</span>
              <span style="font-size: 12px;color: #4C5156" v-text="formatDate(item.updateTime)"></span>
          </div>
        </div>
  </div>
      </div>
      <div v-else class="no-data">
        <span>还没有友链哟！</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '../../api/api'
  import * as dateUtils from '../../utils/date'
export default {
  name: "link",
  data(){
    return{
      linksList:[],
    }
  },
  methods:{
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy/ MM/ dd');
    },
    linksListDer(){
      api.listLinks().then(result => {
        if (result.data.code === api.success_code) {
          this.linksList = result.data.data.friendsList;
          // console.log(result.data)
        }
      });
    },
  },

  mounted() {
    this.linksListDer();
    // 单个页面路由回到浏览器顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.pageYOffset = 0
  }
}
</script>

<style lang="css" scoped>
@import "css/link.css";
</style>
