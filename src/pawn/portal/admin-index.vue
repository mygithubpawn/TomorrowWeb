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
            <span><i class="fa fa-user-circle" aria-hidden="true"></i></span>
            <span>用户</span>
          </div>
          <div class="blog-user-quantity">
            <span>{{userCount}}&nbsp;<i class="fa fa-user-o" aria-hidden="true"></i></span>
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
        <div class="blog-user-image">
          <div class="blog-user-tor">
            <span><i class="fa fa-cloud-upload" aria-hidden="true"></i></span>
            <span>图片上传</span>
          </div>
          <div class="blog-user-quantity">
            <span>{{imageCount}}&nbsp;<i class="fa fa-picture-o" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div style="border: 1px solid #E1E1E1">
      <div class="float-left" id="chartPie" style="width: 40%;height: 60vh;margin-top: 20px">
      </div>
      <div class="float-right" id="chartLineBox" style="width: 40%;height: 60vh;margin-right: 15px;margin-top: 20px"></div>
    </div>
  </div>
</template>

<script>
    const echarts = require('echarts');
    import * as api from "../../api/api";
    import * as dateUtils from "../../utils/date";
    export default {
        name: "admin-index",
      data(){
          return{
            imageCount:'',
            articleCount:'',
            commentCount:'',
            userCount:'',
            userInfo:{
              roles:'',
            }
          }
      },
      methods:{
        initCharts(articleCount,userCount,commentCount,imageCount) {
          this.chartLine = echarts.init(document.getElementById('chartLineBox'));
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: '网站数据',
              subtext: '柱状图'
            },
            xAxis: {
              type: 'category',
              data: ['文章', '用户', '评论', '图片上传']
            },
            yAxis: {
              type: 'value'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}"
            },
            series: [{
              name: '网站信息',
              type: 'pie',
              data: [
                {
                  value: articleCount,
                  itemStyle: {
                    color: '#706fd3'
                  }
                },
                {
                  value: userCount,
                  itemStyle: {
                    color: '#ff7675'
                  }
                },
                {
                  value: commentCount,
                  itemStyle: {
                    color: '#ffda79'
                  }
                },
                {
                  value: imageCount,
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
        adminIndexInfo(){
          api.commImageCountPar().then(result=>{
            if (result.data.code===api.success_code){
              this.imageCount=result.data.data.imageCount;
            }
          });
           api.commCommentCountPar().then(result=>{
            if (result.data.code===api.success_code){
              this.commentCount=result.data.data.commentCount;
            }
          });
          api.commArticleCountPar().then(result=>{
            if (result.data.code===api.success_code){
              this.articleCount=result.data.data.articleCountPor;
              // console.log( this.articleCount)
            }
          });
          api.commUserCountPar().then(result=>{
            if (result.data.code===api.success_code){
              this.userCount=result.data.data.userCount;
            }
            this.drawPieChart(this.articleCount,this.userCount,this.commentCount,this.imageCount);
            this.initCharts(this.articleCount,this.userCount,this.commentCount,this.imageCount);
          });
        },
        drawPieChart(articleCount,userCount,commentCount,imageCount) {
          // 基于准备好的dom，初始化echarts实例
          this.chartPie = echarts.init(document.getElementById('chartPie'));
          // 指定图表的配置项和数据
          this.chartPie.setOption({
            title: {
              text: 'Tomorrow',
              subtext: '网站信息',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['文章', '用户', '评论', '上传图片']
            },
            series: [
              {
                name: '网站信息',
                type: 'pie',
                radius: ['40%', '55%'],
                center: ['51%', '50%'],
                data: [
                  { value: articleCount, name: '文章' },
                  { value: userCount, name: '用户' },
                  { value: commentCount, name: '评论' },
                  { value: imageCount, name: '上传图片' }],
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
          this.getUserToken();
          this.adminIndexInfo();
      }
    }
</script>

<style lang="css" scoped>
  @import "../dashboard/css/blog-index.css";
</style>
