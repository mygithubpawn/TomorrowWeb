<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
        reload:this.reload
      }
  },
  data(){
    return{
      isRouterAlive:true,
    }
  },
  methods:{
      reload(){
        this.isRouterAlive=false;
        this.$nextTick(function () {
          this.isRouterAlive=true;
        })
      },
  },

  // created () {
  //   setTimeout(() => {
  //     window.L2Dwidget.init({
  //       pluginRootPath: 'static/live2dw/',
  //       pluginJsPath: 'lib/',
  //       pluginModelPath: 'live2d-widget-model-koharu/assets/',
  //       tagMode: false,
  //       debug: false,
  //       model: {jsonPath: '/static/live2dw/live2d-widget-model-koharu/assets/koharu.model.json'},
  //       display: {position: 'left', width: 150, height: 300},
  //       mobile: {show: true},
  //       log: false
  //     })
  //   }, 1000)
  // },
    // 使用watch 监听$router的变化,
  mounted() {

  },
}
</script>

<style>
  #app {
    min-width: 1140px;
  }

  * {
    padding: 0;
    margin: 0;
  }

  * a {
    text-decoration: none;
    font-size: 13px;
  }

  em,
  i {
    font-style: normal;
  }

  li {
    list-style-type: none;
  }

  * img {
    border: 0;
    vertical-align: middle;
  }

  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .margin-bottom-8 {
    margin-bottom: 8px;
  }

  .clear-fix {
    overflow: auto;
    zoom: 1;
  }

  i {
    font-size: 16px;
  }

  .drawer-title {
    font-weight: 600;
    text-align: center;
    color: coral;
    font-size: 18px;
    margin: 20px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #D7D5F7;
  }

  .margin-ma-box {
    margin: 25px;
  }

  .float-right {
    float: right;
  }

  .float-left {
    float: left;
  }

  ::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    /*background-color: #ee3f4d;*/
    border-radius: 10px ;
    background-image: -webkit-linear-gradient(45deg,transparent 50%, #2BC8DA 50%, #CF7AFC 75%, transparent 75%, transparent);
  }
  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 5px #FFFFFF;
    background: #fff;
  }
</style>
