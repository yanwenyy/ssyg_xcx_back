<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-unscramble',query:{id:dataForm.policyId} })">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend',query:{id:dataForm.policyId} })">深度解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast',query:{id:dataForm.policyId} })">对比解读</li>
      <li class="pack">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">内容</h2>
        <el-form-item prop="content">
          <template>
            <div id="editor_official" v-model="dataForm.content"></div>
          </template>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
          <el-button type="info" @click="closePage()">关闭</el-button>
        </el-form-item>
    </el-form>
    <!-- </el-tab-pane>
     <el-tab-pane label="深度解读" @click="$router.push({ name: 'policy-unscramble-extend'})"></el-tab-pane>
     <el-tab-pane label="对比解读"></el-tab-pane>
     <el-tab-pane label="官方解读"></el-tab-pane>
   </el-tabs>-->
  </div>
</template>
<script>
  import Vue from 'vue'
  import WangEditor from 'wangeditor'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        dataForm:{
          policyId:this.$route.query.id || undefined,
          id:undefined,
          content:'',
        },

      }
    },
    mounted(){
      var that=this
      this.editor = new WangEditor("#editor_official");
      this.editor.customConfig.uploadImgServer =  this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`); //上传URL
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      this.editor.customConfig.uploadImgMaxLength = 5;
      this.editor.customConfig.uploadFileName = 'file';
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          // var url =result.url;
          var url ="http://"+result.url;
          insertImg(url);
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      this.editor.customConfig.onchange = function (html) {
        // 监控变化，同步更新到 content
        //html=html.replace(/\"/g,"'");
        if(html=='<p><br></p>'){html=''}
        that.dataForm.content=html
      };
      this.editor.create();
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyofficial/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.code==200&&data.data!=null){
            this.dataForm.content=data.data.content
            this.dataForm.id=data.data.id
            this.editor.txt.html(data.data.content)
          }
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/policyofficial/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closePage()
                  }
                })

              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
  .ul-tab-title{
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    padding-left: 0;
    height: 38px;
    cursor: pointer;
  }
  .ul-tab-title li{
    display: inline-block;
    line-height: 36px;
    width:100px;
    text-align: center;
    cursor: pointer;
    color: #909399;
  }
  .ul-tab-title li.pack{
    color:#409eff;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-top: 1px solid #e4e7ed;
    background:#fff;
  }
  .ul-tab-title li:hover{
    color:#409eff;
  }
</style>

