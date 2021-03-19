<template>
    <div class="password-index-box">
      <div class="pass-tittle">
      <span>密码修改</span>
      </div>
     <div>
       <retrieve-password></retrieve-password>
     </div>
    </div>
</template>

<script>
    export default {
        name: "reset-password",
      data(){
      }
    }
</script>

<style scoped>
  .pass-tittle{
    font-size: 18px;
    color: #009432;
    text-align: center;
    font-weight: 600;
    padding-top: 30px;
    margin: 0 20px 40px 20px;
  }
  .password-index-box{
    height: 400px;
    margin: 0 auto;
    width: 600px;
    border-radius: 4px;
    background-color: #F1F2F6;
  }
</style>
