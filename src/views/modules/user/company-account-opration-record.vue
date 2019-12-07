<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.operator"  placeholder="操作人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.operatorPhone" placeholder="操作人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.beOperator" placeholder="被操作人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.beOperatorPhone" placeholder="被操作人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.operatorType" placeholder="操作属性">
          <el-option
            v-for="item in attrList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.operatorPlatform" placeholder="操作类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="seach-btn">
        <el-form-item>
          <el-button type="primary" @click="getDataList()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  type="warning" @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="operator"
        header-align="center"
        align="center"
        label="操作人姓名">
      </el-table-column>
      <el-table-column
        prop="operatorPhone"
        header-align="center"
        align="center"
        label="操作人手机号">
      </el-table-column>
      <el-table-column
        prop="adminAccount"
        header-align="center"
        align="center"
        label="操作人登陆账号">
      </el-table-column>
      <el-table-column
        prop="beOperator"
        header-align="center"
        align="center"
        label="被操作人姓名">
      </el-table-column>
      <el-table-column
        prop="beOperatorPhone"
        header-align="center"
        align="center"
        label="被操作人手机号">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="operatorType"
        header-align="center"
        align="center"
        label="操作属性">
        <template slot-scope="scope"> {{scope.row.operatorType==1?'邀请加入':(scope.row.operatorType==2?'解绑':(scope.row.operatorType==3?'删除':(scope.row.operatorType==4?'设置管理员':'取消管理员')))}} </template>
      </el-table-column>
      <el-table-column
        prop="operatorPlatform"
        header-align="center"
        align="center"
        label="操作类型">
        <template slot-scope="scope"> {{scope.row.operatorPlatform==1?'前台操作':'后台操作'}} </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './company-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          operator: '',
          operatorPhone: '',
          beOperator: '',
          beOperatorPhone: '',
          companyName: '',
          operatorType: '',
          operatorPlatform: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        typeList:[//操作类型
          {
            value: '1',
            label: '前台操作'
          },{
            value: '2',
            label: '后台操作'
          }
        ],
        attrList:[//操作属性
          {
            value: '1',
            label: '加入企业'
          },{
            value: '2',
            label: '解绑'
          },
          {
            value: '3',
            label: '删除'
          },{
            value: '4',
            label: '设置管理员'
          },{
            value: '5',
            label: '取消管理员'
          }
        ],
        trade:[]//行业
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList();
      //this.getTrade();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/companyaccountrecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'operator': this.dataForm.operator,
            'operatorPhone': this.dataForm.operatorPhone,
            'beOperator': this.dataForm.beOperator,
            'beOperatorPhone': this.dataForm.beOperatorPhone,
            'companyName': this.dataForm.companyName,
            'operatorType': this.dataForm.operatorType,
            'operatorPlatform': this.dataForm.operatorPlatform,
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
      // 获取行业
      getTrade (){
        this.$http({
          url: this.$http.adornUrl('/biz/trade/select'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.trade = data.data;
          }
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.tradeId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trade/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              if(data.message==undefined){
                this.$message.error(data.msg)
              }else{
                this.$message.error(data.message)
              }
            }
          })
        })
      },
      // 重置
      resetForm(formName) {
        this.dataForm={
          operator: '',
          operatorPhone: '',
          beOperator: '',
          beOperatorPhone: '',
          companyName: '',
          operatorType: '',
          operatorPlatform: ''
        }
      },
    }
  }
</script>
<style>
  .seach-btn{
    text-align: right;
  }
</style>
