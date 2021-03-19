<template>
  <div class="about-index-box">
    <div class="about-index-par clear-fix">
      <div class="about-index-info-box">
        <div class="about-user-info">
          <div class="about-user-img">
            <el-avatar fit="cover" style="width: 120px;height: 120px;" :src="userInfo.avatar"></el-avatar>
          </div>
          <div class="about-user-name">
            <span>{{userInfo.userName}}</span>
          </div>
          <div class="about-user-occupation">
            <span>{{userInfo.occupation}}</span>
          </div>
        </div>
          <div class="about-user-roles clear-fix">
            <div class="about-user-roles-par">
              <span>内心独白</span>
            </div>
            <div style="height: 30px"></div>
            <div class="about-user-roles-text">
            <div v-if="userInfo.sign!==''">
            <span>{{userInfo.sign}}</span>
            </div>
            <div v-else class="no-data">
              <span>您还设置自己的独白哟！</span>
            </div>
            </div>
          </div>
        <div style="height: 60px"></div>
        <div class="about-user-roles clear-fix">
          <div class="about-user-roles-par">
              <span>博客介绍</span>
              <span style="font-size: 12px;color: #4C5156">更新于:</span>
            <span style="font-size: 12px;color: #4C5156" v-text="formatDateArticle(web.updateTime)"></span>
          </div>
          <div style="height: 30px"></div>
          <div class="about-user-roles-text">
          <div v-if="web.introduction!==''">
            <span>{{web.introduction}}</span>
          </div>
          <div v-else class="no-data">
            <span>您还没添加自己的网站解介绍哟！</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import * as dateUtils from "../../utils/date";

export default {
    name: "ae",
  data(){
      return{
        userInfo:{
          id:'',
          userName:'',
          sign:'',
          occupation:'',
          avatar:'',
        },
        web:{
          value:'',
          introduction:'',
          updateTime:'',
        }
      }
  },
  methods:{
    formatDateArticle(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy/ MM/ dd');
    },
      webInfo(){
        api.getWebSizeInfo().then(result=>{
          this.web.value = result.data.data.webInfo.value;
          this.web.introduction = result.data.data.webInfo.introduction;
          this.web.updateTime = result.data.data.webInfo.updateTime;
        })
      },
    TokenInfoAbout(){
      api.LoginGet().then(result => {
        if (result.data.code === api.success_code) {
          this.userInfo.userName = result.data.data.userFromToken.userName;
          this.userInfo.id = result.data.data.userFromToken.id;
          this.userInfo.sign = result.data.data.userFromToken.sign;
          this.userInfo.occupation = result.data.data.userFromToken.occupation;
          this.userInfo.avatar = result.data.data.userFromToken.avatar;
        }
      });
    },
  },

  mounted() {
    this.webInfo();
    this.TokenInfoAbout();
    // 单个页面路由回到浏览器顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.pageYOffset = 0
  }
}
</script>

<style lang="css" scoped>
 @import "css/about.css";

</style>
