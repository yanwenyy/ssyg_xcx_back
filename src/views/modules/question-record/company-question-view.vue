<template>
  <div class="mod-config">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="序号">
        <template slot-scope="scope">{{dataListLen-scope.$index}}</template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="提问人姓名">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="提问人ID">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="提问时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        uuid:this.$route.query.id,
        dataListLen:'',
        dataList: [],
        prop:'',
        order:'',
        dataListLoading: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/biz/questionrecord/recordList/${this.uuid}`),
          method: 'get',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data
            this.dataListLen = data.data.length
            this.totalPage = data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      }
    }
  }
</script>
