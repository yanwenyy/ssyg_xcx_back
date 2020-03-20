<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" style="width:400px" type="number" ></el-input>
        <p style="color: #ccc">价格为小数点后两位，例如：365.00</p>
      </el-form-item>
      <el-form-item label="权限" prop="purview">
        <el-select v-model="dataForm.purview" placeholder="请选择权限">
          <el-option
            v-for="item in purviewList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark"  type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
        <p style="color: #ccc">可记录该商品相关备注，最多200字</p>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ElInput from "element-ui/packages/input/src/input";
  export default {
    components: {ElInput},
    inject:['removeTabHandle'],
    data(){
      let validatePrice = (rule, value, callback) => {
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
        titleTxt:"新增",
        id:this.$route.query.id || undefined,
        dataForm:{
          remark:'',
          goodsName:'',
          price:'',
          purview:''
        },
        purviewList:[{'value':"123",'name':'123'}],
        dataRule:{
          goodsName: [
            { required: true, message: '商品名称不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请填写价格', trigger: 'blur' },
            { validator: validatePrice}
          ],
          purview:[
            { required: true, message: '权限不能为空', trigger: 'blur' }
          ]

        }
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.titleTxt="编辑"
        this.$http({
          url: this.$http.adornUrl(`/biz/goods/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.price=data.data.price
          this.dataForm.goodsName=data.data.goodsName
          this.dataForm.purview=data.data.purview
          this.dataForm.remark=data.data.remark
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
            this.$http({
              url: this.$http.adornUrl(`/biz/goods/${!this.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'goodsId': this.id || undefined,
                'price':this.dataForm.price,
                'goodsName':this.dataForm.goodsName,
                'remark':this.dataForm.remark || undefined,
                'purview':this.dataForm.purview
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({"name": "goods-goods"})
                  }
                })

              } else {
                if(data.message==undefined){
                  this.$message.error(data.msg)
                }else{
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
<style>
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
</style>
