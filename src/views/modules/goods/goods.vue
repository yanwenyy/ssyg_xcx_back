<template>
  <div class="mod-goods">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('biz:goods:save')" type="warning" @click="$router.push({ name: 'goods-add-or-update' })" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">
      <el-table-column
        prop="goodsId"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="showFlag"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==0" @click="updateShowFlag(scope.row.goodsId,1)">在售</el-button>
          <el-button type="text" v-if="scope.row.status==1" @click="updateShowFlag(scope.row.goodsId,0)">停售</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        :formatter="commonDate.formatTime"
        align="center"
        width="150"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('biz:goods:info')" type="text" size="small" @click="$router.push({ name: 'goods-view',query:{id:scope.row.goodsId} })">查看</el-button>
          <el-button v-if="isAuth('biz:goods:update')" type="text" size="small" @click="$router.push({ name: 'goods-add-or-update',query:{id:scope.row.goodsId} })">编辑</el-button>
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
          title: '商品管理'
        },
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
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize)
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
      //更新显示状态
      updateShowFlag (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]商品进行[${txt ? '停售' : '在售'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ajaxUrl=''
          if(txt==1){
            ajaxUrl='/biz/goods/updateToStopSell/'
          }else{
            ajaxUrl='/biz/goods/updateToSell/'
          }
          this.$http({
            url: this.$http.adornUrl(`${ajaxUrl}${id}`),
            method: 'get'
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
        }).catch(() => {})

      }
    }
  }
</script>
