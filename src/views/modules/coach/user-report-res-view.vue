<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="用户信息">
        <div style="border: 1px solid #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="手机号码"><el-input style="width:220px;" :disabled="true" v-model="dataForm.phone"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="真实姓名"><el-input style="width:220px;" :disabled="true" v-model="dataForm.realName"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="企业名称"><el-input style="width:220px;" :disabled="true" v-model="dataForm.companyName"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="企业ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.companyId"></el-input></el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="关联政策">
        <div style="border: 1px solid #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policyId"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px;" :disabled="true" v-model="dataForm.title"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px;" :disabled="true" v-model="dataForm.fileNum"></el-input></el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="报告结果">
        <div style="border: 1px solid #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">

          <el-form-item label=" " style="margin: 5px 0 10px 0;color:#303133">
            <p>该政策对我司的影响度</p>
            <el-rate
              v-model="dataForm.affectExtent"
              disabled
              show-score
              text-color="#ff9900">
            </el-rate>
          </el-form-item>
          <el-form-item label=" " style="margin: 5px 0 10px 0;color:#303133">
            <p>可能对我司产生如下影响</p>
            <el-input type="textarea" :disabled="true" v-model="dataForm.affect" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label=" " style="margin: 5px 0 10px 0;color:#303133">
            <p>我的建议、意见</p>
            <el-input type="textarea" :disabled="true" v-model="dataForm.opinion" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label=" " style="margin: 5px 0 10px 0;color:#303133">
            <p>相关执行部门及执行办法</p>
            <el-input type="textarea" :disabled="true" v-model="dataForm.executive" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label="结果" style="margin: 5px 0 10px 0;color:#303133">
            <el-input type="text" :disabled="true" v-model="dataForm.relatedName" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label="提交时间" style="margin: 5px 0 10px 0;color:#303133">
            <el-input type="text" :disabled="true" v-model="dataForm.updateTime" style="width: 500px"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
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
      ElFormItem,
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        dataForm:{
          relatedName:'',
          phone:'',
          realName:'',
          companyId:'',
          companyName:'',
          updateTime:'',
          fileNum:'',
          policyId:'',
          title:'',
          id:this.$route.query.id || undefined,
          affectExtent:'',
          affect:'',
          opinion:'',
          executive:''
        },

      }
    },
    mounted(){
      if(this.dataForm.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/policyevaluation/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.disabledS=true
          this.dataForm.title=data.data.title
          this.dataForm.phone=data.data.phone
          this.dataForm.realName=data.data.realName
          this.dataForm.companyName=data.data.companyName
          this.dataForm.companyId=data.data.companyId
          this.dataForm.fileNum=data.data.fileNum
          this.dataForm.policyId=data.data.policyId
          this.dataForm.relatedName=data.data.relatedName
          this.dataForm.affectExtent=parseInt(data.data.affectExtent)
          this.dataForm.affect=data.data.affect
          this.dataForm.opinion=data.data.opinion
          this.dataForm.executive=data.data.executive
          this.dataForm.updateTime=this.commonDate.formatTime('','',data.data.updateTime)

        })
      }
    },
    methods:{
      getStatus(val){
        for(var i=0;i<this.dataForm.answerList.length;i++){
          if(i!=val){
            this.dataForm.answerList[i].status="2"
          }

        }
      },
      //数字转字母
      getStringNum(key){
        return String.fromCharCode(64 + parseInt(key))
      },
      //根据题型显示答案数量
      showModel(val){
        if(val==1||val==2){
          this.dataForm.answerList=[]
          this.dataForm.answerList.push(
            {content:'',status:'2'},
            {content:'',status:'2'},
            {content:'',status:'2'},
            {content:'',status:'2'})
        }else{
          this.dataForm.answerList=[]
          this.dataForm.answerList.push(
            {content:'',status:'2'},
            {content:'',status:'2'})
        }
      },
      //添加Part
      addAnswer:function(){
        this.dataForm.answerList.push({content:'',status:'2'})
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/policyquestion/${!this.dataForm.id ? 'save' : 'update'}`),
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

