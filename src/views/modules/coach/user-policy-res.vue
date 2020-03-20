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
        <el-input v-model="dataForm.realName" placeholder="真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.role"
          clearable
          placeholder="用户类型" style="width: 150px">
          <el-option v-for="item in roleList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyId" placeholder="政策ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyTitle" placeholder="政策" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
      </el-form-item>
    </el-form>
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
        label="序号">
        <template slot-scope="scope">{{totalPage-scope.$index-(pageIndex-1)*10}}</template>
      </el-table-column>
      <el-table-column
        prop="policyId"
        header-align="center"
        align="center"
        label="政策ID">
      </el-table-column>
      <el-table-column
        prop="policyTitle"
        header-align="center"
        align="center"
        label="政策">
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
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="punchStatusName"
        header-align="center"
        align="center"
        label="打卡">
      </el-table-column>
      <el-table-column
        prop="relatedName"
        header-align="center"
        align="center"
        label="报告结果">
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
        prop="noAnswer"
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
          realName: '',
          phone:'',
          policyTitle:'',
          policyId:'',
          role:'',
          policyDate:''
        },
        roleList:[{name:'管理层',value:'0'},{name:'员工层',value:'1'}],
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
    },
    mounted() {
      //辅导月份
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
    methods: {
      //重置搜索条件
      resetForm(){
        this.dataForm={
          realName: '',
          phone:'',
          policyTitle:'',
          policyId:'',
          role:'',
          policyDate:''
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/coachResultsOfUserPolicyList'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'realName': this.dataForm.realName || undefined,
            'phone':this.dataForm.phone || undefined,
            'policyTitle':this.dataForm.policyTitle || undefined,
            'role':this.dataForm.role || undefined,
            'policyId':this.dataForm.policyId || undefined,
            'policyDate':this.dataForm.policyDate || undefined,
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
