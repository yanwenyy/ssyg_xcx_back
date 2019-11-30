<template>
  <div class="mod-policy">
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-report-expert-view',query:{id:dataForm.policyId} })">专家预测</li>
      <li class="pack">参考意见</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" :model="dataForm" ref="dataForm">
      <el-form-item prop="content">
        <template>
          <div v-html="dataForm.opinion"></div>
        </template>
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
        dataForm:{
          policyId:this.$route.query.id || undefined,
          id:undefined,
          opinion:''
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/report/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.code==200&&data.data != null) {
            if ( data.data.opinion!=null) {
              this.dataForm.opinion=data.data.opinion
              this.dataForm.id = data.data.id
            } else {
              this.dataForm.opinion = "<h2>还未添加对应解读</h2>"
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

