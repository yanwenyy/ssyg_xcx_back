<template>
  <div class="mod-policy">
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-report-expert',query:{id:dataForm.policyId} })">专家预测</li>
      <li class="pack">参考意见</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
    <el-form label-position="right" :model="dataForm" ref="dataForm">
      <h3 style="line-height: 36px;padding-left: 10px">您的建议或意见参考</h3>
      <el-form-item prop="content">
        <template>
          <UEditor :key="'editor_report_idea'"  :id='"editor_report_idea"':val="dataForm.policyId" :index="0" :econtent="dataForm.opinion" :modelname="'report_idea'" @func="editorContent" ></UEditor>
        </template>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
  import UEditor from '@/components/ueditor/ueditor.vue'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
      UEditor
    },
    inject:['removeTabHandle'],
    data(){
      return {
        dataForm:{
          policyId:parseInt(this.$route.query.id) || undefined,
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
          if(data.code==200&&data.data!=null){
            this.dataForm.opinion=data.data.opinion
            this.dataForm.id=data.data.id
          }
        })
      }
    },
    methods:{
      //获取富文本内容
      editorContent(modelname,index,content){
        this.dataForm.opinion=content
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/report/save`),
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

