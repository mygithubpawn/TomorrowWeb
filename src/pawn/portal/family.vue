<template>
  <div class="Home-index-box">
    <!--    轮播图-->
    <div class="community-index-loop-box">
      <div   v-if="listLoopRes.length!==0">
      <el-carousel   arrow="always" height="calc(100vh)"style="width:100%">
        <el-carousel-item v-for="(item,index) in listLoopRes" :key="index">
          <div class="article-cover-par">
            <img v-loading="loading" :src="item.imageUrl" style="height: calc(100vh);width: 100%"/>
          </div>
          <div class="img-detail">
            <a :href="item.targetUrl">
              <h3 class="category">{{item.title}}</h3>
              <h2 class="category-er">
                <i class="fa fa-minus horizontalLine" aria-hidden="true"></i>
                </h2>
              <h2 class="heading">{{item.introduction}}</h2>
              <h3 class="date" v-text="formatDate(item.createTime)"></h3>
            </a>
          </div>
        </el-carousel-item>
      </el-carousel>
      </div>
      <div v-else class="no-data-img">
        <span>暂无轮播图！</span>
      </div>
    </div>
    <div class="community-index-box clear-fix">
    <div class="community-index-par-box">
      <!--    置顶文章-->
      <div class="community-user-info clear-fix">
        <div class="sec-title">
          <span class="title">TOP ARTICLE</span>
        </div>
        <div v-if="topArticleList.length!==0">
        <div class="article-item float-left" v-for="(item,index) in topArticleList" :key="index">
          <div class="article-right">
            <div class="article-cover">
              <el-image v-loading="loading" fit="cover" :src="item.cover" style="height: 180px"/>
            </div>
          </div>
          <div class="article-left">
            <div class="article-title">
              <span @click="articleText(item)" class="title" v-text="item.title"></span>
            </div>
            <div class="article-summary">
              <i class="fa fa-calendar" style="font-size: 13px ;color: #a29bfe" aria-hidden="true"></i>
              <span class="min-massage-par" v-text="formatDateArticle(item.create_time)"></span>

              <span class="view-count">
              <i class="fa fa-diamond" style="font-size: 12px;color: #009432" aria-hidden="true"></i>
              <span class="min-massage-par" v-text="item.category_id"></span>
              </span>

              <span class="view-count">
                <i class="fa fa-eye" style="font-size: 12px;color: #a29bfe" aria-hidden="true"></i>
                {{item.view_count}}</span>
              <br>
              <div class="article-labels-box">
                <i class="fa fa-tags" style="font-size: 12px;color: #24c2cb" aria-hidden="true"></i>
                <span>{{item.labels.split('-')[0]}}</span>
                <span>{{item.labels.split('-')[1]}}</span>
                <span>{{item.labels.split('-')[2]}}</span>
                <span>{{item.labels.split('-')[3]}}</span>
                <span>{{item.labels.split('-')[4]}}</span>
              </div>
            </div>
            <div class="Read-the-full">
              <span @click="articleText(item)">阅读全文</span>
            </div>
          </div>
        </div>
        </div>
        <div class="no-data" v-else>
          <span>暂无置顶文章！</span>
        </div>
      </div>
      <!--最新文章-->
      <div class="mainBody-latest-box float-left">
        <div class="latest-articles-box">
          <router-link to="/portal/family/classified/articles">
            <span @click="clickSpan1" id="clickSpan1">最新文章</span>
          </router-link>
          <router-link to="/portal/family/classified/comment">
            <span @click="clickSpan2" id="clickSpan2">社区文章</span>
          </router-link>

          <router-link to="/portal/family/classified/local">
            <span @click="clickSpan3" id="clickSpan3">本地文章</span>
          </router-link>
        </div>
        <div class="article-vim-er-box">
          <router-view></router-view>
        </div>
      </div>
      <!--      个人介绍-->
      <div class="user-info-dai-box-rg">
        <user-info></user-info>
      </div>
    </div>
    <!--    推荐文章-->
    <div class="community-index-article-box clear-fix">
      <div class="sec-title-er">
        <span class="title">RECOMMENDED</span>
      </div>
      <div v-if="apiRecommendList.length!==0">
      <div class="latest-articles-par-box">
        <div class="latest-articles-article-par float-left" v-for="(recommend,index) in apiRecommendList" :key="index">
          <div class="latest-articles-img float-left">
            <div class="latest-articles-img-er">
            <el-image fit="cover" :src="recommend.cover" style="height: 130px;"></el-image>
            </div>
          </div>
          <div class="latest-articles-par">
            <i class="fa fa-diamond" style="font-size: 13px;color: #009432" aria-hidden="true"></i>
            <span>
          {{recommend.category_id}}
          </span>
          </div>
          <div class="latest-articles-title" @click="articleText(recommend)">{{recommend.title}}</div>
          <!--        文章信息-->
          <div class="latest-articles-message">
            <i class="fa fa-calendar" style="font-size: 13px" aria-hidden="true"></i>
            <span v-text="formatDateArticle(recommend.create_time)"></span>
            <i class="fa fa-eye" style="font-size: 12px" aria-hidden="true"></i>
            <span v-text="recommend.view_count"></span>
            <span class="read-the-full-text float-right" @click="articleText(recommend)">
            阅读全文
              <i class="fa fa-angle-down" aria-hidden="true"></i>
          </span>
          </div>
        </div>
      </div>
      </div>
      <div v-else class="no-data">
        <span>暂无文章！</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "family",
  data() {
    return {
      listLoopRes: [],
      selectedImageIndex: 0,
      topArticleList: [],
      apiRecommendList: [],
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
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy年 MM月 dd日');
    },
    //格式化日期
    formatDateArticle(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy/MM/dd');
    },
    topArticle() {
      this.loading = true;
      api.topArticle(1, 4).then(result => {
        if (result.data.code === api.success_code) {
          this.topArticleList = result.data.data.articleList[0].records
        } else {
          return this.$message.error("置顶文章加载异常");
        }
        this.loading = false;
      })
    },
    clickSpan(ElementById) {
      let elementById = document.getElementById(ElementById);
      elementById.style.background = '#34495E';
      elementById.style.color = '#fff';
    },
    clickSpanEr(ElementById) {
      let elementById = document.getElementById(ElementById);
      elementById.style.background = '#fff';
      elementById.style.color = '#34495E';
    },
    selectedByDefault() {
      this.clickSpan('clickSpan1');
      this.clickSpanEr('clickSpan2');
      this.clickSpanEr('clickSpan3');
    },
    clickSpan1() {
      this.clickSpan('clickSpan1');
      this.clickSpanEr('clickSpan2');
      this.clickSpanEr('clickSpan3');
    }
    ,
    clickSpan2() {
      this.clickSpan('clickSpan2');
      this.clickSpanEr('clickSpan1');
      this.clickSpanEr('clickSpan3');
    }
    ,
    clickSpan3() {
      this.clickSpan('clickSpan3');
      this.clickSpanEr('clickSpan2');
      this.clickSpanEr('clickSpan1');
    }
    ,

    loopList() {
      this.loading = true;
      api.listLoop(1, 5).then(result => {
        if (result.data.code = api.success_code) {
          this.listLoopRes = result.data.data.looperList.records;
        } else {
          return this.$notify({
            title: '数据加载异常', message: '文章加载失败', type: 'warning'
          });
        }
        this.loading = false;
      })
    },
    recommendList() {
      this.loading = true;
      api.recommendList(6).then(result => {
        if (result.data.code = api.success_code) {
          this.apiRecommendList = result.data.data.selectMapsRecommend.records;
        } else {
          return this.$message.error("推荐文章加载异常");
        }
        this.loading = false;
      })
    },
    articleText(item) {
      let routeData=this.$router.resolve({
        path: '/portal/article',
        query: {
          id: item.id
        }
      });
      window.open(routeData.href, '_blank');
    },
  },
  mounted() {
    this.topArticle();
    this.loopList();
    this.selectedByDefault();
    this.recommendList();
    this.getUserToken();
    // 单个页面路由回到浏览器顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.pageYOffset = 0
  },
}
</script>

<style lang="css" scoped>
  @import "./css/family-par.css";
</style>
