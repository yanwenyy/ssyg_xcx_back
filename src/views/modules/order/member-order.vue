<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="订单号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.productname"
          clearable
          placeholder="商品名称" style="width: 150px">
          <el-option v-for="item in productidList"
                     :label="item.goodsName"
                     :value="item.goodsName"
                     :key="item.goodsId" >
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
      :default-sort = "{prop: 'paysuctime', order: 'desc'}"
      @sort-change='sortChange'
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="60"
        label="订单号码">
      </el-table-column>
      <el-table-column
        prop="productname"
        header-align="center"
        align="center"
        width="60"
        label="商品名称">
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
        prop="nickname"
        header-align="center"
        align="center"
        label="付款人昵称">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="付款人手机号">
      </el-table-column>
      <el-table-column
        prop="sum"
        header-align="center"
        align="center"
        label="实付">
      </el-table-column>
      <el-table-column
        prop="operateaccount"
        header-align="center"
        align="center"
        label="操作账户">
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
        sortable="custom"
        :formatter="commonDate.formatTime"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="coachendtimeformat"
        header-align="center"
        align="center"
        sortable="custom"
        label="辅导截止月份">
      </el-table-column>
      <el-table-column
        prop="vaildlasttimeformat"
        header-align="center"
        align="center"
        sortable="custom"
        label="会员到期日期">
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
          id:'',
          productname:'',
          companyid:'',
          companyname:'',
          online:'',
          nickname:'',
          begin:'',
          end:'',
          phone:''
        },
        timeS:[],
        productidList:[],
        onlineList:[{name:'微信',value:0},{name:'线下',value:1}],
        dataList: [],
        prop:'paysuctime',
        order:'desc',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    mounted() {
      //商品名称下拉框
      this.$http({
        url: this.$http.adornUrl('/biz/wxorder/listForGoods'),
        method: 'post',
        data: this.$http.adornData()
      }).then(({data}) => {
        this.productidList = data.data
      })
    },
    methods: {
      //排序
      sortChange (column, prop, order){
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.prop=column.prop
        this.order=column.order
        this.getDataList ()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if(this.timeS.length!=0){
          this.dataForm.begin=this.timeS[0]
          this.dataForm.end=this.timeS[1]
        }
        this.$http({
          url: this.$http.adornUrl('/biz/wxorder/listForMember'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'id':this.dataForm.id || undefined,
            'productname':this.dataForm.productname || undefined,
            'companyid':this.dataForm.companyid || undefined,
            'companyname':this.dataForm.companyname || undefined,
            'online':this.dataForm.online || undefined,
            'phone':this.dataForm.phone || undefined,
            'nickname':this.dataForm.nickname || undefined,
            'begin':this.dataForm.begin || undefined,
            'end':this.dataForm.end || undefined,
            'prop':this.prop ,
            'order':this.order
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
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/userqu/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
