<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{txtitle}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="two-title">企业权益</div>
      <el-form-item label="企业ID">
        <el-input v-model="companyid" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="选择商品" prop="goodsid">
        <el-select v-model="dataForm.goodsid" @change="getPurview" placeholder="选择商品" :disabled="goodsChoice">
          <el-option
            v-for="item in goodsList"
            :key="item.goodsId"
            :label="item.goodsName"
            :value="item.goodsId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品ID" v-show="false">
        <el-input v-model="dataForm.goodsid" :disabled="true" placeholder="商品ID"></el-input>
      </el-form-item>
      <el-form-item label="会员权限">
        <el-input v-model="dataForm.purview" :disabled="true" placeholder="会员权限"></el-input>
      </el-form-item>
      <el-form-item label="会员开始时间" prop="vaildstarttime">
        <el-date-picker
          v-model="dataForm.vaildstarttime"
          type="date"
          @change="vipStart"
          :picker-options="start_Date"
          placeholder="选择日期" :disabled="vipStatusFn()">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员结束时间">
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
      <el-form-item label="付款金额" prop="sum">
        <el-input type="number" v-model="dataForm.sum" style="width: 400px"   placeholder="付款金额"></el-input>
        <p style="color: #ccc;margin: 0">请填写小数点后两位如：9800.00</p>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="closePage()">取消</el-button>
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
      let validatePrice = (rule, value, callback) => {
        console.log(1)
        var ArrMen= String(value).split(".");    //截取字符串
        if(ArrMen.length==2){
          if(ArrMen[1].length<2||ArrMen[1].length>2){    //判断小数点后面的字符串长度
            callback(new Error("请输入小数点后两位"));
          }else{
            callback();
          }
        }else{
          callback(new Error("请输入小数点后两位"));
        }
      };
      return {
        start_Date: { //时间限制
          disabledDate: time => {
            if(this.$route.query.uuid!=undefined){
              return time.getTime() < Date.now()-8.64e7;
            }
          }
        },
        companyid:this.$route.query.id,
        uuid:this.$route.query.uuid,
        companyname:'',
        vipStatus:this.$route.query.vipStatus,
        txtitle:'新增',
        goodsChoice:false,
        dataForm:{
          goodsid:'',
          purview:'',
          purviewName:'',
          coachendtime: "",
          coachstarttime: "",
          vaildstarttime: "",
          vaildlasttime: "",
          sum:''
        },
        dataRule:{
          goodsid:[
            { required: true, message: '请选择商品', trigger: 'blur' }
          ],
          vaildstarttime: [
            { required: true, message: '请选择会员开始时间', trigger: 'blur' }
          ],
          sum: [
            { required: true, message: '请填写付款金额', trigger: 'blur' },
            { validator: validatePrice}
          ]
        },
        goodsList:[]//商品
      }
    },
    components: {
      VDistpicker
    },
    mounted(){
        this.$http({
          url: this.$http.adornUrl(`/biz/company/info/${this.companyid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.companyname = datas.companyname;
          }
        });
      this.$http({
        url: this.$http.adornUrl(`/biz/goods/goodlist`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code == 200) {
          this.goodsList = data.data;
        }
      });
      if(this.uuid!=undefined){
        this.txtitle='续费'
        this.$http({
          url: this.$http.adornUrl(`/biz/orderdetail/info/${this.uuid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.goodsChoice=true
            this.dataForm.goodsid = data.data.goodsid;
            this.dataForm.purview = data.data.purview;
          }
        }).then(() =>{
          this.$http({
            url: this.$http.adornUrl(`/biz/orderdetail/caculateTime`),
            method: 'post',
            params: this.$http.adornParams({
              'goodsId':this.dataForm.goodsid,
              'companyId':this.companyid
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.dataForm.vaildstarttime=data.data.vipStart;
              this.dataForm.vaildlasttime=data.data.vipEnd;
              this.dataForm.coachstarttime=data.data.coachStart;
              this.dataForm.coachendtime=data.data.coachEnd;
            }
          });
        });

      }
    },
    methods:{
      vipStatusFn(){
        if(this.vipStatus!="有效"){
          return false
        }else{
          return true
        }
      },
      // 表单提交
      dataFormSubmit () {
        var ajaxUrl='/biz/orderdetail/save'
        if(this.uuid!=undefined){
          ajaxUrl='/biz/orderdetail/renew'
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`${ajaxUrl}`),
              method: 'post',
              data: this.$http.adornData({
                'companyId':this.companyid,
                'goodsid':this.dataForm.goodsid,
                'sum': this.dataForm.sum,
                'coachendtime': this.dataForm.coachendtime,
                'coachstarttime': this.dataForm.coachstarttime,
                'vaildstarttime':this.dataForm.vaildstarttime ,
                'vaildlasttime': this.dataForm.vaildlasttime,
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
      // 选择商品对应权限
      getPurview (e){
        this.$http({
          url: this.$http.adornUrl(`/biz/goods/goodinfo/${e}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataForm.purview = data.data.purview;
          }
        })
      },

      //会员时间变化的时候
      vipStart(e){
        if(this.dataForm.goodsid!=''){
          var date=e.toLocaleDateString();
          date=date.split("/").join("-");
          this.$http({
            url: this.$http.adornUrl('/biz/company/calculate'),
            method: 'get',
            params: this.$http.adornParams({
              'vipStart':date,
              'goodsId':this.dataForm.goodsid
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.dataForm.vaildstarttime=this.commonDate.formatDate('', '', data.data.vipStart);
              this.dataForm.vaildlasttime=this.commonDate.formatDate('', '', data.data.vipEnd);
              this.dataForm.coachstarttime=this.commonDate.formatDate('', '', data.data.coachStart);
              this.dataForm.coachendtime=this.commonDate.formatDate('', '', data.data.coachEnd);
            }
          })
        }else {
          this.$message.error('请选择商品')
          this.dataForm.vaildstarttime=''
        }

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
