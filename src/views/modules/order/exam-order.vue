<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="订单号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.makeupdate"
          clearable
          placeholder="补考月份" style="width: 150px">
          <el-option v-for="item in makeupdateList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyid" placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyname" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.online"
          clearable
          placeholder="支付方式" style="width: 150px">
          <el-option v-for="item in onlineList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickname" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付时间：">
        <el-date-picker
          v-model="timeS"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="60"
        label="订单号码">
      </el-table-column>
      <el-table-column
        prop="makeupdateformat"
        header-align="center"
        align="center"
        width="60"
        label="补考日期">
      </el-table-column>
      <el-table-column
        prop="nickname"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="companyid"
        header-align="center"
        align="center"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="companyname"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="sum"
        header-align="center"
        align="center"
        label="实付">
      </el-table-column>
      <el-table-column
        prop="onlinename"
        header-align="center"
        align="center"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="paysuctime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="支付时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          makeupdate:'',
          id:'',
          productid:'',
          companyid:'',
          companyname:'',
          online:'',
          phone:'',
          nickname:'',
          begin:'',
          end:''
        },
        timeS:[],
        makeupdateList:[],
        onlineList:[{name:'微信',value:"0"},{name:'线下',value:"1"}],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.getDataList()
    },
    mounted() {
      //补考月份
      this.$http({
        url: this.$http.adornUrl('/biz/wxorder/listForDate'),
        method: 'post',
        data: this.$http.adornData()
      }).then(({data}) => {
        for(var i=0;i<data.data.length;i++){
          console.log(data.data[i])
          this.makeupdateList.push({
            'name':data.data[i],
            'value':data.data[i]
          })
        }

      })
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if(this.timeS.length!=0){
          this.dataForm.begin=this.timeS[0]
          this.dataForm.end=this.timeS[1]
        }
        this.$http({
          url: this.$http.adornUrl('/biz/wxorder/listForResit'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'id':this.dataForm.id || undefined,
            'productid':this.dataForm.productid || undefined,
            'companyid':this.dataForm.companyid || undefined,
            'companyname':this.dataForm.companyname || undefined,
            'online':this.dataForm.online || undefined,
            'phone':this.dataForm.phone || undefined,
            'nickname':this.dataForm.nickname || undefined,
            'begin':this.dataForm.begin || undefined,
            'end':this.dataForm.end || undefined,
            'makeupdate':this.dataForm.makeupdate || undefined,
            'prop':'paysuctime',
            'order':'desc'
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
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      }
    }
  }
</script>
