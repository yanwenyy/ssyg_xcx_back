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
      <el-form-item label="试题ID">
        <el-input type="text" v-model="dataForm.id" style="width: 500px" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="关联政策">
        <div style="border: 1px solid #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policyId"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policyTitle"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px;" :disabled="true" v-model="dataForm.fileNum"></el-input></el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="题型" >
        <el-radio-group v-model="dataForm.questionType" >
          <el-radio :label="1" :disabled="true">单选题</el-radio>
          <el-radio :label="2" :disabled="true">多选题</el-radio>
          <el-radio :label="3" :disabled="true">判断题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题干" >
        <el-input type="textarea" v-model="dataForm.questionTitle" :disabled="true" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="选项">
        <div v-for="(quAnswers,index) in dataForm.quAnswers" >
          <el-form-item  :label="getStringNum(parseInt(index+1))">
            <el-input type="textarea" :disabled="true" v-model="dataForm.quAnswers[index].content" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label=" "style="margin-top: 20px;margin-bottom: 20px">
            <el-radio-group v-model="dataForm.quAnswers[index].status"><el-radio :label="1" :disabled="true" @change="getStatus(index)">正确答案</el-radio></el-radio-group>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="结果">
        <el-input type="text" :disabled="true" v-model="dataForm.rigwronStatusName" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-input type="text" :disabled="true" v-model="dataForm.updateDate" style="width: 500px"></el-input>
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
          phone:'',
          realName:'',
          companyId:'',
          companyName:'',
          questionType:'',
          questionTitle:'',
          rigwronStatusName:'',
          updateDate:'',
          fileNum:'',
          policyId:'',
          policyTitle:'',
          id:this.$route.query.id || undefined,
          type:'',
          sort: '',
          quAnswers: [],
        },

      }
    },
    mounted(){
      if(this.dataForm.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/userqu/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.disabledS=true
          this.dataForm.policyTitle=data.data.policyTitle
          this.dataForm.phone=data.data.phone
          this.dataForm.realName=data.data.realName
          this.dataForm.companyName=data.data.companyName
          this.dataForm.companyId=data.data.companyId
          this.dataForm.questionType=parseInt(data.data.questionType)
          this.dataForm.rigwronStatusName=data.data.rigwronStatusName
          this.dataForm.fileNum=data.data.fileNum
          this.dataForm.policyId=data.data.policyId
          this.dataForm.questionTitle=data.data.questionTitle
          this.dataForm.updateDate=this.commonDate.formatTime('','',data.data.updateDate)
          this.dataForm.quAnswers=data.data.quAnswers
          for(var i=0;i<this.dataForm.quAnswers.length;i++){
            this.dataForm.quAnswers[i].status=parseInt(this.dataForm.quAnswers[i].status)
          }
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

