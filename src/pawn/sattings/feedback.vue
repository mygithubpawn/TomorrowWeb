<template>
  <div  class="ann-index-box">
    <div class="ann-index-par">
      <div class="pass-tittle">
        <span>用户反馈</span>
      </div>
      <div style="margin-right: 20px">
        <el-form label-width="100px" size="medium">
          <el-form-item label="反馈内容" required>
            <el-input
              type="textarea"
              minlength="0"
              maxlength="400"
              show-word-limit
              resize="node"
              placeholder="反馈内容..."
              :rows="8" v-model="customerFeedback"></el-input>
          </el-form-item>
          <el-form-item class="float-right">
            <el-button type="primary" @click="releaseNews">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-dialog
        title="用户反馈提示"
        :visible.sync="dialogVisibleNews"
        width="30%">
        <span>您确定提交该反馈吗！</span>
        <span slot="footer" class="dialog-footer">
   <el-button @click="dialogVisibleNews = false">取 消</el-button>
    <el-button type="primary" @click="submitFeedback">提 交</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import * as api from "../../api/api";

    export default {
        name: "feedback",
      data(){
          return{
            dialogVisibleNews:false,
            userInfo: {
              userName: '',
              id: '',
              roles: '',
              avatar: '',
              email: '',
              sign: '',
            },
            customerFeedback:'',
          }
      },
      methods:{
        releaseNews(){
          if (this.customerFeedback===''){
            return this.$message.warning("公告内容不可以为空哟!")
          }
          this.dialogVisibleNews=true;
        },
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
              this.userInfo.roles = result.data.data.userFromToken.roles;
              this.userInfo.avatar = result.data.data.userFromToken.avatar;
              this.userInfo.email = result.data.data.userFromToken.email;
              this.userInfo.sign = result.data.data.userFromToken.sign;
              api.listLabels(this.userInfo.id,20).then(result => {
                if (result.data.code === api.success_code) {
                  this.defaultWords = result.data.data.LabelPage.records;
                }
              });
            } else {
              return this.$message.error("用户加载失败!")
            }
          });
        },
        submitFeedback(){
          api.feedbackContent(this.userInfo.userName,this.userInfo.email,
            this.customerFeedback).then(result=>{
            this.dialogVisibleNews=false;
            if (result.data.code===api.success_code){
              this.customerFeedback='';
             return  this.$notify({
                title: '提交成功', message: '反馈已提交，感谢道友的支持！', type: 'success'
              });
            }else {
              return  this.$notify({
                title: '提交异常', message: '反馈提交异常，请稍后再试！', type: 'warning'
              });
            }
          });
        },
      },
      mounted() {
        this.getUserToken();
      }
    }
</script>


<style scoped>
  .ann-index-par{
    width: 800px;
    height: 600px;
    background-color: #EFF3F5;
    margin:  0 auto;
    border-radius: 4px;
  }
  .pass-tittle{
    font-size: 18px;
    color: #009432;
    text-align: center;
    font-weight: 600;
    padding-top: 10px;
    margin: 0 20px 40px 20px;
  }
</style>
