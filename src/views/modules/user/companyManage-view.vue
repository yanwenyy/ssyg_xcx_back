<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">

      <div class="two-title">企业信息</div>
      <el-form-item label="企业ID">
        <el-input v-model="id" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业性质">
        <el-input v-model="dataForm.companynature" :disabled="true" placeholder="行业"></el-input>
      </el-form-item>
      <el-form-item label="规模">
        <el-input v-model="dataForm.companyscale" :disabled="true" placeholder="地区"></el-input>
      </el-form-item>
      <el-form-item label="行业">
        <el-input v-model="dataForm.tradeName" :disabled="true" placeholder="行业"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="dataForm.province+dataForm.city" :disabled="true" placeholder="地区"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dataForm.createtime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <div class="two-title">企业权益</div>
      <el-form-item label="会员状态">
        <el-input v-model="dataForm.vipStatus" :disabled="true" placeholder="会员状态"></el-input>
      </el-form-item>
      <el-form-item label="会员时间">
        <el-date-picker
          v-model="dataForm.vipStartDate"
          type="date"
          :disabled="true"
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
        <el-input v-model="dataForm.amount" :disabled="true" placeholder="付款金额"></el-input>
      </el-form-item>
      <div class="two-title">企业人员</div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;margin-bottom: 30px">
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>

        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="realname"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="role"
          header-align="center"
          align="center"
          label="用户角色">
          <template slot-scope="scope"> {{scope.row.role==0?'管理员':'员工'}}</template>
        </el-table-column>
        <el-table-column
          prop="positiotn"
          header-align="center"
          align="center"
          label="职务">
        </el-table-column>
        <el-table-column
          prop="trade"
          header-align="center"
          align="center"
          label="行业">
        </el-table-column>
        <!--<el-table-column
          prop="vipStatus"
          header-align="center"
          align="center"
          label="会员状态">
          <template slot-scope="scope"> {{scope.row.vipStatus=0?'有效':'过期'}}</template>
        </el-table-column>-->
        <el-table-column
          prop="bindingTime"
          header-align="center"
          align="center"
          :formatter="commonDate.formatTime"
          label="加入企业时间">
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

        },
        dataList: [],
        pageIndex: 1,
        pageSize: 30,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/company/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.dataForm = datas;
          }
        });
        this.getDataList();
      }

    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/biz/user/enterpriselist'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'companyId': this.id
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
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
