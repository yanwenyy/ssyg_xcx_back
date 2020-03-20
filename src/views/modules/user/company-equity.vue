<template>
  <div class="mod-policy-pack">
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <div class="two-title" style="border-bottom: 1px solid #ccc;padding-bottom: 20px">权益管理 <el-button style="margin-left: 20px" type="warning" @click="$router.push({ name: 'company-equity-add',query:{id:$route.query.id} })" >新增权益</el-button></div>
      <el-form-item label="企业ID">
        <el-input v-model="companyId" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>


      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;margin-bottom: 30px">
        <el-table-column
          header-align="center"
          align="center"
          label="序号">
          <template slot-scope="scope">{{totalPage-scope.$index}}</template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          header-align="center"
          align="center"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="purview"
          header-align="center"
          align="center"
          label="权限">
        </el-table-column>
        <el-table-column
          prop="vipStatus"
          header-align="center"
          align="center"
          label="会员状态">
        </el-table-column>
        <el-table-column
          prop="vaildstarttime"
          header-align="center"
          align="center"
          label="开通时间">
        </el-table-column>
        <el-table-column
          prop="vaildlasttime"
          header-align="center"
          align="center"
          label="截止日期">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="会员辅导周期">
          <template slot-scope="scope">{{scope.row.coachstarttime}} 至 {{scope.row.coachendtime}}</template>
        </el-table-column>
        <el-table-column
          prop="sum"
          header-align="center"
          align="center"
          label="付款金额">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button :type="Number(scope.row.status)?'info':'primary'" size="mini" :disabled="Number(scope.row.status) ? true:false" @click="$router.push({ name: 'company-equity-add',query:{id:$route.query.id,uuid:scope.row.uuid,vipStatus:scope.row.vipStatus} })">续费</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      return {
        dataListLoading: false,
        companyId:this.$route.query.id,
        dataForm:{

        },
        dataList: [],
        pageIndex: 1,
        pageSize: 30,
        totalPage: 0,
        addOrUpdateVisible: false,
      }
    },
    mounted(){
        this.$http({
          url: this.$http.adornUrl(`/biz/company/info/${this.companyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.dataForm = datas;
          }
        });
        this.getDataList();

    },
    activated () {
      this.getDataList();
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/orderdetail/list'),
          method: 'get',
          params: this.$http.adornParams({
            'companyId': this.companyId
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data
            this.totalPage = data.data.length
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
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
