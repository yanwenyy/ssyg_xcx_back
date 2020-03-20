<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-unscramble-view',query:{id:dataForm.policyId} })">逐条解读</li>
      <li  @click="closePage();$router.push({ name: 'policy-unscramble-extend-view',query:{id:dataForm.policyId} })">延伸解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast-view',query:{id:dataForm.policyId} })">对比解读</li>
      <li class="pack">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">内容</h2>
      <el-form-item prop="content">
          <div v-html="dataForm.content"></div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
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
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyofficial/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.code==200) {
            if (data.data != null) {
              this.dataForm.content = data.data.content
              this.dataForm.id = data.data.id
            } else {
              this.dataForm.content = "<h2>还未添加对应解读</h2>"
            }
          }
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      }
    }
  }
</script>
<style>
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

