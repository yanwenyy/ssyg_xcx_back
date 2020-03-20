<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.uuid" placeholder="问题ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.content" placeholder="问题内容" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.thirdUserName" placeholder="用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phoneNum" placeholder="用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.trade"
          clearable
          placeholder="问题涉及行业" style="width: 150px">
          <el-option v-for="item in tradeList"
                     :label="item.name"
                     :value="item.name"
                     :key="item.uuid" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tax"
          clearable
          placeholder="税种" style="width: 150px">
          <el-option v-for="item in taxList"
                     :label="item.name"
                     :value="item.name"
                     :key="item.uuid" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="采纳状态" style="width: 150px">
          <el-option v-for="item in statusList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.delFlag"
          clearable
          placeholder="显示状态" style="width: 150px">
          <el-option v-for="item in delFlagList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
          v-model="dataForm.timeS"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :default-sort = "{prop: 'paysuctime', order: 'desc'}"
      @sort-change='sortChange'
      style="width: 100%;">
      <el-table-column
        prop="uuid"
        header-align="center"
        align="center"
        label="问题ID">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="问题内容">
      </el-table-column>
      <el-table-column
        prop="date"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="发布时间">
      </el-table-column>
      <el-table-column
        prop="thirdUserName"
        header-align="center"
        align="center"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        header-align="center"
        align="center"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="trade"
        header-align="center"
        align="center"
        label="问题行业">
      </el-table-column>
      <el-table-column
        prop="tax"
        header-align="center"
        align="center"
        label="税种">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="采纳状态">
        <template slot-scope="scope"> {{getStatus(scope.row.status)}} </template>
      </el-table-column>
      <el-table-column
        prop="duration"
        header-align="center"
        align="center"
        label="最快应答时长">
      </el-table-column>
      <el-table-column
        prop="delFlag"
        header-align="center"
        align="center"
        label="显示状态">
        <template slot-scope="scope"> {{scope.row.delFlag==1?'隐藏':'显示'}} </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'question-record-view',query:{id:scope.row.uuid} })">查看</el-button>
        </template>
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
          timeS:[],
          uuid:'',
          thirdUserName:'',
          content:'',
          phoneNum:'',
          trade:'',
          tax:'',
          status:'',
          delFlag:'',
          begin:'',
          end:''
        },
        statusList:[{name:'无答案',value:1},{name:'未采纳答案',value:2},{name:'已采纳并公开',value:3},{name:'已采纳不公开',value:4},{name:'未采纳平分',value:5},{name:'未回答退回',value:6},{name:'数据异常',value:7},{name:'退款异常',value:8},{name:'已纠错',value:9}],
        tradeList:'',
        dataList: [],
        taxList:[],
        delFlagList:[{name:'显示',value:'0'},{name:'隐藏',value:'1'}],

        prop:'',
        order:'',
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
    methods: {
      //重置搜索条件
      resetForm(){
        this.dataForm={
            timeS:[],
            uuid:'',
            thirdUserName:'',
            content:'',
            phoneNum:'',
            trade:'',
            tax:'',
            status:'',
            delFlag:'',
            start:'',
            end:''
          }
      },
      getStatus(key) {
        let statusTxt = '';
        switch (key) {
          case 1:statusTxt = "无答案";break
          case 2:statusTxt = "未采纳答案";break
          case 3:statusTxt = "已采纳并公开";break
          case 4:statusTxt = "已采纳不公开";break
          case 5:statusTxt = "未采纳平分";break
          case 6:statusTxt = "未回答退回";break
          case 7:statusTxt = "数据异常";break
          case 8:statusTxt = "退款异常";break
          case 9:statusTxt = "已纠错";break
        }
        return statusTxt
      },
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
        if(this.dataForm.timeS.length!=0){
          this.dataForm.start=this.dataForm.timeS[0]
          this.dataForm.end=this.dataForm.timeS[1]
        }
        this.$http({
          url: this.$http.adornUrl('/biz/question/companyQuestionList'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'uuid':this.dataForm.uuid || undefined,
            'thirdUserName':this.dataForm.thirdUserName || undefined,
            'content':this.dataForm.content || undefined,
            'phoneNum':this.dataForm.phoneNum || undefined,
            'trade':this.dataForm.trade || undefined,
            'tax':this.dataForm.tax || undefined,
            'delFlag':this.dataForm.delFlag || undefined,
            'status':this.dataForm.status || undefined,
            'start':this.dataForm.start || undefined,
            'end':this.dataForm.end || undefined,
            'prop':this.prop || undefined,
            'order':this.order || undefined
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data.data
            this.totalPage = data.data.totalCount
            this.tradeList=data.data.trades
            this.taxList=data.data.taxs
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
      }
    }
  }
</script>
