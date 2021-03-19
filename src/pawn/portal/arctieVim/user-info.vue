<template>
  <!--      个人介绍-->
  <div class="user-info-box float-right">
    <div class="user-info-par-box ">
      <div class="user-info-md">
        <div class="user-info-font">ABOUTME</div>
      </div>
      <div class="user-info-avatar">
        <el-avatar fit="cover" style="height: 200px" :src="userInfo.avatar"></el-avatar>
      </div>
      <div class="user-info-sign">
        <span>{{userInfo.sign}}</span>
      </div>
      <div class="user-info-name">
        <span>{{userInfo.userName}}</span>
      </div>
      <div class="user-info-md-tr">
        <div class="user-info-font-tr">FOLLOWME</div>
      </div>
      <div class="user-info-log">
        <span><i class="fa fa-envelope" aria-hidden="true"></i></span>
        <span><i class="fa fa-qq" aria-hidden="true"></i></span>
        <span><i class="fa fa-weixin" aria-hidden="true"></i></span>
        <span><i class="fa fa-github" aria-hidden="true"></i></span>
        <span><i class="fa fa-linkedin-square" aria-hidden="true"></i></span>
      </div>
      <div class="user-info-md-label">
        <div class="user-info-font-label">TAG CLOUD</div>
      </div>
      <!--      标签云-->
      <div class="user-info-labels">
        <div v-if="defaultWords.length!==0">
        <div class="labels-list-box">
          <wordcloud
            :fontSize="fontSize	"
            :rotate="rotate"
            :margin="margin"
            :data="defaultWords"
            nameKey="name"
            valueKey="count"
            :showTooltip="false"
            :wordClick="wordClickHandler">
          </wordcloud>
        </div>
        </div>
        <div v-else class="no-data">
          <span>暂无标签！</span>
        </div>
      </div>
      <!--      分类-->
      <div class="user-info-md-label">
        <div class="user-info-font-label">CATEGORIES</div>
      </div>
      <div class="user-info-category clear-fix">
      <div v-if="listCategoryInfo.length!==0">
        <div class="user-info-category-list" v-for="(item,index) in listCategoryInfo" :key="index">
          <div class="user-info-category-psr float-left" @click="portalName(item)">{{item.name}}</div>
          <div class="user-info-category-amount float-right">
            <i class="fa fa-spinner fa-spin  fa-fw"></i>
            Posts
          </div>
        </div>
      </div>
        <div v-else class="no-data">
          <span>暂无分类！</span>
        </div>
      </div>
      <!--     推荐文章-->
      <div class="user-info-md-title">
        <div class="user-info-font-title">POPULAR POSTS</div>
      </div>

      <div class="user-info-article clear-fix">
        <div v-if="apiRecommendListSan.length!==0">
        <div class="user-info-article-list" v-for="(item,index) in apiRecommendListSan" :key="index">
          <div class="user-info-article-image float-left">
            <el-image fit="cover" :src="item.cover" style=" height: 80px"></el-image>
          </div>
          <div class="user-info-article-data">
            <span v-text="formatDateArticle(item.update_time)"></span>
          </div>
          <div class="user-info-article-title" @click="articleText(item)">
            <span>{{item.title}}</span>
          </div>
        </div>
        </div>
        <div v-else class="no-data-article">
          <span>暂无文章！</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../../api/api'
import * as dateUtils from '../../../utils/date'

export default {
  name: "user-info",
  data() {
    return {
      //标签云
      fontSize: [15, 35],
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      rotate: {from: -10, to: 10, numOfOrientation: 20},
      defaultWords: [],
      apiRecommendListSan: [],
      listCategoryInfo: [],
      loading: false,
      userInfo: {
        userName: '',
        id: '',
        roles: '',
        avatar: '',
        email: '',
        sign: '',
      },
    }
  },
  methods: {
    portalName(portal){
      this.$router.push({
        path: '/portal/categories/list',
        query: {
          portalVim: portal.name,
        }
      });
    },
    listCategories() {
      api.listCategories().then(result => {
        if (result.data.code === api.success_code) {
          this.listCategoryInfo = result.data.data.categoriesList.records;
        }
      })
    },
    articleText(item) {
      this.$router.push({
        path: '/portal/article',
        query: {
          id: item.id
        }
      });
    },
    //格式化日期
    formatDateArticle(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy~MM~dd');
    },
    wordClickHandler(name) {
        // console.log(name);
      this.$router.push({
        path: '/portal/label/list',
        query: {
          labelName: name,
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
          api.listLabels(this.userInfo.id,20).then(result => {
            if (result.data.code === api.success_code) {
              this.defaultWords = result.data.data.LabelPage.records;
            }
          });
        } else {
          return this.$message.error("用户加载失败!")
        }
      });
    },
    apiRecommendListSanPer() {
      this.loading = true;
      api.recommendList(3).then(result => {
        if (result.data.code = api.success_code) {
          this.apiRecommendListSan = result.data.data.selectMapsRecommend.records;
        } else {
          return this.$message.error("推荐文章加载异常");
        }
        this.loading = false;
      })
    },
  },
  mounted() {
    this.getUserToken();
    this.apiRecommendListSanPer();
    this.listCategories();
  }
}
</script>

<style log="css" scoped>
  @import "../css/sidebar-user-info.css";
</style>
