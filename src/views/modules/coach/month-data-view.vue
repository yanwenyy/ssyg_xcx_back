<template>
  <div class="mod-config">
    <h3>内容概况</h3>
    <el-table
    :data="containData"
    border
    v-loading="containDataLoading"
    style="width: 60%;margin-bottom: 40px">
      <el-table-column
        prop="policyDateFormat"
        label="辅导月份"
        align="center">
      </el-table-column>
      <el-table-column
        prop="statusName"
        label="辅导状态"
        align="center">
      </el-table-column>
      <el-table-column
        prop="policyNum"
        label="政策"
        align="center">
      </el-table-column>
      <el-table-column
        prop="articleNum"
        label="文章"
        align="center">
      </el-table-column>
      <el-table-column
        prop="questionNum"
        label="测试题"
        align="center">
      </el-table-column>
    </el-table>
    <h3>辅导概况</h3>
    <el-table
      :data="containData"
      border
      v-loading="containDataLoading"
      style="width: 60%;margin-bottom: 40px">
      <el-table-column
        prop="companyNum"
        label="当前辅导企业"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userNum"
        label="当前辅导会员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="unqualifiedNum"
        label="不合格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="qualifiedNum"
        label="合格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="excellentNum"
        label="优秀"
        align="center">
      </el-table-column>
      <el-table-column
        prop="makeUpNum"
        label="补考"
        align="center">
      </el-table-column>
    </el-table>
    <h3>人员辅导概况</h3>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change='sortChange'
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="序号">
        <template slot-scope="scope">{{totalPage-scope.$index-(pageIndex-1)*10}}</template>
      </el-table-column>
      <el-table-column
        prop="companyId"
        header-align="center"
        align="center"
        sortable="custom"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        sortable="custom"
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="punchRatio"
        header-align="center"
        align="center"
        sortable="custom"
        label="打卡">
      </el-table-column>
      <el-table-column
        prop="testRatio"
        header-align="center"
        align="center"
        sortable="custom"
        label="测试">
      </el-table-column>
      <el-table-column
        prop="related"
        header-align="center"
        align="center"
        label="评估相关政策">
      </el-table-column>
      <el-table-column
        prop="noRelated"
        header-align="center"
        align="center"
        label="评估不相关政策">
      </el-table-column>
      <el-table-column
        prop="noEvaluationNum"
        header-align="center"
        align="center"
        label="未评估">
      </el-table-column>
      <el-table-column
        prop="rightRatioFormat"
        header-align="center"
        align="center"
        sortable="custom"
        label="正确率">
      </el-table-column>
      <el-table-column
        prop="qualifiedState"
        header-align="center"
        align="center"
        label="成绩">
      </el-table-column>
      <el-table-column
        prop="repairNum"
        header-align="center"
        align="center"
        label="补考">
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
        id:this.$route.query.id,
        dataForm: {
          begin:'',
          end:''
        },
        prop:'',
        order:'',
        containData:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        containDataLoading:false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
      this.getContaninDate()
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
      getContaninDate(){
        this.containDataLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/monthlyCoachingData'),
          method: 'post',
          data: this.$http.adornData({
            "id":this.id
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            var n=new Array(data.data)
            this.containData=n
          }
        })
        this.containDataLoading = false
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/monthlyCoachingUserData'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            "id":this.id,
            'prop':this.prop || undefined,
            'order':this.order || undefined
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
