<template>
    <div class="deactivate-index-box">
      <div>
        <div class="category-list-box">
          <el-table
            v-loading="loading"
            :data="deactivateUser"
            size="medium"
            style="width: 100%">
            <el-table-column
              fixed
              prop="id"
              label="ID"
              width="200">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              width="100">
            </el-table-column>
            <el-table-column
              label="头像"
              width="100">
              <template slot-scope="scope">
                <el-image class="user-avatar-img" size="medium" :src="scope.row.avatar"
                          fit="cover" :preview-src-list="srcListUser"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="200">
            </el-table-column>
            <el-table-column
              label="用户状态"
              width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.state==='1'">
                  <el-tag type="success" size="mini">正&nbsp;常</el-tag>
                </div>
                <div v-if="scope.row.state==='0'">
                  <el-tag type="danger">已禁用</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="注册时间"
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
              width="220">
              <template slot-scope="scope">e
                <el-button round type="danger" size="small" @click="enableItem(scope.row)">
                  <i class="fa fa-unlock" aria-hidden="true"></i>&nbsp;启用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <div class="page-user-box">
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
        <div>
          <el-dialog
            title="用户解锁提示"
            :visible.sync="enableDialogShow"
            width="500px">
            <span>您确定要解锁：“{{userName}}”这个用户吗 ！</span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="enableDialogShow=false" size="mini" type="danger">取 消</el-button>
           <el-button size="mini" type="primary" @click="enableUser">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
</template>

<script>
  import * as api from '../../api/api'
  import * as dateUtils from '../../utils/date'
    export default {
        name: "deactivate-user",
      data(){
          return{
            deactivateUser:[],
            srcListUser:[],
            enableDialogShow:false,
            loading:false,
            userState:'1',
            userId:'',
            userName:'',
            userEmail:'',
            emailText:'',
            //分页参数
            pageNavigation: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 12,
            },
          }
      },
      methods:{
        userOperating(userEmail,userName,content){
          api.userOperating(userName,userEmail,content).then(result=>{
            if (result.data.code===api.success_code) {
              this.$notify({
                title: '邮件发送成功', message: '已发送邮件提醒道友', type: 'success'
              });
            }else {
              this.$notify({
                title: '邮件发送异常', message: '邮件发送异常，请稍后再试', type: 'warning'
              });
            }
          });
        },
        enableUser(){
          this.enableDialogShow=false;
          api.enableUser(this.userId,this.userState).then(result=>{
            if (result.data.code===api.success_code){
              this.$notify({
                title: '操作成功', message: '用户已解锁', type: 'success'
              });
              this.deactivateUserList(this.userEmail,this.userName,this.emailText);
              this.userOperating();
            }else {
              this.$notify({
                title: '操作异常', message: '用户解锁异常，请稍后再试', type: 'warning'
              });
            }
          });
        },
        enableItem(item){
          this.enableDialogShow=true;
            this.userId=item.id;
            this.userName=item.userName;
            this.userEmail=item.email;
            this.emailText='您的账户已被小掌柜解锁，可前往登陆';
        },
        onPgeChange(page) {
          this.pageNavigation.currentPage = page + 1;
          this.deactivateUserList();
        },
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        deactivateUserList(){
          this.loading=true;
          api.deactivateListUser(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result=>{
            this.loading=false;
            if (result.data.code===api.success_code){
              this.deactivateUser=result.data.data.adminUserList.records;
              this.deactivateUser.forEach((item => {
                this.srcListUser.push(item.avatar);
              }));
              this.pageNavigation.currentPage = result.data.data.adminUserList.current;
              this.pageNavigation.totalCount = result.data.data.adminUserList.total;
              this.pageNavigation.pageSize = result.data.data.adminUserList.size;
            }else {
              this.$message.error(result.data.message);
            }
          });
        }
      },
      mounted() {
        this.deactivateUserList();
      }
    }
</script>

<style scoped>

</style>
