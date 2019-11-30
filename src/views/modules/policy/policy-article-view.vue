<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="政策ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate" v-if="addHide==true">
        <el-input v-model="dataForm.createDate" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="政策类型" v-if="addHide==true">
        <el-input :disabled="true" style="width:220px" value="政策"></el-input>
      </el-form-item>
      <el-form-item label="辅导月份" prop="policyPackDate">
        <el-select
          v-model="dataForm.policyPackDate"
          clearable
          :disabled="true"
          placeholder="辅导月份" style="width: 220px">
          <el-option v-for="item in monthList"
                     :label="item.policyDateKey"
                     :value="item.policyDateValue"
                     :key="item.policyDateValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" :disabled="true" clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方发布日期" prop="officialReleaseDate">
        <el-date-picker
          v-model="dataForm.officialReleaseDate"
          type="date"
          :disabled="true"
          value-format="yyyy-MM-dd"
          placeholder="选择官方发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件号" prop="fileNum">
        <el-input v-model="dataForm.fileNum" :disabled="true" clearable placeholder="请输入文件号" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方身份" prop="officialCapacity">
        <el-input :disabled="true" v-model="dataForm.officialCapacity" clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="属性" prop="style">
        <el-select
          v-model="dataForm.style"
          clearable
          :disabled="true"
          placeholder="请选择属性" style="width: 220px">
          <el-option v-for="item in styleList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政策附件" prop="annexs">
        <el-upload
          style="width: 500px"
          :headers="headers"
          action=""
          multiple
          :file-list="fileList">
        </el-upload>
      </el-form-item>
      <el-form-item label="政策原文" prop="content">
        <div v-html="dataForm.content" style="border: 1px solid #ccc"></div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        titleTxt:"新增",
        addHide:false,
        disabledStatus:false,
        monthList:[],
        styleList:[],
        fileList:[],
        dataForm:{
          id:this.$route.query.id || undefined,
          title:'',
          policyPackDate:'',
          officialReleaseDate:'',
          fileNum:'',
          officialCapacity:'',
          style:'',
          annexs:[],
          content:''
        }
      }
    },
    mounted(){
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policy/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.titleTxt="编辑"
          this.addHide=true
          this.dataForm.policyPackDate = data.data.policyPackDate+'-01'
          this.dataForm.title = data.data.title
          this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
          this.dataForm.createDate = this.commonDate.formatTime('', '', data.data.createDate)
          this.dataForm.fileNum = data.data.fileNum
          this.dataForm.officialCapacity = data.data.officialCapacity
          this.dataForm.style = data.data.style
          this.dataForm.content=data.data.content
          if (data.data.annexs.length != 0) {
            for (var i = 0; i < data.data.annexs.length; i++) {
              this.fileList.push({
                name: data.data.annexs[i].fileRealName,
                url: 'http://' + data.data.annexs[i].fileOriginalName
              })
            }
          }
        })
      }
      //辅导月份
      this.$http({
        url: this.$http.adornUrl('/biz/policypack/list/allStatusMonth'),
        method: 'post',
        data: this.$http.adornData()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.monthList = dataList
      })
      //属性
      this.$http({
        url: this.$http.adornUrl('/biz/policyattribute/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.styleList = dataList
      })
    },

    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },

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
</style>
