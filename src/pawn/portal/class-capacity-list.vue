<template>
    <div class="capacity-list-box">
      <div style="width: 100%;height: 90px"></div>
      <div class="capacity-list-par">
        <div class="capacity-her-keyword-box">
          <span class="capacity-her-ti"> 关键字：</span>
        <span class="capacity-her-keyword">{{classCapacity}}</span>
        </div>
          <div class="article-list-capacity-box float-left clear-fix">
            <div class="article-list-capacity clear-fix" v-for="(item,index) in articleListTitle":key="index">
              <div class="article-list-img float-left">
                <el-image  fit="cover" style="height: 210px" :src="item.cover"></el-image>
              </div>
              <div class="article-list-data">
                <span v-text="formatDateArticle(item.create_time)"></span>
                <span>.&thinsp;{{item.category_id}}</span>
              </div>
              <div class="article-list-title">
                <span @click="articleText(item)">{{item.title}}</span>
              </div>
              <div  class="article-list-summary">
                <span>{{item.summary}}</span>
              </div>
            </div>
            <div v-if="articleListTitle.length!==0">
        <div class="image-picker-navigation">
          <!--    分页-->
          <el-pagination
            class="article-list-page-navigation-bar"
            background
            @current-change="onPgeChanges"
            :current-page="pageNavigations.currentPage"
            :page-size="pageNavigations.pageSize"
            layout="prev, pager, next"
            :total="pageNavigations.totalCount">
          </el-pagination>
        </div>
            </div>
            <div v-else class="no-articles-box">
              <span>暂无文章！</span>
            </div>
          </div>
        <div>
          <user-info></user-info>
        </div>
      </div>
    </div>
</template>

<script>
  import * as api from '../../api/api'
  import * as dateUtils from '../../utils/date'
    export default {
        name: "class-capacity-list",
      data(){
        return{
          classCapacity:'',
          //分页参数
          pageNavigations: {
            currentPage: 1,
            totalCount: 0,
            pageSize: 6,
          },
          articleListTitle:[],
        }
      },
      methods:{
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page + 1;
          this.articleListLi();
        },
        articleText(item) {
          this.$router.push({
            path: '/portal/article',
            query: {
              id: item.id
            }
          });
        },
        BrowserTop(){
          // 单个页面路由回到浏览器顶部
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          window.pageYOffset = 0;
        },
        formatDateArticle(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy年 MM月dd日');
        },
        articleListLi(){
          this.classCapacity = this.$route.query.classCapacity;
          api.articleListTitleEr(this.classCapacity, this.pageNavigations.currentPage,
            this.pageNavigations.pageSize).then(result=>{
            if (result.data.code=api.success_code){
              this.articleListTitle=result.data.data.articleList[0].records;
              this.pageNavigations.currentPage = result.data.data.articleList[0].current;
              this.pageNavigations.totalCount = result.data.data.articleList[0].total;
              this.pageNavigations.pageSize = result.data.data.articleList[0].size;
            }else {
              return this.$message.error("数据加载失败!")
            }
          });
        },
      },
      watch: {
        $route(to, from) {
          //监听相同路由下参数变化的时候，从而实现异步刷新
          this.loading = true;
          //重新获取数据
          this.articleListLi();
          this.BrowserTop();
        }
      },
      mounted() {
        this.articleListLi();
        this.BrowserTop();
      }
    }
</script>

<style lang="css" scoped>
  @import "css/capacity-list.css";
</style>
