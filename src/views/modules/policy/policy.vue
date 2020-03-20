<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-popover
          ref="popover1"
          placement="bottom"
          size="mini"
          trigger="click">
          <el-button type="text" size="small" @click="$router.push({ name: 'policy-original-text-add-or-update'})">政策</el-button>
          <el-button type="text" size="small" @click="$router.push({ name: 'policy-article-add-or-update' })">文章</el-button>
        </el-popover>
        <el-button type="warning" v-if="isAuth('biz:policy:save')" v-popover:popover1 >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.type"
          clearable
          placeholder="辅导类型" style="width: 150px">
          <el-option v-for="item in typeList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.style"
          clearable
          placeholder="属性" style="width: 150px">
          <el-option v-for="item in styleList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.pubMin"
          clearable
          placeholder="适用范围" style="width: 150px">
          <el-option v-for="item in pubMinList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.delFlag"
          clearable
          placeholder="状态" style="width: 150px">
          <el-option v-for="item in delFlagList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.policyPackDate"
          clearable
          placeholder="辅导月份" style="width: 150px">
          <el-option v-for="item in monthList"
                     :label="item.policyDateKey"
                     :value="item.policyDateValue"
                     :key="item.policyDateValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fileNum" placeholder="文件号" clearable></el-input>
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
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">

      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="policyPackDate"
        header-align="center"
        align="center"
        label="辅导月份">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="fileNum"
        header-align="center"
        align="center"
        label="文件号">
      </el-table-column>
      <el-table-column
          prop="officialReleaseDate"
          header-align="center"
          align="center"
          width="120px"
          :formatter="commonDate.formatDate"
          label="官方发布日期">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="政策类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type==1">政策</span>
          <span v-if="scope.row.type==2">文章</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="styleName"
        header-align="center"
        align="center"
        label="属性">
      </el-table-column>
      <el-table-column
        prop="pubMin"
        header-align="center"
        align="center"
        label="适用范围">
        <template slot-scope="scope">
          <span v-if="scope.row.pubMin==1&&scope.row.type==1">普适型</span>
          <span v-if="scope.row.pubMin==2&&scope.row.type==1">小众型</span>
          <span v-if="scope.row.type==2">——</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="delFlagName"
        header-align="center"
        align="center"
        label="政策状态">
        <template slot-scope="scope">
          <span v-if="scope.row.delFlag==0">在线</span>
          <el-button v-if="scope.row.delFlag==1" type="text" size="small" @click="showdelFlag(scope.row.id,scope.row.policyPackDate,scope.row.type,)">隐藏</el-button>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="175"
            trigger="click">

            <el-button type="text" size="small" @click="$router.push({ name: 'policy-original-text-add-or-update',query:{id:scope.row.id} })">原文</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-unscramble',query:{id:scope.row.id} })">解读</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-evaluation',query:{id:scope.row.id} })">测评</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-report-expert',query:{id:scope.row.id} })">报告</el-button>
            <el-button v-show="scope.row.type==1" v-if="isAuth('biz:policy:update')" type="text"  slot="reference" size="small">编辑</el-button>
          </el-popover>
          <el-popover
            placement="right"
            width="175"
            trigger="click">
           <el-button type="text" size="small" @click="$router.push({ name: 'policy-original-view',query:{id:scope.row.id} })">原文</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-unscramble-view',query:{id:scope.row.id} })">解读</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-evaluation',query:{id:scope.row.id} })">测评</el-button>
            <el-button type="text" size="small" @click="$router.push({ name: 'policy-report-expert-view',query:{id:scope.row.id} })">报告</el-button>
            <el-button v-show="scope.row.type==1" v-if="isAuth('biz:policy:info')" slot="reference" type="text" size="small"  >查看</el-button>
          </el-popover>


          <el-button v-show="scope.row.type==2" v-if="isAuth('biz:policy:update')" type="text" size="small" @click="$router.push({ name: 'policy-article-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button v-show="scope.row.type==2" v-if="isAuth('biz:policy:info')" type="text" size="small" @click="$router.push({ name: 'policy-article-view',query:{id:scope.row.id} })">查看</el-button>
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
          type:'',
          style:'',
          pubMin:'',
          delFlag:'',
          title: '',
          id:'',
          policyPackDate:'',
          fileNum:''
        },
        typeList:[{label:'政策',value:1},{label:'文章',value:2}],
        styleList:[],
        pubMinList:[{label:'普适型',value:1},{label:'小众型',value:2}],
        monthList:[],
        delFlagList:[{label:'在线',value:0},{label:'隐藏',value:1}],
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
    mounted(){
      //辅导月份
      this.$http({
        url: this.$http.adornUrl('/biz/policypack/list/allMonth'),
        method: 'post',
        params: this.$http.adornData()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.monthList = dataList
      })
      //属性
      this.$http({
        url: this.$http.adornUrl('/biz/policyattribute/select'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.styleList = dataList
      })
    },
    methods: {
      //重置搜索条件
      resetForm(){
        this.dataForm={
          type:'',
            style:'',
            pubMin:'',
            delFlag:'',
            title: '',
            id:'',
            policyPackDate:'',
            fileNum:''
        }
      },
      // 隐藏按钮
      showdelFlag (id,policyPackDate,type) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${id}]进行上线操作`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/policy/save/ifshow'),
            method: 'post',
            data: this.$http.adornData({
              'id':id,
              'delFlag':0,
              'policyPackDate':policyPackDate+'-02',
              'type':type
            })
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
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/policy/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            'type':this.dataForm.type|| undefined,
            'style':this.dataForm.style|| undefined,
            'pubMin':this.dataForm.pubMin|| undefined,
            'delFlag':String(this.dataForm.delFlag) || undefined,
            'title':this.dataForm.title|| undefined,
            'id':this.dataForm.id|| undefined,
            'policyPackDate':this.dataForm.policyPackDate|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined
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
      }

    }
  }
</script>
