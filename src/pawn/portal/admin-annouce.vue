<template>
    <div  class="ann-index-box">
      <div class="ann-index-par">
        <div class="pass-tittle">
          <span>发布公告</span>
        </div>
        <div style="margin-right: 20px">
          <el-form label-width="100px" size="medium">
          <el-form-item label="公告内容" required>
            <el-input
              type="textarea"
              minlength="0"
              maxlength="999"
              show-word-limit
              resize="node"
              placeholder="公告内容..."
              :rows="8" v-model="announcement.news"></el-input>
          </el-form-item>
            <el-form-item class="float-right">
              <el-button type="primary" @click="releaseNews">发 布</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-dialog
          title="公告发布提示"
          :visible.sync="dialogVisibleNews"
          width="30%">
          <span>您确定发布该公告吗</span>
          <span slot="footer" class="dialog-footer">
   <el-button @click="dialogVisibleNews = false">取 消</el-button>
    <el-button type="primary" @click="checkReleaseNews">发 布</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </template>

<script>
    import * as api from "../../api/api";

    export default {
        name: "admin-annouce",
      data(){
          return{
              dialogVisibleNews:false,
            announcement:{
              news:'',
            },
            news:{
              announcement:'',
              content:'',
              receiverId:'',
            },
            userInfo:{
              id:'',
              userName:'',
              avatar:'',
            },
          }
      },
      methods:{
        checkReleaseNews(){
          this.news.announcement='1';
          this.news.content=this.announcement.news;
          this.news.receiverId='1234567';
          // console.log(this.news.announcement)
          // console.log(this.news.content)
          // console.log(this.news.receiverId)
          api.addNews(this.news).then(result=>{
            if (result.data.code=api.success_code){
               this.$notify({
                title: '发布成功', message: '公告已发布', type: 'success'
              });
            }else {
               this.$notify({
                title: '发布异常', message: '公告发布异常，请稍后再试', type: 'warning'
              });
            }
            this.announcement.news='';
          this.dialogVisibleNews=false;
         this.$router.push({
            path: '/admin/announcement/list',
          });
          });
        },
        releaseNews(){
          if (this.announcement.news===''){
            return this.$message.warning("公告内容不可以为空哟!")
          }
          this.dialogVisibleNews=true;
        },
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
              this.userInfo.avatar = result.data.data.userFromToken.avatar;
              this.userInfo.roles = result.data.data.userFromToken.roles;
              if ( this.userInfo.roles!=='role_admin'){
                this.$router.push({
                  path: '/404',
                })
              }
            } else {
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
