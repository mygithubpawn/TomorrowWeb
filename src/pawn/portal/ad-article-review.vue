<template>
<div class="admin-article-box">
    <div class="admin-article-list-par">
      <el-table
        v-loading="loading"
        :data="adminArticleList"
        size="medium"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="发布人"
          width="150">
        </el-table-column>
        <el-table-column
          label="头像"
          width="120">
          <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="300">
        </el-table-column>
        <el-table-column
          prop="status"
          label="文章状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='1'">
              <el-tag type="success">已发布</el-tag>
            </div>
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger">已删除</el-tag>
            </div>
            <div v-if="scope.row.status==='2'">
              <el-tag type="warning ">&nbsp;草&nbsp;稿&nbsp;</el-tag>
            </div>
              <div v-if="scope.row.status==='3'">
              <el-tag type="success">&nbsp;置&nbsp;顶&nbsp;</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="文章位置"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.position==='2'">
              <el-tag type="info">&nbsp;本&nbsp;地&nbsp;</el-tag>
            </div>
            <div v-if="scope.row.position==='1'">
              <el-tag>&nbsp;社&nbsp;区&nbsp;</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="review"
          label="审核状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.review==='1'">
              <el-tag type="info">待审核</el-tag>
            </div>
            <div v-if="scope.row.review==='2'">
              <el-tag>审核通过</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="viewCount"
          label="浏览量"
          width="120">
        </el-table-column>
        <el-table-column
          label="发布时间"
          width="200">
          <template slot-scope="scope">
          <span v-text="formatDate(scope.row.createTime)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="150">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button round type="primary" size="small" @click="byArticle(scope.row)"
                      >审核通过
            </el-button>
            <el-button round type="danger" size="small" @click="returnArticle(scope.row)">
              <i class="fa fa-hand-paper-o" aria-hidden="true"></i>&nbsp;&nbsp;打回
            </el-button>
            <el-button round type="warning" size="small" @click="detailsArticle(scope.row)"
                      >查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  <div>
    <el-dialog
      title="审核通过提示"
      :visible.sync="ArticledVisible"
      width="30%">
      <span>确定该文章审核通过吗！</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="ArticledVisible = false">取 消</el-button>
    <el-button type="primary" @click="byArticleAnd">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="文章打回提示"
      :visible.sync="ArticledVisibleDe"
      width="30%">
      <span>确定打回该文章吗！</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="ArticledVisibleDe = false">取 消</el-button>
    <el-button type="primary" @click="returnArticleAvd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
  <!--    分页-->
  <div class="page-navigation-box margin-bottom-20 float-right">
    <el-pagination
      class="user-list-page-navigation-bar"
      background
      @current-change="onPgeChange"
      :current-page="pageNavigation.currentPage"
      :page-size="pageNavigation.pageSize"
      layout="prev, pager, next"
      :total="pageNavigation.totalCount">
    </el-pagination>
  </div>
</div>
</template>

<script>
  import * as api from '../../api/api'
  import * as dateUtils from "../../utils/date";

    export default {
        name: "ad-article-review",
      data(){
          return{
            loading:false,
            ArticledVisible:false,
            ArticledVisibleDe:false,
            //分页参数
            pageNavigation: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 16,
            },
            userEmail:'',
            articleTitle:'',
            name:'',
            articleId:'',
            article:{
              review:'',
            },
            adminArticleList:[],
            userInfo:{
              roles:'',
            }
          }
      },
      methods:{
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.roles = result.data.data.userFromToken.roles;
              if ( this.userInfo.roles!=='role_admin'){
                this.$router.push({
                  path: '/404',
                })
              }
            }
          });
        },
        onPgeChange(page) {
          this.pageNavigation.currentPage = page;
          this.ArticleList();
        },
        returnArticleAvd(){
          this.ArticledVisibleDe=false;
          api.adminReview(this.articleId,this.article).then(result=>{
            this.ArticleList();
            if (result.data.code===api.success_code){
              return this.$notify({
                title: '打回成功', message: '文章已打回', type: 'success'
              });
            }else {
              return this.$notify({
                title: '操作异常', message: '文章打回操作异常，请稍后重试', type: 'warning'
              });
            }
          })
        },
        byArticleAnd(){
          this.ArticledVisible=false;
          api.adminReview(this.articleId,this.article).then(result=>{
            this.ArticleList();
            if (result.data.code===api.success_code){
              return this.$notify({
                title: '操作成功', message: '文章已发布到社区', type: 'success'
              });
            }else {
              return this.$notify({
                title: '操作异常', message: '审核操作异常，请稍后重试', type: 'warning'
              });
            }
          })
        },
        byArticle(item){
          this.ArticledVisible=true;
          this.articleId=item.id;
          this.userEmail=item.email;
          this.articleTitle=item.title;
          this.name=item.userName;
          this.article.review='2';
        },
        returnArticle(item){
          this.ArticledVisibleDe=true;
          this.articleId=item.id;
          this.userEmail=item.email;
          this.articleTitle=item.title;
          this.name=item.userName;
          this.article.review='3';
        },
        detailsArticle(item){
            this.$router.push({
              path: '/portal/article',
              query: {
                id: item.id
              }
            });
          },
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        ArticleList(){
          this.loading = true;
          api.adminArList(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
            this.loading=false;
            if (result.data.code = api.success_code) {
              // console.log(result)
              this.adminArticleList = result.data.data.reviewList.records;
              this.pageNavigation.currentPage = result.data.data.reviewList.current;
              this.pageNavigation.totalCount = result.data.data.reviewList.total;
              this.pageNavigation.pageSize = result.data.data.reviewList.size;
            } else {
              this.$notify({
                title: '加载失败', message: '数据加载失败，请稍后再试', type: 'error'
              });
            }
          })
        }
      },
      mounted() {
          this.getUserToken();
          this.ArticleList();
      }
    }
</script>

<style scoped>
    .page-navigation-box{
      margin-top: 20px;
      margin-right: 20px;
    }
</style>
