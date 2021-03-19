<template>
    <div class="comment-index-box">
      <div class="comment-index-par">
        <el-table
          v-loading="loading"
          :data="commentLists"
          size="medium"
          style="width:100%">
          <el-table-column
            prop="userName"
            label="道友"
            width="140">
          </el-table-column>
          <el-table-column
            label="头像"
            width="100">
            <template slot-scope="scope">
              <el-avatar size="medium" :src="scope.row.userAvatar" fit="cover"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            prop="parentContent"
            label="评论类容"
            width="320">
          </el-table-column>
          <el-table-column
            prop="status"
            label="评论状态"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.state==='1'">
                <el-tag type="success">正&nbsp;常</el-tag>
              </div>
              <div v-if="scope.row.state==='0'">
                <el-tag type="danger">已删除</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="评论时间"
            width="200">
            <template slot-scope="scope">
          <span v-text="formatDate(scope.row.createTime)">
          </span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间">
            <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)">
          </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除
              </el-button>
              <el-button round type="warning" size="small" @click="detailsItem(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="comment-page">
        <el-pagination
          class="user-list-page-navigation-bar"
          background
          @current-change="onPgeChange"
          :current-page="pageNavigations.currentPage"
          :page-size="pageNavigations.pageSize"
          layout="prev, pager, next"
          :total="pageNavigations.totalCount">
        </el-pagination>
      </div>
      <div>
        <el-dialog
          title="删除提示"
          :visible.sync="commentDialogVisible"
          width="30%">
          <span>确定要删除该评论吗</span>
          <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="commentDialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="deleteCommentDer">确 定</el-button>
  </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    import * as api from "../../api/api";
    import * as dateUtils from "../../utils/date";

    export default {
        name: "manage-comment",
      data(){
          return{
            commentLists:[],
            loading:false,
            commentDialogVisible:false,
            comment:{
              id:'',
            },
            //分页参数
            pageNavigations: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 14,
            },
          }
      },
      methods:{
        deleteCommentDer(){
          api.DeleteComment(this.comment.id).then(result=>{
            this.commentDialogVisible=false;
            if (result.data.code=api.success_code){
              this.$notify({
                title: '删除成功', message: '已删除该评论', type: 'success'
              });
            }else {
              this.$notify({
                title: '删除成功', message: '评论删除失败，请稍后再试', type: 'warning'
              });
            }
            this.userCommentListTer();
          });
        },
        detailsItem(item){
         let routeData=this.$router.resolve({
            path: '/portal/article',
            query: {
              id: item.articleId
            }
          });
          window.open(routeData.href, '_blank');
        },
        onPgeChange(page) {
          this.pageNavigations.currentPage = page + 1;
          this.userCommentListTer();
        },
        deleteItem(item){
          this.comment.id=item.id;
          this.commentDialogVisible=true;
        },
        //格式化日期
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        userCommentListTer(){
          this.loading=true;
          api.userCommentList(this.pageNavigations.currentPage,this.pageNavigations.pageSize).then(result=>{
            this.loading=false;
            if (result.data.code=api.success_code){
              this.commentLists=result.data.data.commentsListAll.records;
              this.pageNavigations.currentPage = result.data.data.commentsListAll.current;
              this.pageNavigations.totalCount = result.data.data.commentsListAll.total;
              this.pageNavigations.pageSize = result.data.data.commentsListAll.size;
              console.log(result.data);
            }
          });
        },
      },
      mounted() {
        this.userCommentListTer();
      }
    }
</script>

<style scoped>
  .comment-index-par >>> .el-table .cell{
    height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
.comment-page{
  float: right;
  margin-right: 20px;
  margin-top: 20px;
}
</style>
