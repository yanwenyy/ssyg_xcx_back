<template>
  <div class="mod-policy">
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-unscramble-view',query:{id:dataForm.policyId} })">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend-view',query:{id:dataForm.policyId} })">深度解读</li>
      <li class="pack">对比解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-official-view',query:{id:dataForm.policyId} })">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <div v-for="(listParts, index) in dataForm.listParts" v-model="dataForm.listParts" :key="reld">
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px;position: relative">模块 {{index+1}}</h2>
        <el-form-item>
          <template>
          </template>
        </el-form-item>
        <el-form-item label="内容" :prop="'content'+index">
          <div style="border: 1px solid #ccc" v-html="dataForm.listParts[index].content"></div>
        </el-form-item>
        <el-form-item label="相关政策">
          <div v-for="(relativePolicys, policysIndex) in dataForm.listParts[index].relativePolicys">
            <div style="background: #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].policyId"></el-input></el-form-item>
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].title"></el-input></el-form-item>
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].fileNum"></el-input></el-form-item>
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center;margin-top: 50px">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElButton from "element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
      ElFormItem
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        partIndex:0,
        timer:'',
        reld:'',
        dataForm:{
          id:'',
          policyId:this.$route.query.id,
          listParts: [],
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policydepth/info/extend/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.listParts=data.data

          if(data.data.length==0){
            this.dataForm.id=undefined
          }else{
            this.dataForm.id=data.data[0].id
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

