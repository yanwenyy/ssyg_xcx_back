<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select
          v-model="dataForm.policyDate"
          clearable
          placeholder="辅导月份" style="width: 150px">
          <el-option v-for="item in monthList"
                     :label="item.policyDateKey"
                     :value="item.policyDateKey"
                     :key="item.policyDateValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
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
        label="政策ID">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="政策">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDateFormat"
        header-align="center"
        align="center"
        label="上线时间">
      </el-table-column>
      <el-table-column
        prop="pubMin"
        header-align="center"
        align="center"
        label="适用范围">
      </el-table-column>
      <el-table-column
        prop="punchRatio"
        header-align="center"
        align="center"
        label="打卡">
      </el-table-column>
      <el-table-column
        prop="questionNum"
        header-align="center"
        align="center"
        label="题量">
      </el-table-column>
      <el-table-column
        prop="testRatio"
        header-align="center"
        align="center"
        label="考试">
      </el-table-column>
      <el-table-column
        prop="relatedNum"
        header-align="center"
        align="center"
        label="相关">
      </el-table-column>
      <el-table-column
        prop="relatedNoNum"
        header-align="center"
        align="center"
        label="不相关">
      </el-table-column>
      <el-table-column
        prop="noEvaluationNum"
        header-align="center"
        align="center"
        label="未评估">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="50"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'policy-data-view',query:{id:scope.row.id} })">查看</el-button>
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
          policyDate:''
        },
        dataList: [],
        monthList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
      this. monthData()
    },
    methods: {
      //辅导月份

      monthData(){
        this.$http({
          url: this.$http.adornUrl('/biz/policypack/list/allMonth'),
          method: 'post',
          params: this.$http.adornData()
        }).then(({data}) => {
          var dataList = []
          for (var i = 0; i < data.data.length; i++) {
            dataList.push(data.data[i]);
          }
          this.monthList = dataList
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/policyCoachingDataList'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'policyDate':this.dataForm.policyDate || undefined
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
