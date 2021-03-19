<template>
  <div class="classified-vim-box">
    <div v-if="listArticlePortal.length!==0">
    <div class="vim-index-box clear-fix">
      <div class="vim-list-article-box float-left" v-for="(item,index) in listArticlePortal" :key="index">
        <!--        封面-->
        <div class="vim-image-box">
          <el-image style="height: 180px" fit="cover" :src="item.cover"></el-image>
        </div>
        <div class="vim-category-par">
          <i class="fa fa-diamond" style="font-size: 13px;color: #55efc4" aria-hidden="true"></i>
          <span v-text="item.category_id">
          </span>
        </div>
        <!--        标题-->
        <div class="vim-title-par" @click="articleText(item)">
          <span class="vim-title-span" v-text="item.title"></span>
        </div>
        <!--        简介-->
        <div class="vim-introduction-par">
          <span v-text="item.summary"></span>
        </div>
        <!--        文章信息-->
        <div class="vim-message-par">
          <i class="fa fa-calendar" style="font-size: 12px" aria-hidden="true"></i>
          <span v-text="formatDateArticle(item.create_time)"></span>
          <i class="fa fa-eye" style="font-size: 12px" aria-hidden="true"></i>
          <span v-text="item.view_count"></span>
          <span class="read-the-full-text float-right" @click="articleText(item)">
            阅读全文
          <i class="fa fa-angle-down" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
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
    <div class="no-data" v-else>
      <span>暂无文章！</span>
    </div>
  </div>
</template>

<script>
import * as dateUtils from "../../../utils/date";
import * as api from "../../../api/api";

export default {
  name: "comment-user-list",
  data() {
    return {
      listArticlePortal: [],
      //分页参数
      pageNavigations: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 12,
      },
    }
  },
  methods: {
    onPgeChanges(page) {
      this.pageNavigations.currentPage = page + 1;
      this.listArticle();
    },
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
    listArticle() {
      api.listArticleComment(this.pageNavigations.currentPage, this.pageNavigations.pageSize,).then(result => {
        if (result.data.code = api.success_code) {
          this.listArticlePortal = result.data.data.articleList[0].records;
          this.pageNavigations.currentPage = result.data.data.articleList[0].current;
          this.pageNavigations.totalCount = result.data.data.articleList[0].total;
          this.pageNavigations.pageSize = result.data.data.articleList[0].size;
        } else {
          this.$message.error("文章数据加载失败，请稍后重试！")
        }
      })
    }
  },
  mounted() {
    this.listArticle();
  }
}
</script>

<style lang="css" scoped>
  @import "../css/classified.css";
</style>
