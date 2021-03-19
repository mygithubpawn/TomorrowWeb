<template xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
    <div class="com-list-box">
      <div class="com-list-par">
        <div class="com-list-article-box clear-fix">
          <div class="com-list-left float-left">
              <div class="com-list-left-top">
                  <div class="com-list-left-top-box float-left">
                    全部文章&nbsp;(&nbsp;<span v-text="articleCount"></span>&nbsp;)
                  </div>
            <div class="com-list-right-top-box float-right">
              <span>
              <el-button size="mini" icon="el-icon-search" circle @click="lookFor"></el-button>
              </span>
            </div>
              </div>
            <div>
              <community-article-list></community-article-list>
            </div>
          </div>
          <div class="com-list-right float-right">
              <div class="com-list-right-release">
                <el-button @click="posArticle" style="width: 280px" type="primary">
                <i class="el-icon-edit"></i>&nbsp;&nbsp;发布文章</el-button>
              </div>
            <div class="com-list-right-article">
              <div style="margin-top: 14px">
              <div class="com-list-right-article-top">
              <span style="color: #34495E" class="float-left">最新分类</span>
              <span class="float-right" @click="displayTime">
                <i  style="font-size: 16px"  class="fa fa-calendar" aria-hidden="true"></i>
              </span>
              </div>
              <div class="CaName-list">
                <div class="CaNameList-list" v-for="(item,index) in CaNameList":key="index">
                  <span @click="portalName(item)">
                    {{item.name}}
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div class="look-from-box">
        <el-drawer
          direction="ttb"
          :visible.sync="lookForDrawer"
          :with-header="false">
          <div  class="search-article-top-box">
            <div class="search-article-top-par">
              <input type="text" v-model="classCapacity" @keyup.enter="carriageReturn" placeholder="请输入搜索条件">
              <i class="fa fa-search" aria-hidden="true" @click="searchCondition"></i>
            </div>
          </div>
        </el-drawer>
      </div>
      <div>
        <el-dialog
          title="当前时间"
          :visible.sync="dialogVisibleDate"
          width="60%">
          <div>
            <el-calendar v-model="value">
            </el-calendar>
          </div>
          <span slot="footer" class="dialog-footer">
  </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import * as api from '../../../api/api'
    export default {
        name: "community-list",
      data(){
          return{
            value: new Date(),
            CaNameList:[],
            classCapacity:'',
            articleCount:'',
            lookForDrawer:false,
            dialogVisibleDate:false,
            userId:'',
          }
      },
      methods:{
        displayTime(){
          this.dialogVisibleDate=true;
        },
        carriageReturn(){
            this.searchCondition();
        },
        searchCondition(){
          if (this.classCapacity===''){
            return this.$message.info("请输入搜索关键字...")
          }
          this.lookForDrawer=false;
         return this.$router.push({
            path: '/portal/community/bbs',
            query: {
             capacity_title: this.classCapacity,
            }
          });
        },
        lookFor(){
          this.lookForDrawer=true;
        },
        getUserToken() {
          api.LoginGet().then(result => {
            if (result.data.code === api.success_code) {
              this.userId = result.data.data.userFromToken.id;
            }
          });
        },
        portalName(portal){
          this.$router.push({
            path: '/portal/community/bbs',
            query: {
              portal: portal.name,
            }
          });
        },
        posArticle(){
          if (this.userId!==''){
            let routeData=this.$router.resolve({
            path: '/content/pot-article',
          });
            window.open(routeData.href, '_blank');
          }else {
            return this.$message.warning("登陆之后才能发布文章哟!");
          }
        },
        recommendNameList(){
          api.recommendNameList(10).then(result=>{
            if (result.data.code===api.success_code){
                this.CaNameList=result.data.data.recommendName.records;
            }else{
            }
          });
          api.commArticleCount().then(result=>{
            if (result.data.code=api.success_code){
              this.articleCount=result.data.data.articleCountPor;
            }
          });
        }
      },
      mounted() {
        this.getUserToken();
        this.recommendNameList();
      }
    }
</script>

<style lang="css" scoped>
@import "../css/community-list.css";
</style>
