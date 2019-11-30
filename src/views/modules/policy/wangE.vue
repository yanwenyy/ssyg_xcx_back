<template>
  <div :id="this.id" :index="this.index">

  </div>
</template>

<script>
  import Vue from 'vue'
  import WangEditor from 'wangeditor';
  export default {
    /*props: {id:{
        type: String,
      },
    index:{
      type: Number,
    },
      editorContent1:{
      type:Function
      }
    },*/
    props:['id','index','econtent','policy'],
    data(){
      return {
        //content:''
      }
    },
    mounted(){

      var that=this
      var editor = new WangEditor("#"+this.id);

      editor.customConfig.onchange = function (html) {
        // 监控变化，同步更新到 content
        //html=html.replace(/\"/g,"'");
        if(html=='<p><br></p>'){html=''}
        //this.content=html
        that.$emit('func',that.policy,that.index,html)
        //this.editorContent1(that.index,html)
      };
      //editor.txt.html(this.econtent)
      editor.customConfig.uploadImgServer =  this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`); //上传URL
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 5;
      editor.customConfig.uploadFileName = 'file';
      editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          var url ="http://"+result.url;
          insertImg(url);
        }
      };
      editor.create();
      editor.txt.html(this.econtent)
    }
  }
</script>

<style scoped>

</style>
