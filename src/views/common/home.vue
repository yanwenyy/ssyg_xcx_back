<template>
  <div class="mod-home">
    <img src="~@/assets/img/back_home.png" alt="">
  </div>
</template>

<script>
  export default {
    mounted(){
      if ( this.$route.query.source ) {
        alert(this.$route.query.source);
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
    text-align: center;
    padding:3rem 0;
  }
  .mod-home>img{
    width:40%;
  }
</style>

