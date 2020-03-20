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
          <el-option v-for="item in roleNameList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyTitle" placeholder="政策" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.questionId" placeholder="试题ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyId" placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.questionTitle" placeholder="题干" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.rigwronStatus"
          clearable
          placeholder="答题结果" style="width: 150px">
          <el-option v-for="item in rigwronStatusList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
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
        prop="id"
        header-align="center"
        align="center"
        width="60"
        label="序号">
        <template slot-scope="scope">{{totalPage-scope.$index-(pageIndex-1)*10}}</template>
      </el-table-column>

      <el-table-column
        prop="questionId"
        header-align="center"
        align="center"
        width="60"
        label="试题ID">
      </el-table-column>
      <el-table-column
        prop="companyId"
        header-align="center"
        align="center"
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
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="policyTitle"
        header-align="center"
        align="center"
        label="政策">
      </el-table-column>
      <el-table-column
        prop="questionTitle"
        header-align="center"
        align="center"
        label="题干">
      </el-table-column>
      <el-table-column
        prop="rigwronStatusName"
        header-align="center"
        align="center"
        label="答案结果">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="提交时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="50"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'user-question-view',query:{id:scope.row.id} })">查看</el-button>
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
          realName: '',
          phone:'',
          role:'',
          policyTitle:'',
          questionId:'',
          companyId:'',
          questionTitle:'',
          rigwronStatus:'',
          policyDate:''
        },
        monthList:[],
        roleNameList:[{name:'管理员',value:'0'},{name:'员工',value:'1'}],
        rigwronStatusList:[{name:'正确',value:'0'},{name:'错误',value:'1'}],
        dataList: [],
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
          role:'',
          policyTitle:'',
          questionId:'',
          companyId:'',
          questionTitle:'',
          rigwronStatus:'',
          policyDate:''
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/userqu/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'realName': this.dataForm.realName || undefined,
            'phone':this.dataForm.phone || undefined,
            'role':this.dataForm.role || undefined,
            'policyTitle':this.dataForm.policyTitle || undefined,
            'questionId':this.dataForm.questionId || undefined,
            'companyId':this.dataForm.companyId || undefined,
            'questionTitle':this.dataForm.questionTitle || undefined,
            'rigwronStatus':this.dataForm.rigwronStatus || undefined,
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
