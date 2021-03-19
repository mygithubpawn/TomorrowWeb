<template>
  <div class="conn-list-box">
    <div class="news-list-box">
      <el-table
        v-loading="loading"
        :data="announcement"
        size="medium"
        style="width:100%">
        <el-table-column
          prop="id"
          label="ID"
          width="200">
        </el-table-column>
        <el-table-column
          prop="newsName"
          label="发布人"
          width="140">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          width="240">
        </el-table-column>
        <el-table-column
          prop="status"
          label="消息类型"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.announcement==='1'">
              <el-tag type="success">公&nbsp;告</el-tag>
            </div>
            <div v-if="scope.row.announcement ==='0'">
              <el-tag type="danger">消&nbsp;息</el-tag>
            </div>
          </template>
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
          width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="260">
          <template slot-scope="scope">
            <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除
            </el-button>
            <el-button round type="warning" size="small" @click="details(scope.row)">查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
    </div>
    <div>
      <el-dialog
        title="删除提示"
        :visible.sync="announcementDialogVisible"
        width="30%">
        <span>您确定删除该公告吗！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="announcementDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="newsDeleteItem">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import * as dateUtils from "../../utils/date";
    import * as api from '../../api/api'
    export default {
        name: "admin-annouce-list",
      data(){
          return{
            loading:'',
            newsId:'',
            announcementDialogVisible:false,
            announcement:[],
            announcementContent:'',
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
        newsDeleteItem(){
          api.deleteNews(this.newsId).then(result=>{
            if (result.data.code=api.success_code){
            this.announcementDialogVisible=false;
               this.$notify({
                title: '删除成功', message: '公告已删除 ', type: 'success'
              });
              return this.announcementList();
            }else {
             return  this.$notify({
                title: '删除异常', message: '公告删除异常，请稍后再试', type: 'warning'
              });
            }
          });
        },
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        details(item){
          this.readingTen='发布由于  '+this.formatDate(item.createTime);
          this.$alert(item.content,'消息详情',{
            confirmButtonText: '已阅',
            callback: action => {
              this.$message({
                type: 'info',
                message:this.readingTen,
              });
            }
          });
        },
        deleteItem(item){
          this.newsId=item.id;
          this.announcementDialogVisible=true;
        },
        announcementList(){
          api.announcementNews().then(result=>{
            if (result.data.code===api.success_code) {
              this.announcement = result.data.data.newsList;
              this.announcementContent = result.data.data.newsList.content;
            }else {
              this.$message.warning("数据加载失败，请稍后再试")
            }
          });
        },
        //格式化日期
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
      },
      mounted() {
        this.getUserToken();
          this.announcementList();
      }
    }
</script>

<style scoped>
 .news-list-box >>> .el-table .cell{
   height: 45px;
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 2;
 }
</style>
