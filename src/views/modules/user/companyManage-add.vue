<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">新增</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="two-title">企业信息</div>
      <el-form-item label="企业名称" prop="companyname">
        <el-input maxlength="20" v-model="dataForm.companyname"   placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业性质">
        <el-select v-model="dataForm.companynature" placeholder="企业性质">
          <el-option
            v-for="item in companyNature"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规模">
        <el-select v-model="dataForm.companyscale" placeholder="规模">
          <el-option
            v-for="item in companyScale"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业" prop="trade">
        <el-checkbox-group v-model="dataForm.trade">
          <el-checkbox v-for="item in tradeList" :label="item.tradeId" name="trade" :key="item.tradeId">{{item.tradeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="地区">
        <v-distpicker hide-area :province="dataForm.province" :city="dataForm.city" @selected="onSelected"></v-distpicker>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import VDistpicker from 'v-distpicker'
  export default {
    inject:['removeTabHandle'],
    data(){
      return {
        id:this.$route.query.id,
        dataForm:{
          city: "",
          coachEndTime: "",
          coachStartTime: "",
          companyname: "",
          companynature: "",
          companyscale: "",
          province: "",
          trade: [],
        },
        dataRule:{
          companyname: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          trade: [
            { type: 'array', required: true, message: '请至少选择一个行业', trigger: 'change' }
          ]
        },
        tradeList:[],//行业
        companyScale:[],//规模
        companyNature:[],//性质
      }
    },
    components: {
      VDistpicker
    },
    mounted(){
      this.getTrade();
      this.getCompanyScale();
      this.getCompanyNature();
    },
    methods:{
      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.province=="北京市"||this.dataForm.province=="上海市"||this.dataForm.province=="天津市"||this.dataForm.province=="重庆市"){
          this.dataForm.province = this.dataForm.province.split("市")[0];
          this.dataForm.city = this.dataForm.city.split("城区")[0];
        }else{
          this.dataForm.province = this.dataForm.province.split("省")[0];
          this.dataForm.city = this.dataForm.city.split("市")[0];
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/save`),
              method: 'post',
              data: this.$http.adornData({
                'city': this.dataForm.city,
                'companyname': this.dataForm.companyname,
                'companynature': this.dataForm.companynature,
                'companyscale': this.dataForm.companyscale,
                'province': this.dataForm.province,
                'trade': ","+this.dataForm.trade.join(",")+",",
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList');
                    this.removeTabHandle(this.$store.state.common.mainTabsActiveName);
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //城市选择
      onSelected (e) {
        this.dataForm.province=e.province.value;
        this.dataForm.city=e.city.value
      },
      // 获取行业
      getTrade (){
        this.$http({
          url: this.$http.adornUrl('/biz/trade/select'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.tradeList = data.data;
          }
        })
      },
      // 获取规模
      getCompanyScale () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=2'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companyScale = data.data;
          }
        })
      },
      // 获取性质
      getCompanyNature () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=3'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companyNature = data.data;
          }
        })
      },

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
