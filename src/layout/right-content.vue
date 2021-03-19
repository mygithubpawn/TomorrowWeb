<template>
  <!--  右边内容-->
  <div class="right-content-container">
<!--    <div class="content-title-box" v-text="">&nbsp;</div>-->
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "right-content"
  }
</script>

<style scoped>
  .content-title-box {
    padding: 10px;
    color: darkorchid;
    font-size: 20px;
    line-height: 30px;
  }

  .content-container-box {
    font-size: 14px;
  }
</style>
