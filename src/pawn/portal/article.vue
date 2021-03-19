<template>
  <div class="index-null">
    <div>
      <navigation-bar></navigation-bar>
    </div>
  <div class="article-text-box clear-fix">
    <div class="article-top-index float-left clear-fix">
    <div class="article-inf-par">
<!--   navigationBar   文章信息-->
      <div class="article-inf-par-box">
        <el-collapse>
          <el-collapse-item style="font-size: 26px" :title="articles.title" name="1">
            <div>版权声明：本文为博主原创文章，遵循 <a style="color: #2BC8DA">CC 4.0 BY-SA</a> 版权协议，转载请附上原文出处链接和本声明。</div>
          </el-collapse-item>
        </el-collapse>
        <div class="article-inf-par-box-ter">
          <i>作者:</i>
            <span style="font-size: 16px;font-weight: 600">{{articles.userName}}</span>
          <i class="fa fa-calendar" aria-hidden="true"></i>&zwnj;
          <span v-text="formatDate(articles.createTime)"></span>
          <i class="fa fa-eye" aria-hidden="true"></i>&zwnj;
          <span>{{articles.viewCount}}</span>
          <br>
        <div class="article-inf-sort float-left">
          <i>分类专栏:</i>
          <el-tag size="mini" type="success">{{articles.categoryId}}</el-tag>
            <i>标签：</i>
        </div>
          <div class="article-tex-labels float-left" v-for="(item,index) in labels":key="index">
            <el-tag size="mini" type="info">{{item}}</el-tag>
          </div>

        </div>
      </div>
<!--      文章详情-->
      <div class="article-text-par">
        <mavon-editor
          class="md"
          :value="webDataString"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="false"
        />
      </div>
    </div>
    </div>
  </div>
    <div class="comment-box">
      <div class="comment-box-par clear-fix">
        <div class="comment-text-box">
        <div class="comment-text-ti">
          <span><i class="fa fa-free-code-camp" aria-hidden="true"></i></span>
          &nbsp;<span>请输入您的评论</span>
          <VueEmoji ref="emoji" @input="onInput":value="commentText" />
        </div>
          <div class="comment-oar-botto m float-right">
            <el-button class="float-right" type="primary" @click="goComment">
              <i class="fa fa-commenting-o" aria-hidden="true"></i>&nbsp;&nbsp;提交评论
            </el-button>
          </div>
      </div>
        <div class="comment-list-box" v-if="commentLists.length!==0">
            <div class="comment-der-box">
              <span style="color: #34495E;font-size: 16px">总共有&nbsp;{{pageNavigations.totalCount}}&nbsp;条评论</span>
            </div>
          <el-collapse accordion @change="handleChange">
          <div class="comment-der-list-box" v-for="(item,index) in commentLists" :key="index">
              <div class="comment-image float-left">
                <el-avatar size="medium" :src="item.userAvatar"></el-avatar>
              </div>
            <div class="comment-info">
                <span class="comment-info-name"  v-text="item.userName"></span>
                <span style="font-size: 12px ;color:#6F8894;" v-text="formatDate(item.createTime)"></span>
            </div>
            <div class="comment-parentContent">
              <span v-text="item.parentContent"></span>
            </div>
              <el-collapse-item :name="item.id">
                <template slot="title">
                  <span>
                 回复&nbsp;<i class="fa fa-commenting-o" aria-hidden="true"></i>
                  </span>
                </template>
                  <div class="comment-text-ti-res">
                    <div style="margin-bottom: 6px">
                    <span><i class="fa fa-free-code-camp" aria-hidden="true"></i></span>
                    &nbsp;<span >请输入您的回复</span>
                    </div>
                    <el-input
                      show-word-limit
                      resize="none"
                      maxlength="120"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容..."
                      v-model="commentTextRes">
                    </el-input>
                  </div>
                  <div class="float-right">
                    <el-button size="small" class="float-right" type="primary" @click="replyToExpandTr(item)">
                      <i class="fa fa-commenting-o" aria-hidden="true"></i>&nbsp;&nbsp;回复
                    </el-button>
                  </div>
              </el-collapse-item>
                <div v-for="(itemTer,index) in releaseLists":key="index" class="clear-fix">
                  <div v-if="item.id===itemTer.releaseId" class="SecondaryComment">
                    <div class="comment-image float-left">
                      <el-avatar size="small" :src="itemTer.userAvatar"></el-avatar>
                    </div>
                    <div class="comment-info-res">
                      <span class="comment-info-name-res"  v-text="itemTer.userName"></span>
                      <span style="font-size: 12px ;color:#6F8894;" v-text="formatDate(itemTer.createTime)"></span>
                    </div>
                    <div class="comment-parentContent">
                      <span v-text="itemTer.parentContent"></span>
                    </div>
                  </div>
                </div>
          </div>
            </el-collapse>
          <div class="comment-page" v-if="commentLists.length>4">
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
        <div class="comment-else" v-else>
          <span>
            还没人评论哟，快来抢占沙发吧!
          </span>
        </div>
        </div>
    </div>
    <div>
     <comm-bottom></comm-bottom>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'
import NavigationBar from "./arctieVim/navigation-bar";
// import comment from 'bright-comment'
import VueEmoji from 'emoji-vue'
export default {
  name: "article",
  components: {NavigationBar,VueEmoji},
  data() {
    return {
      replyToExpand:false,
      commentText: '',
      commentTextRes: '',
      labels: [],
      array:'',
      webDataString: '',
      articles: {
        id: '',
        createTime: '',
        userName: '',
        userId: '',
        articleCount:'',
        userAvatar: '',
        viewCount: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        position: '1',
        labels: '',
        status: '1',
        type: '1',
      },
      comment:{
        parentContent:'',
        articleId:'',
        releaseId:'',
        commentType:'',
      },
      articleId:'',
      commentLists:[],
      releaseLists:[],
      //分页参数
      pageNavigations: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 6,
      },
      userInfo:{
        id:'',
        userName:'',
        avatar:'',
      },
      news:{
        announcement:'',
        content:'',
        receiverId:'',
      },
      newsUserId:'',
    }
  },
  methods: {
    handleChange (data) {  //点击面板触发的函数 官网提供
      // console.log("改变"+array)
      this.releaseListTer(data);
    },
    replyToExpandTr(itemTer){
      if (this.userInfo.id===''){
        return  this.$message.info("登陆后才能回复哟！")
      }
      if (this.commentTextRes===''){
        return  this.$message.info("您还没填写回复内容哟")
      }
      this.comment.parentContent=this.commentTextRes;
      this.comment.articleId=this.articles.id;
      this.comment.releaseId=itemTer.id;
      this.newsUserId=itemTer.userId;
      this.comment.commentType='2';
      //获取回复内容
      api.addComment(this.comment).then(result=>{
        if (result.data.code=api.success_code){
          this.$message.success("回复成功，感谢您的留言")
          this.commentTextRes='';
          this.releaseListTer(itemTer.id);
          this.submitMessageComment(this.userInfo.userName,
            this.comment.parentContent,this.newsUserId);
        }else {
          this.commentTextRes='';
          this.$message.warning("回复异常")
        }
      });

    },
    commentListTer(){
      api.CommentList(this.articleId,this.pageNavigations.currentPage,
      this.pageNavigations.pageSize).then(result=>{
      if (result.data.code=api.success_code){
      this.commentLists=result.data.data.commentsList.records;
        this.pageNavigations.currentPage = result.data.data.commentsList.current;
        this.pageNavigations.totalCount = result.data.data.commentsList.total;
        this.pageNavigations.pageSize = result.data.data.commentsList.size;
      }
    });
    },
    releaseListTer(releaseId){
      if (releaseId==''){
       return  this.releaseLists=[];
    }
      // console.log("id:"+releaseId);
      api.ReleaseList(releaseId).then(result=>{
      if (result.data.code=api.success_code){
      this.releaseLists=result.data.data.replyList;
      }
    });
    },
    onPgeChanges(page) {
      this.pageNavigations.currentPage = page + 1;
      this.commentListTer();
    },
    submitMessageComment(userName,commentText,releaseId){
      this.news.announcement='2';//2表示消息
      this.news.content=userName+'道友回复了你的评论，回复内容：'+commentText;
      this.news.receiverId=releaseId;
      api.addNews(this.news);
    },
    submitMessage(userName,title,commentText,releaseId){
      this.news.announcement='2';//2表示消息
      this.news.content=userName+'道友评论了你的文章《'+title+'》评论内容：'+commentText;
      this.news.receiverId=releaseId;
      api.addNews(this.news);
    },
      onInput(event) {
      this.commentText=event.data;
      },
    goComment(){
      if (this.userInfo.id===''){
        return  this.$message.info("登陆后才能评论哟！")
      }
      if (this.commentText===''){
        return  this.$message.info("您还没填写评论内容哟")
      }
      this.comment.parentContent=this.commentText;
      this.comment.articleId=this.articles.id;
      this.comment.releaseId=this.articles.userId;
      this.comment.commentType='1';
      api.addComment(this.comment).then(result=>{
        if (result.data.code=api.success_code){
        this.$message.success("评论成功，感谢您的留言")
          this.commentText='';
          this.submitMessage(this.userInfo.userName,this.articles.title,
            this.comment.parentContent,this.comment.releaseId);
          this.commentListTer();
        }else {
          this.commentText='';
          this.$message.warning("评论异常")
        }
      });
    },
    getUserToken() {
      api.LoginGet().then(result => {
        if (result.data.code === api.success_code) {
          this.userInfo.userName = result.data.data.userFromToken.userName;
          this.userInfo.id = result.data.data.userFromToken.id;
          this.userInfo.avatar = result.data.data.userFromToken.avatar;
        } else {
        }
      });
    },
    chang(data,d){
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    labelsText() {
      this.articleId = this.$route.query.id;
      api.gitArticle(this.articleId).then(result => {
        let ret = result.data;
        let labelsEr = ret.data.selectAerFrom.labels;
        //处理标签
        this.labels = labelsEr.split('-');
        this.articles.id = ret.data.selectAerFrom.id;
        this.articles.title = ret.data.selectAerFrom.title;
        this.articles.content = ret.data.selectAerFrom.content;
        this.articles.categoryId = ret.data.selectAerFrom.categoryId;
        this.articles.cover = ret.data.selectAerFrom.cover;
        this.articles.status = ret.data.selectAerFrom.status;
        this.articles.summary = ret.data.selectAerFrom.summary;
        this.articles.type = ret.data.selectAerFrom.type;
        this.articles.position = ret.data.selectAerFrom.position;
        this.articles.createTime = ret.data.selectAerFrom.createTime;
        this.articles.userName = ret.data.selectAerFrom.userName;
        this.articles.userId = ret.data.selectAerFrom.userId;
        this.articles.userAvatar = ret.data.selectAerFrom.avatar;
        this.articles.viewCount = ret.data.selectAerFrom.viewCount;
        this.webDataString = ret.data.selectAerFrom.content;
        api.addViewCount(this.articleId);
      });
    }
  },
  mounted() {
    // 单个页面路由回到浏览器顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.pageYOffset = 0
    this.getUserToken();
    this.labelsText();
    this.commentListTer();
  }
}
</script>
<style lang="css" scoped>
  @import "./css/article-par.css";
</style>
