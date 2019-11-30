<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">新增</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <div class="two-title">企业信息</div>
      <el-form-item label="企业名称">
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
      <el-form-item label="行业">
        <el-checkbox-group v-model="dataForm.trade">
          <el-checkbox v-for="item in tradeList" :label="item.tradeId" :key="item.tradeId">{{item.tradeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="地区">
        <v-distpicker hide-area :province="dataForm.province" :city="dataForm.city" @selected="onSelected"></v-distpicker>
      </el-form-item>
      <div class="two-title">企业权益</div>
      <el-form-item label="会员时间">
        <el-date-picker
          v-model="dataForm.vipStartDate"
          type="date"
          @change="vipStart"
          placeholder="选择日期">
        </el-date-picker>
        <span class="date-line">--</span>
        <el-date-picker
          v-model="dataForm.vaildLastTime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员辅导周期">
        <el-date-picker
          v-model="dataForm.coachStartTime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
        <span class="date-line">--</span>
        <el-date-picker
          v-model="dataForm.coachEndTime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款金额">
        <el-input v-model="dataForm.amount"   placeholder="付款金额"></el-input>
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
          amount: 0,
          city: "",
          coachEndTime: "",
          coachStartTime: "",
          companyname: "",
          companynature: "",
          companyscale: "",
          province: "",
          trade: [],
          vaildLastTime: "",
          vipStartDate: "",
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
                'amount': this.dataForm.amount,
                'city': this.dataForm.city,
                'companyname': this.dataForm.companyname,
                'companynature': this.dataForm.companynature,
                'companyscale': this.dataForm.companyscale,
                'province': this.dataForm.province,
                'vipStartDate': this.dataForm.vipStartDate,
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

      //会员时间变化的时候
      vipStart(e){
        var date=e.toLocaleDateString();
        date=date.split("/").join("-");
        this.$http({
          url: this.$http.adornUrl('/biz/company/calculate'),
          method: 'get',
          params: this.$http.adornParams({
            'vipStart':date,
          })
        }).then(({data}) => {
          console.log(data.data);
          if (data && data.code == 200) {
            this.dataForm.vaildLastTime=this.commonDate.formatDate('', '', data.data.vipEnd);
            this.dataForm.coachStartTime=this.commonDate.formatDate('', '', data.data.coachStart);
            this.dataForm.coachEndTime=this.commonDate.formatDate('', '', data.data.coachEnd);
          }
        })
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
