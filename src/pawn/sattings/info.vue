<template>
  <div class="settings-user-info-box">
    <div class="user-info-list-part">
      <div class="user-info-par-box">
        <div class="pass-tittle">
          <span>用户信息</span>
        </div>
      <el-form label-width="100px" size="medium">
        <el-form-item label="头像" class="user-info-avatar" required>
          <div class="user-avatar-container" @click="showAvatarDialog">
            <el-avatar :size="60" :src="userInfo.avatar"></el-avatar>
          </div>
        </el-form-item>
        <el-form-item label="用户ID" prop="pass">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" required>
          <el-input type="email" v-model.number="userInfo.email" disabled></el-input>
          <el-button type="primary" class="update-email-btn" @click="toUpdateEmail">修改邮箱</el-button>
        </el-form-item>
        <el-form-item label="用户名" required>
          <el-input maxlength="10" show-word-limit type="text" v-model.number="userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="职业" required>
          <el-input maxlength="20" show-word-limit type="text" v-model.number="userInfo.occupation"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            style="width: 600px"
            type="textarea"
            :rows="6"
            maxlength="600"
            show-word-limit
            resize="node"
            placeholder="个人简介（6~600个字符）" v-model.number="userInfo.sign"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="userInfoSaveBox">保存数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-save-box">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="25%">
        <span>您确定保存这些数据吗!</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUserInfo">保 存</el-button>
  </span>
      </el-dialog>
    </div>
    <div class="user-info-dialog">
      <!--    头像上传-->
      <avatar-update field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showAvatarCutter"
                     :width="300"
                     :height="300"
                     :url="imagesAdd"
                     img-format="png"></avatar-update>
    </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'
import avatarUpload from 'vue-image-crop-upload/upload-2.vue';

export default {
  components: {
    'avatar-update': avatarUpload,
  },
  name: "info",
  data() {
    return {
      imagesAdd: api.http_img,
      userIdToken: '',
      lastUserName: '',
      showAvatarCutter: false,
      dialogVisible: false,
      userInfo:{
        id:'',
        userName:'',
        sign:'',
        email:'',
        avatar:'',
        occupation:'',
      },
    }
  }
  ,
  methods: {
    userInfoSaveBox() {
      this.dialogVisible = true;
    },
    showAvatarDialog() {
      this.showAvatarCutter = true;
    },
    //上传成功回调函数
    cropUploadSuccess(response) {
      // console.log(response);
      if (response.code === api.success_code) {
        //回显图片
        this.userInfo.avatar = response.data.images.url;
        return this.$notify({
          title: '上传成功', message: '头像上传成功', type: 'success'
        });
      } else {
        return this.$notify({
          title: '上传异常', message: '头像上传异常，请稍后再试！', type: 'warning'
        });
      }
    },
    //上传失败回调函数
    cropUploadFail() {
      return this.$message.error("头像上传异常，请稍后再试")
    },
    getUserInfo() {
      api.LoginGet().then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.userInfo.userName = res.data.userFromToken.userName;
          this.userInfo.id = res.data.userFromToken.id;
          this.userInfo.sign = res.data.userFromToken.sign;
          this.userInfo.avatar = res.data.userFromToken.avatar;
          this.userInfo.email = res.data.userFromToken.email;
          this.userInfo.occupation = res.data.userFromToken.occupation;
          this.lastUserName = res.data.userFromToken.userName;
        } else {
          return this.$notify({
            title: '加载异常', message: '数据加载失败，请稍后再试!', type: 'error'
          });
        }

      })
    }
    ,
    updateUserInfo() {
      //检查数据
      //检查用户名，头像
      if (this.userInfo.userName === '') {
        this.dialogVisible = false;
        return this.$message.error('用户名不能为空');
      }
      //如果当前用户名与提交数据的用户名相同，即不需要检查用户名
      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateUserInfo();
      } else {
        api.checkUserName(this.userInfo.userName).then(result => {
          let res = result.data;
          if (res.code === api.success_code) {
            this.doUpdateUserInfo();
          } else {
            this.dialogVisible = false;
            return this.$notify({
              title: '用户名异常', message: '该用户名已被人使用', type: 'warning'
            });
          }
        });
      }
    },
    doUpdateUserInfo() {
      if (this.userInfo.avatar === '') {
        this.dialogVisible = false;
        return this.$message.error('头像不能为空');
      }
      //提交数据
      api.updateUserInfo(this.userInfo, this.userInfo.id).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.getUserInfo();
          this.dialogVisible = false;
          return this.$notify({
            title: '保存成功', message: '用户信息已保存', type: 'success'
          });
        } else {
          this.dialogVisible = false;
          return this.$notify({
            title: '保存异常', message: '用户信息保存异常，请稍后再试!', type: 'warning'
          });
        }
      });
    },
    toUpdateEmail() {
      this.$router.push({
        path: '/sattings/email',
      })
    },
    TokenInfo(){
      api.LoginGet().then(result=>{
        this.userIdToken = result.data.data.userFromToken.id; // 要保证取到
        this.imagesAdd= this.imagesAdd+this.userIdToken+'/avatar';
        // console.log( this.imagesAdd)
      });
    },
  },
  mounted() {
    this.TokenInfo();
    this.getUserInfo();
  }
}
</script>

<style scoped>
  .pass-tittle{
    font-size: 18px;
    color: #009432;
    text-align: center;
    font-weight: 600;
    padding-top: 10px;
    margin: 0 20px 40px 20px;
  }
  .user-info-par-box{
    width: 800px;
    height: 650px;
    background-color: #EFF3F5;
    margin:  0 auto;
    border-radius: 4px;
  }
  .user-avatar-container {
    width: 100px;
    cursor: pointer;
  }

  .update-email-btn {
    margin-left: 20px;
  }

  .user-info-avatar {
    display: inline-block;
  }

  .settings-user-info-box >>> .el-input, .settings-user-info-box >>> .el-textarea {
    width: 260px;
  }
</style>
