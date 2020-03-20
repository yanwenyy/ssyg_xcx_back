<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="试题ID" v-if="disabledS==true">
        <el-input type="text" v-model="dataForm.id" style="width: 500px" :disabled="disabledS"></el-input>
      </el-form-item>
      <el-form-item label="关联政策">
          <div style="background: #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policyId"></el-input></el-form-item>
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policy.title"></el-input></el-form-item>
            <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px;" :disabled="true" v-model="dataForm.policy.fileNum"></el-input></el-form-item>
          </div>
      </el-form-item>
      <el-form-item label="题型" prop="type" :rules="{required: true, message: '题型不能为空', trigger: 'blur'}">
        <el-radio-group v-model="dataForm.type"  @change="showModel(dataForm.type)" >
          <el-radio :label="1" :disabled="disabledS">单选题</el-radio>
          <el-radio :label="2" :disabled="disabledS">多选题</el-radio>
          <el-radio :label="3" :disabled="disabledS">判断题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题干" prop="title" :rules="{required: true, message: '题干不能为空', trigger: 'blur'}">
        <el-input type="textarea" v-model="dataForm.title" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="选项">
        <div v-for="(answerList,index) in dataForm.answerList" >
          <el-form-item :prop="'answerList.' + index + '.content'" :label="getStringNum(parseInt(index+1))" :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
            <el-input type="textarea"  v-model="dataForm.answerList[index].content" style="width: 500px"></el-input>
            <!--<el-checkbox-group v-model="dataForm.answerList[index].status" v-if="dataForm.type==2">
              <el-checkbox :label="1" @change="getStatusList(index)">正确答案</el-checkbox>
            </el-checkbox-group>-->
          </el-form-item>
          <el-form-item label=" " :prop="'answerList.' + index + '.status'" :rules="{required: true, message: '请选择正确答案', trigger: 'blur'}" style="margin-top: 20px;margin-bottom: 20px">
            <el-radio-group v-if="dataForm.type==1|| dataForm.type==3" v-model="dataForm.answerList[index].status"><el-radio :label="1" :disabled="disabledS" @change="getStatus(index)">正确答案</el-radio></el-radio-group>
            <el-radio-group v-if="dataForm.type==2" v-model="dataForm.answerList[index].status"><el-radio :label="1" :disabled="disabledS">正确答案</el-radio></el-radio-group>
          </el-form-item>
        </div>
        <el-button @click="addAnswer()" v-if="dataForm.type==1|| dataForm.type==2 " :disabled="disabledS" type="warning">添加选项</el-button>
      </el-form-item>
      <el-form-item label="排序" prop="sort" :rules="{required: true, message: '排序不能为空', trigger: 'blur'}">
        <el-input type="number" v-model="dataForm.sort" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 50px">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
  import WangEditor from 'wangeditor'
  import wangE1 from './wangE'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElButton from "element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
      ElFormItem,
      'wang-e':wangE1
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        titleTxt:'新增',
        disabledS:false,
        dataForm:{
          policy:{
            title:'',
            fileNum:'',
          },
          id:this.$route.query.qid || undefined,
          policyId:this.$route.query.id,
          type:'',
          sort: '',
          answerList: [],
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.policySearch(this.dataForm.policyId)
      }
      if(this.dataForm.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/policyquestion/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.disabledS=true
          this.dataForm.title=data.data.title
          this.dataForm.type=parseInt(data.data.type)
          this.dataForm.sort=data.data.sort
          this.dataForm.answerList=data.data.answerList
          for(var i=0;i<this.dataForm.answerList.length;i++){
            this.dataForm.answerList[i].status=parseInt(this.dataForm.answerList[i].status)
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
      policySearch(val){
        if(val!=""){

          this.$http({
            url: this.$http.adornUrl(`/biz/policy/info/${val}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.policy.fileNum=data.data.fileNum
            this.dataForm.policy.title=data.data.title
            this.dataForm.policyId=data.data.id
          })
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

