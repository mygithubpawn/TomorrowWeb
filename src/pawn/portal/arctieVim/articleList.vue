<template>
  <div class="article-list-capacity-box float-left clear-fix">
    <div class="article-list-capacity clear-fix" v-for="(item,index) in articleListTitle":key="index">
      <div class="article-list-img float-left">
        <el-image fit="cover" style="height: 210px" :src="item.cover"></el-image>
      </div>
      <div class="article-list-data">
        <span v-text="formatDateArticle(item.create_time)"></span>
        <span>.&thinsp;{{item.category_id}}</span>
      </div>
      <div class="article-list-title">
        <span>{{item.title}}</span>
      </div>
      <div  class="article-list-summary">
        <span>{{item.summary}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '../../../api/api'
  import * as dateUtils from '../../../utils/date'
    export default {
        name: "articleList",
      data(){
        return{
          classCapacity:'',
          //分页参数
          pageNavigations: {
            currentPage: 1,
            totalCount: 0,
            pageSize: 12,
          },
          articleListTitle:[],
        }
      },
      methods:{
        formatDateArticle(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy年 MM月dd日');
        },
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page + 1;
          this.articleListLi();
        },
        articleListLi(){
          this.classCapacity = this.$route.query.classCapacity;
          api.articleListTitleEr(this.classCapacity, this.pageNavigations.currentPage,
            this.pageNavigations.pageSize).then(result=>{
            if (result.data.code=api.success_code){
              this.articleListTitle=result.data.data.articleList[0].records;
              // console.log(this.articleListTitle)
            }else {
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
        }
      },
      mounted() {
        this.articleListLi();
        // 单个页面路由回到浏览器顶部
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        window.pageYOffset = 0;
      }
    }
</script>

<style log="css" scoped>
  @import "../css/capacity-list.css";
</style>
