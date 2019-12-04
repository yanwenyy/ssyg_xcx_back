<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="辅导期名称" prop="title">
        <el-input v-model="dataForm.title" placeholder="请输入辅导期名称" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="对应月份" prop="policyDate">
        <el-date-picker
          v-model="dataForm.policyDate"
          type="month"
          :disabled="disabledStatus"
          value-format="yyyy-MM"
          placeholder="选择对应月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上线时间" prop="onlineTime">
        <el-date-picker
          v-model="dataForm.onlineTime"
          type="datetime"
          :disabled="disabledStatus"
          value-format="yyyy-MM-dd HH-mm-ss"
          placeholder="选择上线时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  inject:['removeTabHandle'],
  data(){
    return {
      titleTxt:"新增",
      disabledStatus:false,
      dataForm:{
        title:'',
        policyDate:'',
        onlineTime:'',
        id:this.$route.query.id || undefined
      },
      dataRule:{
        title: [
          { required: true, message: '辅导期名称不能为空', trigger: 'blur' }
        ],
        policyDate: [
          { required: true, message: '对应月份不能为空', trigger: 'blur' }
        ],
        onlineTime: [
          { required: true, message: '上线时间不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined){
      this.titleTxt="编辑"
      this.$http({
        url: this.$http.adornUrl(`/biz/policypack/info/${this.dataForm.id}`),
        method: 'get',
        data: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.title=data.data.title
        this.dataForm.policyDate=data.data.policyDate
        this.dataForm.onlineTime=data.data.onlineTime
        if(data.data.status!=0){
          this.disabledStatus=true
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
          if(this.dataForm.policyDate.substr(7,3)!="-02"){
            this.dataForm.policyDate=this.dataForm.policyDate+'-02'
          }
          this.$http({
            url: this.$http.adornUrl(`/biz/policypack/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornParams({
              'id': this.dataForm.id || undefined,
              'title': this.dataForm.title,
              'policyDate': this.dataForm.policyDate,
              'onlineTime': this.dataForm.onlineTime
            })
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
              if (data.message == undefined) {
                this.$message.error(data.msg)
              } else {
                this.$message.error(data.message)
              }

            }
          })
        }
      })
    }
  }
}
</script>
