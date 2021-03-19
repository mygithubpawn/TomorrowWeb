<template>
  <div class="community-top-box clear-fix">
   <NavigationBar></NavigationBar>
    <div style="margin-top: 60px">
      <div style="height: 40px;width: 100%"></div>
      <community-list></community-list>
    </div>
    <comm-bottom></comm-bottom>
  </div>
</template>

<script>
    import NavigationBar from "./arctieVim/navigation-bar";

    export default {
        name: "Rivers-and-lakes",
      components: {NavigationBar},
    }
</script>

<style lang="css" scoped>
  @import "css/rivers-and-lakes.css";
</style>
