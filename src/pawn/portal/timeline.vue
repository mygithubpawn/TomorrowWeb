<template>
    <div class="time-index-box">
      <div style="width: 100%;height: 90px"></div>
      <div class="time-index-par clear-fix">
        <div class="time-index-date float-left" >
            <div class="time-index-list-par" v-for="(item,index) in timeArticleList":key="index">
            <el-timeline-item v-loading="loading" :timestamp="formatDateArticle(item.create_time)" placement="top">
              <el-card>
                <div v-cloak class="time-title-par" @click="articleText(item)" v-text="item.title"></div>
                <div v-cloak class="time-title-summary" v-text="item.summary"></div>
              </el-card>
            </el-timeline-item>
            </div>
          <el-timeline-item placement="top">
          </el-timeline-item>
          <div v-if="timeArticleList.length!==0">
          <div class="time-list-page">
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
        <div class="no-data" v-else>
          <span>暂无文章!</span>
        </div>
        </div>
        <div class="top-index-time-box float-right">
          <div class="top-index-time-par clear-fix">
            <span style="margin-left: 10px" class="float-left">
              <i class="fa fa-book" aria-hidden="true"></i>&thinsp;常用置顶</span>
            <span style="margin-right: 10px" class="float-right"><i class="fa fa-search" aria-hidden="true"></i></span>
          </div>
          <div v-if="timeArticleListTop.length!==0">
          <div class="top-index-time-title">
            <div class="top-index-time-title-list" v-for="(itemTop,indexTop) in timeArticleListTop":key="indexTop">
              <span v-cloak @click="articleText(itemTop)"><i class="fa fa-pinterest-p" aria-hidden="true"></i>
                &nbsp;
                {{itemTop.title}}</span>
            </div>
          </div>
          </div>
          <div class="no-data" v-else>
            <span>暂无顶置！</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import * as api from "../../api/api";
    import * as dateUtils from "../../utils/date";

    export default {
        name: "timeline",
      data(){
          return{
            loading:false,
            //分页参数
            pageNavigations: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 6,
            },
            timeArticleList:[],
            timeArticleListTop:[],
          }
      },
      methods:{
        articleText(item) {
          this.$router.push({
            path: '/portal/article',
            query: {
              id: item.id
            }
          });
        },
        formatDateArticle(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy/MM/dd');
        },
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page + 1;
          this.timeList();
        },
        timeList(){
          this.loading=true;
        api.listArticlePortal(this.pageNavigations.currentPage, this.pageNavigations.pageSize,).then(result => {
          if (result.data.code = api.success_code) {
            this.loading=false;
            this.timeArticleList = result.data.data.articleList[0].records;
            this.pageNavigations.currentPage = result.data.data.articleList[0].current;
            this.pageNavigations.totalCount = result.data.data.articleList[0].total;
            this.pageNavigations.pageSize = result.data.data.articleList[0].size;
          } else {

          }
        })
          },
        timeListTop(){
          this.loading=true;
        api.topArticle(0,20).then(result=>{
          this.loading=false;
            if (result.data.code === api.success_code) {
              this.timeArticleListTop = result.data.data.articleList[0].records
            } else {
              return this.$message.error("置顶文章加载异常");
            }
        });
        },
      },
      mounted() {
         // console.log("高度"+window.screen.height)
        this.timeListTop();
        this.timeList();
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        window.pageYOffset = 0
      }
    }
</script>

<style lang="css" scoped>
@import "css/timeline.css";
</style>
