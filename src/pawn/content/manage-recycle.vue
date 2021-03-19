<template>
    <div class="recycle-liat-box">
      <div>
        <el-table
          v-loading="loading"
          :data="recycleList"
          size="medium"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="标题"
            width="300">
          </el-table-column>
          <el-table-column
            prop="state"
            label="文章状态"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.state==='1'">
                <el-tag>正常&nbsp;</el-tag>
              </div>
              <div v-if="scope.row.state==='0'">
                <el-tag type="info">已删除</el-tag>
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
              <el-button round type="primary" size="small" @click="restore(scope.row)" icon="el-icon-edit-outline">恢复
              </el-button>
              <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除
              </el-button>
              <el-button round type="warning" size="small" @click="detailsArticle(scope.row)">查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="recycle-page-box float-right">
          <!--    分页-->
          <el-pagination
            class="article-page-navigation-bar clear-fix"
            background
            @current-change="onPgeChange"
            :current-page="pageNavigation.currentPage"
            :page-size="pageNavigation.pageSize"
            layout="prev, pager, next"
            :total="pageNavigation.totalCount">
          </el-pagination>
        </div>
      </div>
      <div>
        <el-dialog
          title="文章恢复提示"
          :visible.sync="recycleDialogVisible"
          width="30%">
          <span>您确定恢复这篇文章吗！</span>
          <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="recycleDialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="restoreDer">恢 复</el-button>
  </span>
        </el-dialog>
        <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogVisible"
          width="30%">
          <span>您确定永久删除这篇文章吗！</span>
          <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="deleteItemDer">删 除</el-button>
  </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import * as api from '../../api/api'
  import * as dateUtils from '../../utils/date'
    export default {
        name: "manage-recycle",
      data(){
          return{
            //分页参数
            pageNavigation: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 14,
            },
            articleId:'',
            loading:false,
            recycleDialogVisible:false,
            deleteDialogVisible:false,
            recycleList:[],
            userInfo:{
              userName:'',
              id:'',
            },
          }
      },
      methods:{
        restoreDer(){
          api.recoveryArticle(this.articleId).then(result=>{
              this.recycleDialogVisible=false;
              this.recycleArticleList();
            if (result.data.code=api.success_code){
              return this.$notify({
                title: '恢复成功', message: '该文章已恢复删除！', type: 'success'
              });
            }else {
              return this.$notify({
                title: '恢复异常', message: '文章恢复失败！请稍再试 ', type: 'error'
              });
            }
          });
        },
        deleteItemDer(){
          api.deleteArticle(this.articleId).then(result=>{
            this.deleteDialogVisible=false;
            this.recycleArticleList();
            if (result.data.code=api.success_code){
              return this.$notify({
                title: '删除成功', message: '该文章已被永久删除！', type: 'success'
              });
            }else {
              return this.$notify({
                title: '删除异常', message: '文章删除失败！请稍再试 ', type: 'error'
              });
            }
          });
        },
        restore(item){
          this.articleId=item.id;
          this.recycleDialogVisible=true;
        },
        deleteItem(item){
          this.articleId=item.id;
          this.deleteDialogVisible=true;
        },
          detailsArticle(item){
            let routeData=this.$router.resolve({
              path: '/portal/article',
              query: {
                id: item.id
              }
            });
            window.open(routeData.href, '_blank');
          },
        onPgeChange(page) {
          this.pageNavigation.currentPage = page;
          this.recycleArticleList();
        },
        //格式化日期
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        recycleArticleList(){
          this.loading=true;
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
               api.recycleList(this.userInfo.id,this.pageNavigation.currentPage
                 ,this.pageNavigation.pageSize).then(result=>{
                if (result.data.code=api.success_code){
                  this.loading=false;
                  this.recycleList=result.data.data.articleRecycleList.records;
                  this.pageNavigation.currentPage = result.data.data.articleRecycleList.current;
                  this.pageNavigation.totalCount = result.data.data.articleRecycleList.total;
                  this.pageNavigation.pageSize = result.data.data.articleRecycleList.size;
                }
               });
            } else {

            }
          });
        },
      },
      mounted() {
        this.recycleArticleList();
      }
    }
</script>

<style scoped>
.recycle-page-box{
  margin-top: 20px;
  margin-right: 20px;
}
</style>
