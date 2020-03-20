<template>
  <div class="mod-config">
    <h3>用户信息</h3>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="手机号">
        <el-input v-model="dataForm.phone" :disabled="true" style="width:300px"></el-input>
        <label style="margin:0 20px;width: 100px">真实姓名</label>
        <el-input v-model="dataForm.realName" :disabled="true" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="企业ID">
        <el-input v-model="dataForm.companyId" :disabled="true" style="width:300px"></el-input>
        <label style="margin:0 20px;width: 100px">企业名称</label>
        <el-input v-model="dataForm.companyName" :disabled="true" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="辅导周期">
        <el-input v-model="dataForm.packCycle" :disabled="true" style="width:300px"></el-input>
        <label style="margin:0 20px;width: 100px">辅导进度</label>
        <el-input v-model="dataForm.packRatio" :disabled="true" style="width:300px"></el-input>
      </el-form-item>
    </el-form>
    <h3>成绩概况</h3>
    <el-table
      :data="containData"
      border
      v-loading="containDataLoading"
      style="width: 60%;margin-bottom: 40px">
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
        prop="annualResults"
        label="年度成绩"
        align="center">
      </el-table-column>
      <el-table-column
        prop="repairNum"
        label="补考"
        align="center">
      </el-table-column>
    </el-table>
    <h3>辅导成绩/期</h3>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="期数">
        <template slot-scope="scope">{{totalPage-scope.$index-(pageIndex-1)*10}}</template>
      </el-table-column>
      <el-table-column
        prop="policyDateFormat"
        header-align="center"
        align="center"
        label="辅导月份">
      </el-table-column>
      <el-table-column
        prop="punchRatio"
        header-align="center"
        align="center"
        label="打卡量">
      </el-table-column>
      <el-table-column
        prop="questionRatio"
        header-align="center"
        align="center"
        label="测试量">
      </el-table-column>
      <el-table-column
        prop="questionNum"
        header-align="center"
        align="center"
        label="应测试量">
      </el-table-column>
      <el-table-column
        prop="rightNum"
        header-align="center"
        align="center"
        label="正确">
      </el-table-column>
      <el-table-column
        prop="wrongNum"
        header-align="center"
        align="center"
        label="错误">
      </el-table-column>
      <el-table-column
        prop="noAnswerNum"
        header-align="center"
        align="center"
        label="未答">
      </el-table-column>
      <el-table-column
        prop="rightRatioFormat"
        header-align="center"
        align="center"
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        uuid:this.$route.query.uuid,
        dataForm: {
          companyName:'',
          companyId:'',
          phone:'',
          realName:'',
          packRatio:'',
          packCycle:''
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
      // 获取数据列表
      getContaninDate(){
        this.containDataLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/userCoachTotalScoreDetailInfo'),
          method: 'post',
          data: this.$http.adornData({
            "uuid":this.uuid
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataForm=data.data
            var n=new Array(data.data)
            this.containData=n
          }
        })
        this.containDataLoading = false
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/userCoachTotalScoreDetailInfoList'),
          method: 'post',
          data: this.$http.adornData({
            "uuid":this.uuid
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
