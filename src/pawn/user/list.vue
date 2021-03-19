<template>
  <div class="user-list-box">
    <!--    搜索-->
    <div class="user-search-pat margin-bottom-20">
      <el-form :inline="true" size="medium">
        <el-form-item label="用户名">
          <el-input v-model="search.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="search.email" placeholder="请输邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="cleanSearch" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-box margin-bottom-20">
      <div class="category-list-box">
        <el-table
          v-loading="loading"
          :data="userList"
          size="medium"
          style="width: 100%">
          <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
          </el-table-column>
          <el-table-column
            prop="user_name"
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
                <el-tag type="danger">已删除</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="注册时间"
            width="200">
            <template slot-scope="scope">
          <span v-text="formatDate(scope.row.create_time)">
          </span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            width="200">
            <template slot-scope="scope">
            <span v-text="formatDate(scope.row.update_time)">
          </span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button round type="primary" size="small" @click="resetPassword(scope.row)">密码重置</el-button>
              <el-button round type="danger" size="small" @click="deleteItem(scope.row)">
                <i class="fa fa-unlock-alt" aria-hidden="true"></i>&nbsp;禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--    分页-->
    <div class="page-navigation-box margin-bottom-20 clear-fix">
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
    <div class="user-list-dialog-box">
      <el-dialog
        title="禁用提示"
        :visible.sync="deleteDialogShow"
        width="500px">
        <span>您确定要删除：“{{deleteUserName}}”这个用户吗 ！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogShowEr" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="toDeleteItem">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="resetPasswordShow"
        width="500px">
        <div class="reset-password-box">
          <div class="reset-tips-text">重置“{{targetResetUserName}}”的密码</div>
          <el-form label-width="100px">
            <el-form-item label="新密码" required>
              <el-input type="password" placeholder="请输入新密码" v-model="resetPasswordValue"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="resetPasswordShow = false" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="doResetPassword">确定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'
import {hex_hmac_md5} from '../../utils/md5'

export default {
  name: "list",
  //常量区
  data() {
    return {
      search: {
        userName: '',
        email: '',
      },
      loading: false,
      userList: [],
      srcListUser: [],
      //分页参数
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 20,
      },
      deleteDialogShow: false,
      deleteUserName: '',
      targetDeleteUserId: '',
      targetResetUserName: '',
      targetResetUserEmail: '',
      resetPasswordShow: false,
      resetPasswordValue: '',
      targetResetUserId: '',
      emailText:'',
    }
  },
  //方法区
  methods: {
    deleteDialogShowEr() {
      this.deleteDialogShow = false;
      this.cleanSearch();
    },
    doResetPassword() {
      api.resetPassword(this.targetResetUserId, this.resetPasswordValue).then(result => {
        let res = result.data;
        //检查数据
        if (this.resetPasswordValue === '') {
          this.showWarningEr("新密码不能为空");
          return;
        }
        if (res.code === api.success_code) {
          this.resetPasswordShow = false;
          this.$notify({
            title: '重置密码成功', message: '密码已重置', type: 'success'
          });
          this.userOperating(this.targetResetUserEmail,this.targetResetUserName,this.emailText);
          this.resetPasswordValue = '';
        } else {
          this.$notify({
            title: '重置密码失败', message: '密码重置失败，请稍后再试！', type: 'error'
          });
          this.resetPasswordValue = '';
        }
      })
    },
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
    toDeleteItem() {
      api.deleteUserById(this.targetDeleteUserId).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.deleteDialogShow = false;
          this.$notify({
            title: '禁用成功', message: '用户已被禁用', type: 'success'
          });
          this.userOperating(this.targetResetUserEmail,this.targetResetUserName,this.emailText);
          this.listUser();
        } else {
          this.$notify({
            title: '禁用异常', message: '用户禁用操作异常，请稍后再试', type: 'warning'
          });
        }
      });
    },

    showWarning(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'success'
      })
    },
    showWarningEr(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      })
    },
    //搜索
    doSearch() {
      this.loading = true;
      api.doUserSearch(this.search.userName, this.search.email).then(result => {
        this.handleUserListResult(result);
      });
      this.loading = false;
    },
    //清空
    cleanSearch() {
      this.search.userName = '';
      this.search.email = '';
      this.listUser();
    },
    onPgeChange(page) {
      this.pageNavigation.currentPage = page + 1;
      this.listUser();
    },
    //重置密码
    resetPassword(item) {
      this.resetPasswordShow = true;
      this.targetResetUserName = item.user_name;
      this.targetResetUserId = item.id;
      this.targetResetUserEmail = item.email;
      this.emailText = '您的密码已被小掌柜重置，请牢记密码';
    },
    //删除用户
    deleteItem(item) {
      this.deleteDialogShow = true;
      this.targetDeleteUserId = item.id;
      this.deleteUserName = item.user_name;
      this.targetResetUserEmail = item.email;
      this.emailText = '您的账号被小掌柜检查到有非法或违反本网站的行为，已被小掌柜禁用，若有疑问可联系小掌柜，交流群：722633922';
    },
    //获取用户列表
    listUser() {
      this.loading = true;
      api.listUser(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
        this.handleUserListResult(result);
      });
      this.loading = false;
    },
    //用户列表
    handleUserListResult(result) {
      let res = result.data;
      if (res.code === api.success_code) {
        this.userList = res.data.user_time[0].records;
        this.userList.forEach((item => {
          this.srcListUser.push(item.avatar);
        }));
        this.pageNavigation.currentPage = res.data.user_time[0].current;
        this.pageNavigation.totalCount = res.data.user_time[0].total;
        this.pageNavigation.pageSize = res.data.user_time[0].size;
      } else {
        this.$message.error(res.message);
      }
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
  },
  //默认加载
  mounted() {
    this.listUser();
  }
}
</script>

<style scoped>
  .user-list-page-navigation-bar {
    margin-right: 50px;
    margin-top: 20px;
    float: right;
  }

  .reset-tips-text {
    margin-left: 100px;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
  }

  .user-avatar-img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }
</style>
