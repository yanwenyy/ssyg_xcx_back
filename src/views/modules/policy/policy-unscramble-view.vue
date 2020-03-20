<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li class="pack">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend-view',query:{id:dataForm.policyId} })">延伸解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast-view',query:{id:dataForm.policyId} })">对比解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-official-view',query:{id:dataForm.policyId} })">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <div v-for="(listParts, index) in dataForm.listParts" v-model="dataForm.listParts" :key="reld">
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px;position: relative">Part {{index+1}}</h2>
        <el-form-item>
          <template>
          </template>
        </el-form-item>
        <el-form-item label="政策原文" :prop="'content'+index">
          <div style="border: 1px solid #ccc" v-html="dataForm.listParts[index].expertPart.partContent"></div>
        </el-form-item>
        <el-form-item label="解读" :prop="'resolve'+index">
          <div style="border: 1px solid #ccc"  v-html="dataForm.listParts[index].expertPart.resolve"></div>
        </el-form-item>
        <el-form-item label="音频">
          <div v-for="(expertPartVoices, voiceIndex) in dataForm.listParts[index].expertPartVoices" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" :disabled="true" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].realName"></el-input></el-form-item>
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="音频标题"><el-input style="width:220px" :disabled="true" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].title"></el-input></el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="视频" :prop="'video'+index">
          <div v-for="(expertPartVideos, videoIndex) in dataForm.listParts[index].expertPartVideos" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" :disabled="true" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].vid"></el-input></el-form-item>
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="视频标题"><el-input style="width:220px" :disabled="true" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].title"></el-input></el-form-item>
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="封面链接">
              <el-input style="width:90%" :disabled="true" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].cover"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
      </div>
      <div>
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">政策背景</h2>
        <el-form-item prop="content">
            <div v-html="dataForm.content"></div>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="info" @click="closePage()">关闭</el-button>
        </el-form-item>
      </div>

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
        partIndex:0,
        imageUrl:'',
        reld:'',
        dataForm:{
          policyId:this.$route.query.id || undefined,
          id:'',
          content:'',
          listParts: [],
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyexpert/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm=data.data
          this.dataForm.policyId=this.$route.query.id
          if(this.dataForm.listParts==null||this.dataForm.listParts==undefined){
            this.dataForm.listParts=[]
          }
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
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

