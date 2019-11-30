<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <div class="two-title">个人信息</div>
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.uuid" :disabled="true" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="dataForm.realname" :disabled="true" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="dataForm.username" :disabled="true" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.phone" :disabled="true" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="dataForm.province+dataForm.city" :disabled="true" placeholder="地区"></el-input>
      </el-form-item>
      <el-form-item label="行业">
        <el-input v-model="dataForm.tradeName" :disabled="true" placeholder="行业"></el-input>
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="dataForm.positiotn" :disabled="true" placeholder="职务"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dataForm.createtime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="用户角色">
        <el-input v-model="dataForm.role==0?'管理员':'员工'" :disabled="true" placeholder="用户角色"></el-input>
      </el-form-item>
      <div class="two-title">企业信息</div>
      <el-form-item label="企业ID">
        <el-input v-model="dataForm.companyid" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="加入企业时间">
        <el-date-picker
          v-model="dataForm.bindingTime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <div class="two-title">会员信息</div>
      <el-form-item label="会员状态">
        <el-input v-model="dataForm.vipStatus" :disabled="true" placeholder="会员状态"></el-input>
      </el-form-item>
      <el-form-item label="会员时间">
        <el-date-picker
          v-model="dataForm.vaildstarttime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
        <span class="date-line">--</span>
        <el-date-picker
          v-model="dataForm.vaildlasttime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员辅导周期">
        <el-date-picker
          v-model="dataForm.coachstarttime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
        <span class="date-line">--</span>
        <el-date-picker
          v-model="dataForm.coachendtime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject:['removeTabHandle'],
    data(){
      let validateJumpUrl = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.jumpUrl === "" && this.isHaveTo) {
          callback(new Error("请输入跳转链接"));
        } else {
          callback();
        }
      };
      return {
        imageUrl: '',
        id:this.$route.query.id,
        showPos:[
          {value:1, label:'首页'},
          {value:2, label:'评估页'},
        ],
        jumpLink:[
          {value:1, label:'不跳转'},
          {value:2, label:'H5'},
        ],
        dataForm:{

        }
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/user/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.dataForm = datas;
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
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 342px;
    height: 122px;
    line-height: 122px;
    text-align: center;
  }
  .avatar {
    width: 342px;
    height: 122px;
    display: block;
  }
  >>> input[type="text"]{
    width: 400px!important;
  }
  >>> input[placeholder="选择日期"]{
    width: 200px!important;
  }
  .two-title{
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .date-line{
    margin-right: 20px;
  }
</style>
