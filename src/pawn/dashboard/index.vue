<template>
  <div class="dashboard-index-box">
<!--    <div style="width:500px;height:500px" ref="chart"></div>-->
    <div class="blog-user-box">
      <div class="blog-user-par">
      <div class="blog-user-article">
        <div class="blog-user-tor">
        <span><i  class="el-icon-edit"></i></span>
        <span>文章</span>
        </div>
        <div class="blog-user-quantity">
        <span>{{articleCount}}&nbsp;<i class="fa fa-gbp" aria-hidden="true"></i></span>
        </div>
      </div>
      <div class="blog-user-com">
        <div class="blog-user-tor">
          <span><i  class="el-icon-pie-chart"></i></span>
          <span>分类</span>
        </div>
        <div class="blog-user-quantity">
          <span>{{categoriesCount}}&nbsp;<i class="fa fa-krw" aria-hidden="true"></i></span>
        </div>
      </div>
      <div class="blog-user-comment">
        <div class="blog-user-tor">
          <span><i  class="el-icon-chat-dot-square"></i></span>
          <span>评论</span>
        </div>
        <div class="blog-user-quantity">
          <span>{{commentCount}}&nbsp;<i class="fa fa-commenting-o" aria-hidden="true"></i></span>
        </div>
      </div>
        <div class="blog-user-label">
        <div class="blog-user-tor">
          <span><i class="fa fa-chain-broken" aria-hidden="true"></i></span>
          <span>友链</span>
        </div>
        <div class="blog-user-quantity">
          <span>{{friendsCount}}&nbsp;<i class="fa fa-link" aria-hidden="true"></i></span>
        </div>
      </div>
        <div class="blog-user-image">
        <div class="blog-user-tor">
          <span><i  class="el-icon-camera"></i></span>
          <span>相册</span>
        </div>
        <div class="blog-user-quantity">
          <span>{{imageCount}}&nbsp;<i class="fa fa-picture-o" aria-hidden="true"></i></span>
        </div>
      </div>
      </div>
    </div>
    <div class="" style="border: 1px solid #E1E1E1">
    <div class="float-left" id="chartPie" style="width: 40%;height: 60vh;margin-top: 20px">
    </div>
    <div class="float-right" id="chartLineBox" style="width: 55%;height: 60vh;margin-right: 15px;margin-top: 20px"></div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
//局部引用
const echarts = require('echarts');
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "index",
  data() {
    return {
      labelsClod: [],
      imageCount:'',
      articleCount:'',
      commentCount:'',
      categoriesCount:'',
      labelsCount:'',
      friendsCount:'',
      labels: {
        name: '',
        count: '',
      },
      userInfo:{
        id:'',
        userName:'',
        email:'',
      },
      jsonstr: [],
    }
  },

  methods: {
    initCharts(articleCount,friendsCount,categoriesCount,commentCount,imageCount,labelsCount) {
      this.chartLine = echarts.init(document.getElementById('chartLineBox'));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '博客数据',
          subtext: '柱状图'
        },
          xAxis: {
            type: 'category',
            data: ['文章', '分类', '评论', '友链', '相册','标签']
          },
          yAxis: {
            type: 'value'
          },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c}"
        },
          series: [{
            name: '博客信息',
            type: 'pie',
            data: [
              {
                value: articleCount,
                  itemStyle: {
                color: '#706fd3'
              }
              },
              {
                value: friendsCount,
                  itemStyle: {
                color: '#0099FF'
              }
              },
              {
                value: commentCount,
                  itemStyle: {
                color: '#ffda79'
              }
              },
              {
                value: categoriesCount,
                  itemStyle: {
                color: '#ff7675'
              }
              },
            {
                value: imageCount,
                  itemStyle: {
                color: '#61A0A8'
              }
              },
              {
                value: labelsCount,
                  itemStyle: {
                color: '#55E6C1'
              }
              },
            ],
            type: 'bar'
          }]
        };
      // 使用刚指定的配置项和数据显示图表。
      this.chartLine.setOption(option);
    },
    indexUserInfoVia(){
      api.LoginGet().then(result => {
        if (result.data.code === api.success_code) {
          this.userInfo.userName = result.data.data.userFromToken.userName;
          this.userInfo.id = result.data.data.userFromToken.id;
          this.userInfo.email = result.data.data.userFromToken.email;

      api.imageCountApi(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.imageCount=result.data.data.imageCount;
          }
      });
       api.articleCountApi(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.articleCount=result.data.data.articleCount;
          }
      });
       api.commentCountApi(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.commentCount=result.data.data.commentCount;
          }
      });
       api.categoriesCountApi(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.categoriesCount=result.data.data.categoriesCount;
          }

      });
       api.labelsCountPar(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.labelsCount=result.data.data.LabelsCount;
          }
          // console.log(this.labelsCount);
      });
      api.friendsCountApi(this.userInfo.id).then(result=>{
          if (result.data.code===api.success_code){
            this.friendsCount=result.data.data.friendsCount;
          }
      this.drawPieChart(this.articleCount,this.friendsCount,this.categoriesCount,this.commentCount,this.imageCount);
      this.initCharts(this.articleCount,this.friendsCount,this.categoriesCount,this.commentCount,this.imageCount,this.labelsCount);
      });
        } else {
          return this.$message.error("用户加载失败!")
        }
      });
    },
    formatDateArticle(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy/MM/dd');
    },
    drawPieChart(articleCount,friendsCount,categoriesCount,commentCount,imageCount) {
      // 基于准备好的dom，初始化echarts实例
      this.chartPie = echarts.init(document.getElementById('chartPie'));
      // 指定图表的配置项和数据
      this.chartPie.setOption({
        title: {
          text: 'Tomorrow',
          subtext: '博客信息',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['文章', '友链', '分类', '评论', '相册']
        },
        series: [
          {
            name: '博客信息',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['51%', '50%'],
            data: [
              { value: articleCount, name: '文章' },
              { value: friendsCount, name: '友链' },
              { value: categoriesCount, name: '分类' },
              { value: commentCount, name: '评论' },
              { value: imageCount, name: '相册' }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
  },
  mounted() {
    this.initCharts();
    // this.drawPieChart();
    this.indexUserInfoVia();
  }
}
</script>
<style lang="css" scoped>
  @import "css/blog-index.css";
</style>
