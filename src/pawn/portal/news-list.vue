<template>
    <div class="news-list-box">
      <div class="news-list-top-box">
        <navigation-bar></navigation-bar>
      </div>
      <div class="news-list-par">
      <div class="news-list-top-px">
      <div class="news-list-der-par">
        <el-tabs type="border-card">
          <el-tab-pane label="公告">
        <div class="announcement-list-box" v-if="announcementNewsList.length!==0">
          <div class="news-list-for-box" v-for="(item,index) in announcementNewsList":key="index">
            <span style="color: #CF7AFC"><i class="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;&nbsp;</span>
            <span>发布时间：</span>
            <span style="color: #6F8894" v-text="formatDate(item.createTime)"></span>
            <span>&nbsp;—>&nbsp;</span>
            <span>公告内容：</span>
            <span style="color: #6F8894" v-text="item.content"></span>
          </div>
        </div>
            <div v-else class="No-news-box">
              <span>暂无消息!</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="消息">
        <div class="waitNews-list-box">
          <div v-if="waitNewsList.length!==0">
        <div class="news-list-for-box" v-for="(item,index) in waitNewsList":key="index">
          <span style="color: #FB4B26" @click="newsDeleteItem(item)"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;&nbsp;</span>
          <span>时间：</span>
          <span style="color: #6F8894" v-text="formatDate(item.createTime)"></span>
          <span>&nbsp;—>&nbsp;</span>
          <span>消息内容：</span>
          <span @click="detailContent(item)" style="color: chocolate" v-if="item.view=== '1'" v-text="item.content"></span>
          <span v-else v-text="item.content"></span>
        </div>
          <div class="news-page-par">
            <div v-if="waitNewsList.length!==0">
              <!--    分页-->
              <el-pagination
                @current-change="onPgeChanges"
                :current-page="pageNavigations.currentPage"
                :page-size="pageNavigations.pageSize"
                layout="prev, pager, next"
                :total="pageNavigations.totalCount">
              </el-pagination>
            </div>
          </div>
          <div class="waitNews-par-button float-right">
            <el-button @click="OneClickReadAll" size="small" type="success" plain>一键全读</el-button>
          </div>
          </div>
          <div v-else class="No-news-box">
            <span>暂无消息!</span>
          </div>
        </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      </div>
      </div>
      <div>
        <comm-bottom></comm-bottom>
      </div>
    </div>
</template>

<script>
    import NavigationBar from "./arctieVim/navigation-bar";
    import * as api from "../../api/api";
    import * as dateUtils from "../../utils/date";
    export default {
        name: "news-list",
      components: {NavigationBar},
      data(){
          return{
            userInfo:{
              userName:'',
              id:'',
              roles:'',
              avatar:'',
            },
            announcementNewsList:[],
            waitNewsList:[],
            //分页参数
            pageNavigations: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 16,
            },
          }
      },
      methods:{
        OneClickReadAll(){
          api.newsOne(this.userInfo.id).then(result=>{
            if (result.data.code===api.success_code){
              this.$message.success("操作成功！");
            }else {
              this.$message.warning("操作异常");
            }
              return this.listNewsUserPar();
          });
        },
        newsDeleteItem(item){
          api.deleteNews(item.id).then(result=>{
            if (result.data.code=api.success_code){
              this.announcementDialogVisible=false;
              this.$message.success("消息已删除");
            }else {
              this.$message.warning("消息删除异常");
            }
              return this.listNewsUserPar();
          });
        },
        detailContent(item){
          api.alreadyNews(item.id).then(result=>{
            if (result.data.code==api.success_code){
              this.readingTen='已查看';
            }else {
              this.readingTen='查看异常';
            }
          });
          this.$alert(item.content,'消息详情', {
            confirmButtonText: '已阅',
            callback: action => {
              this.$message({
                type: 'info',
                message:this.readingTen,
              });
              this.listNewsUserPar();
            }
          });
        },
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page+1;
          this.listNewsUserPar();
        },
        //格式化日期
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd');
        },
        listNewsUserPar(){
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
              this.userInfo.roles = result.data.data.userFromToken.roles;
              this.userInfo.avatar = result.data.data.userFromToken.avatar;
          api.listNewsUser(this.userInfo.id,this.pageNavigations.currentPage,
            this.pageNavigations.pageSize).then(result=>{
            if (result.data.code===api.success_code) {
              this.waitNewsList=result.data.data.newsList.records;
              this.pageNavigations.currentPage = result.data.data.newsList.current;
              this.pageNavigations.totalCount = result.data.data.newsList.total;
              this.pageNavigations.pageSize = result.data.data.newsList.size;
            }else {
              this.$message.warning("数据加载失败，请稍后再试")
            }
          });
            }
          });
        },
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userInfo.userName = result.data.data.userFromToken.userName;
              this.userInfo.id = result.data.data.userFromToken.id;
              this.userInfo.roles = result.data.data.userFromToken.roles;
              this.userInfo.avatar = result.data.data.userFromToken.avatar;
            }
          });
        },
        annNewsList(){
          api.announcementNews().then(result=>{
            if (result.data.code===api.success_code) {
              this.announcementNewsList = result.data.data.newsList;
            }else {
              this.$message.warning("数据加载失败，请稍后再试")
            }
          });
        },
      },
      mounted() {
          this.getUserToken();
          this.listNewsUserPar();
          this.annNewsList();
      }
    }
</script>

<style lang="css" scoped>
    @import "css/news-list.css";
</style>
