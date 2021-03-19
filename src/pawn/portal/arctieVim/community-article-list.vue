<template>
    <div class="article-list">
      <div class="article-xq clear-fix" v-for="(item,index) in articleList":key="index">
      <div class="article-xq-title" @click="articleText(item)" v-text="item.title"></div>
      <div class="article-xq-summary" v-text="item.summary"></div>
        <div class="article-xq-display">
          <div class="article-xq-avatar">
          <el-avatar size="small" fit="cover" :src="item.avatar"></el-avatar>
          </div>
          <div class="article-xq-dis-box">
          <span v-text="item.userName"></span>
            <i>时间：</i>
          <span v-text="formatDateArticle(item.createTime)"></span>
            <i>浏览：</i>
          <span v-text="item.viewCount"></span>
            <i>分类：</i>
          <span v-text="item.categoryId"></span>
          </div>
        </div>
      </div>
      <div class="comm-picker-navigation">
        <div v-if="articleList.length!==0">
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
        <div v-else>
          <span style="color: #4C5156;font-size: 12px; font-family:SimSun">《暂无文章》</span>
        </div>
      </div>
    </div>
</template>

<script>
  import * as api from '../../../api/api'
  import * as dateUtils from '../../../utils/date'
  export default {
        name: "community-article-list",
      data(){
          return{
          articleList:[],
            classCapacity:'',
            classCapacityTitle:'',
            //分页参数
            pageNavigations: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 6,
            },
          }
      },
      methods:{
        articleText(item) {
         let routeData=this.$router.resolve({
            path: '/portal/article',
            query: {
              id: item.id
            }
          });
          window.open(routeData.href, '_blank');
        },
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page;
          this.communityList();
        },
        formatDateArticle(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy/MM/dd');
        },
        articleListLiName(){
          this.classCapacity = this.$route.query.portal;
          api.commCategoryList(this.classCapacity, this.pageNavigations.currentPage,
            this.pageNavigations.pageSize).then(result=>{
            if (result.data.code=api.success_code){
              this.articleList=result.data.data.capacityArticle.records;
              this.pageNavigations.currentPage = result.data.data.capacityArticle.current;
              this.pageNavigations.totalCount = result.data.data.capacityArticle.total;
              this.pageNavigations.pageSize = result.data.data.capacityArticle.size;
            }else {
            }
          });
        },
        articleListLiTitle(){
          this.classCapacityTitle = this.$route.query.capacity_title;
          api.commCategoryTitleList(this.classCapacityTitle, this.pageNavigations.currentPage,
            this.pageNavigations.pageSize).then(result=>{
            if (result.data.code=api.success_code){
              this.articleList=result.data.data.capacityTitleArticle.records;
              this.pageNavigations.currentPage = result.data.data.capacityTitleArticle.current;
              this.pageNavigations.totalCount = result.data.data.capacityTitleArticle.total;
              this.pageNavigations.pageSize = result.data.data.capacityTitleArticle.size;
            }else {
            }
          });
        },
        communityList(){
          api.communityList(this.pageNavigations.currentPage,this.pageNavigations.pageSize).then(result=>{
            if (result.data.code===api.success_code){
              this.articleList=result.data.data.productPageList.records;
              this.pageNavigations.currentPage = result.data.data.productPageList.current;
              this.pageNavigations.totalCount = result.data.data.productPageList.total;
              this.pageNavigations.pageSize = result.data.data.productPageList.size;
            }else {
            }
          });
        },
      },
    watch: {
      $route(to, from) {
        this.classCapacity = this.$route.query.portal;
        this.classCapacityTitle = this.$route.query.capacity_title;
        if (this.classCapacityTitle!==undefined){
         return  this.articleListLiTitle();
        }
        if (this.classCapacity===undefined){
         return  this.communityList();
        }else {
         return  this.articleListLiName();
        }
      }
    },
      mounted() {
            this.communityList();
      }
    }
</script>

<style scoped>
  .article-list{
    width: 820px;
    min-height: 450px;
    /*margin: 0 auto;*/
  }
  .article-xq{
    margin-bottom: 16px;
    padding: 10px 15px 15px;
    text-align: left;
    width: 100%;
    border-radius: 4px;
    background-color: #FFFFFF;
    transition: all 0.2s ease;
  }
  .article-xq:hover{
    box-shadow: 0 0  3px 3px #ced6e0;
  }
  .article-xq-title{
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
    color: #34495e;
    margin-top: 5px;
    padding-bottom: 10px;
    transition: all 0.2s ease;
  }
  .article-xq-title:hover{
    color: #009432;
  }
  .article-xq-summary{
    overflow: hidden;
    margin-bottom: 10px;
    color: #888;
    font-size: 12px;
    padding-right: 20px;
    line-height: 20px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .article-xq-avatar{
    margin-right: 4px;
    float: left;
  }
  .article-xq-display{
    line-height: 30px;
    margin-top: 18px;
  }
  .article-xq-dis-box{
    font-size: 12px;
    transition: all 0.2s ease;
    color: #4C5156;
  }
  .article-xq-dis-box:hover{
    color:#009432 ;
  }
  .article-xq-dis-box i{
    font-size: 12px;
    font-weight: 600;
  }
  .article-xq-dis-box span{
    color: #4C5156;
    margin-right: 10px;
    cursor: pointer;
  }
  .comm-picker-navigation{
    text-align: center;
    margin-bottom: 20px;
  }
</style>
