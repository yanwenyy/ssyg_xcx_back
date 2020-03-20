<template>
  <div class="mod-config">
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="试用期时间" prop="basicvalue">
        <el-input v-model="dataForm.basicvalue" style="width:200px" type="number"></el-input><span> 天</span>
        <p style="color: #ccc">请填写数字，设置区间为1-365天</p>
      </el-form-item>
      <el-form-item style="text-align: left;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data(){
      let probationTime = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (1>value||value>365) {
          callback(new Error("设置区间为1-365"));
        } else {
          callback();
        }
      };
      return {
        dataForm:{
          basicvalue:''
        },
        dataRule:{
          basicvalue:[
            { required: true, message: '请填写试用期时间', trigger: 'blur' },
            {validator: probationTime}
          ]
        }
      }
    },
    mounted(){
        this.$http({
          url: this.$http.adornUrl(`biz/try/info/1`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.basicvalue=data.data.basicvalue
        })

    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm(`您确定要保存修改吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl('/biz/try/update'),
                method: 'post',
                data: this.$http.adornData({
                  'basicvalue':this.dataForm.basicvalue
                })
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })

                } else {
                  if(data.message==undefined){
                    this.$message.error(data.msg)
                  }else{
                    this.$message.error(data.message)
                  }
                }
              })
            }).catch(() => {})

          }
        })
      }
    }
  }
</script>
