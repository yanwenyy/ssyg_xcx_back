<template>
  <div class="mod-policy">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:policyquestion:save')" @click="$router.push({ name: 'question-add-or-update' })">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.policyDate"
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
        <el-select
          v-model="dataForm.type"
          clearable
          placeholder="题型" style="width: 150px">
          <el-option v-for="item in typeList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.policyDelFlag"
          clearable
          placeholder="状态" style="width: 150px">
          <el-option v-for="item in policyDelFlagList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="试题ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="题干" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
      </el-form-item>
    </el-form>
      <div v-for="(dataList, index) in dataList" >
        <div class="question_box" >
          <p  class="question_tab">
            <span class="span_title">ID：{{dataList.id}}</span><span class="span_title">{{dataList.typeName}}</span><span class="span_title">{{dataList.policyDelFlagName}}</span>
            <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" v-if="isAuth('biz:policyquestion:update')" @click="$router.push({ name: 'question-add-or-update',query:{qid:dataList.id} })">编辑</el-button>
            <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" v-if="isAuth('biz:policyquestion:delete')" v-show="dataList.policyDelFlag!=0" @click="removeQue(dataList.id)">删除</el-button>
            <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" v-if="isAuth('biz:policyquestion:info')" @click="$router.push({ name: 'policy-question-view',query:{qid:dataList.id,id:dataForm.policyId} })">查看</el-button>
          </p>
          <div class="question_indent">
            <h4>题干：{{dataList.title}}</h4>
            <p v-for="(answerList, answerIndex) in dataList.answerList">
              <span>{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}、{{answerList.content}}</span>
            </p>
            <div v-for="(answerList, answerIndex) in dataList.answerList" v-show="dataList.type!=2">
              <p style="color: orange" v-if="answerList.status==1">正确答案：{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}</p>
            </div>
            <p v-show="dataList.type==2" style="color: orange" v-if="numS(index)">正确答案：{{dataList.stringNumS}}</p>
          </div>
        </div>
      </div>
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
        monthList:[],
        typeList:[{name:'单选题',value:1},{name:'多选题',value:2},{name:'判断题',value:3}],
        policyDelFlagList:[{name:'显示',value:0},{name:'隐藏',value:1}],
        dataForm:{
          id:'',
          policyDate:'',
          policyDelFlag:'',
          type:'',
          title:''
        },
        dataList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    filters:{
      getType(key) {
        let typeTxt = '';
        switch (key) {
          case "1":typeTxt = "单选题";break
          case "2":typeTxt = "多选题";break
          case "3":typeTxt = "判断题";break
        }
        return typeTxt
      },
      getStringNum(key){
        return String.fromCharCode(64 + parseInt(key))
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
    methods:{
      //重置搜索条件
      resetForm(){
        this.dataForm={
          id:'',
          policyDate:'',
          policyDelFlag:'',
          type:'',
          title:''
        }
      },
      numS(i){
        this.dataList[i].stringNumS=[];
        for(var j=0;j<this.dataList[i].answerList.length;j++){
          if(this.dataList[i].answerList[j].status==1){
            this.dataList[i].stringNumS.push(String.fromCharCode(64 + parseInt(j+1)))
          }
        }
        this.dataList[i].stringNumS=this.dataList[i].stringNumS.join("、")
        return true
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/policyquestion/list/all'),
          method: 'Post',
          data: this.$http.adornData({

            "id":this.dataForm.id || undefined,
            'type':this.dataForm.type || undefined,
            'policyDate':this.dataForm.policyDate || undefined,
            'policyDelFlag':this.dataForm.policyDelFlag || undefined,
            'title':this.dataForm.title || undefined
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
      removeQue:function(id){

        if(id!=undefined&&id!=null&&id!=""){
          var ids =[id]
          this.$confirm(`确定对该问题进行删除操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/biz/policyquestion/delete`),
              method: 'POST',
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
        }

      },
    }
  }
</script>

<style scoped>
  .question_box{
    border:1px solid #45c2b5;
    margin-bottom: 20px;

  }
  .question_indent{
    text-indent: 2em;
  }
  .question_indent p{
    text-indent: 5em;
  }
  .question_tab{
    background: #45c2b5;
    line-height: 36px;
    color:#fff;
    padding-left: 10px;
    position: relative;
    margin-top: 0;
  }
  .span_title{
    display: inline-block;
    padding: 0 20px;
  }
</style>

