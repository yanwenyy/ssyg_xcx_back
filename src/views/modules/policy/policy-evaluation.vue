<template>
  <div class="mod-policy">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" @click="$router.push({ name: 'policy-question-add-or-update',query:{id:dataForm.policyId} })">新增</el-button>
      </el-form-item>
        <div class="questionList_type1">
          <h3>单选题</h3>
          <div class="question_box" v-for="(dataList, index) in dataForm.dataList[0]" v-model="dataForm.dataList[0]">
            <p  class="question_tab">
              <span class="span_title">ID：{{dataList.id}}</span>
              <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-add-or-update',query:{qid:dataList.id,id:dataForm.policyId} })">编辑</el-button>
              <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="removeQue(dataList.id)">删除</el-button>
              <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-view',query:{qid:dataList.id,id:dataForm.policyId} })">查看</el-button>
            </p>
            <div class="question_indent">
              <h4>题干：{{dataList.title}}</h4>
              <p v-for="(answerList, answerIndex) in dataList.answerList">
                <span>{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}、{{answerList.content}}</span>
              </p>
              <div v-for="(answerList, answerIndex) in dataList.answerList">
                <p style="color: orange" v-if="answerList.status==1">正确答案：{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}</p>
              </div>
            </div>
          </div>
          <div class="questionList_type2" >
            <h3>多选题</h3>
            <div class="question_box" v-for="(dataList, index) in dataForm.dataList[1]" v-model="dataForm.dataList[1]">
              <p  class="question_tab">
                <span class="span_title">ID：{{dataList.id}}</span>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-add-or-update',query:{qid:dataList.id,id:dataForm.policyId} })">编辑</el-button>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="removeQue(dataList.id)">删除</el-button>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-view',query:{qid:dataList.id,id:dataForm.policyId} })">查看</el-button>
              </p>
              <div class="question_indent">
                <h4>题干：{{dataList.title}}</h4>
                <p v-for="(answerList, answerIndex) in dataList.answerList">
                  <span>{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}、{{answerList.content}}</span>
                </p>
                <p style="color: orange" v-if="numS()">正确答案：{{dataList.stringNumS}}</p>
              </div>
            </div>
          </div>
          <div class="questionList_type3" >
            <h3>判断题</h3>
            <div class="question_box" v-for="(dataList, index) in dataForm.dataList[2]" v-model="dataForm.dataList[2]">
              <p  class="question_tab">
                <span class="span_title">ID：{{dataList.id}}</span>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-add-or-update',query:{qid:dataList.id,id:dataForm.policyId} })">编辑</el-button>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="removeQue(dataList.id)">删除</el-button>
                <el-button style="color: #fff;float: right;margin-right: 20px" type="text" size="small" @click="$router.push({ name: 'policy-question-view',query:{qid:dataList.id,id:dataForm.policyId} })">查看</el-button>
              </p>
              <div class="question_indent">
                <h4>题干：{{dataList.title}}</h4>
                <p v-for="(answerList, answerIndex) in dataList.answerList">
                  <span>{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}、{{answerList.content}}</span>
                </p>
                <div v-for="(answerList, answerIndex) in dataList.answerList">
                  <p style="color: orange" v-if="answerList.status==1">正确答案：{{parseInt(answerIndex+1) | getStringNum(parseInt(answerIndex+1))}}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </el-form>
  </div>
</template>

<script>
    export default {
      data () {
        return {

          dataForm:{
            policyId:this.$route.query.id,
            dataList:[]
          },
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
        },
        /*getStringNumS(key){
          return String.fromCharCode(64 + parseInt(key))
        },*/
      },
      activated () {
        this.getDataList()
      },
      methods:{
        numS(){
          for(var i=0;i<this.dataForm.dataList[1].length;i++){
            this.dataForm.dataList[1][i].stringNumS=[];
            for(var j=0;j<this.dataForm.dataList[1][i].answerList.length;j++){

              if(this.dataForm.dataList[1][i].answerList[j].status==1){
                this.dataForm.dataList[1][i].stringNumS.push(String.fromCharCode(64 + parseInt(j+1)))
                /*this.getStringNum(j)
                //this.stringNumS.push()*/
              }
            }
            /*if(this.dataForm.dataList[1][i].answerList)
            */
            console.log()
            this.dataForm.dataList[1][i].stringNumS=this.dataForm.dataList[1][i].stringNumS.join("、")
          }

          return true
        },
        // 获取数据列表
        getDataList () {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/biz/policyquestion/list'),
            method: 'GET',
            params: this.$http.adornParams({"policyId":this.dataForm.policyId})
          }).then(({data}) => {
            if (data && data.code == 200) {
              console.log(data)
              this.dataForm.dataList = data.data
             console.log(this.dataList )
            } else {
              /*this.dataList = []
              this.totalPage = 0*/
            }
            this.dataListLoading = false
          })
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
