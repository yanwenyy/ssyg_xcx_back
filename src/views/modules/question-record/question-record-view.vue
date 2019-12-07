<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <div style="border: 1px solid #ccc;padding-left: 20px">
        <p style="border-bottom: 1px solid #ccc;margin-left:-20px;text-indent:1em;padding-bottom:10px">问题详情</p>
        <el-form-item label="用户姓名">
          <el-input v-model="dataForm.thirdUserName" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 100px">问题涉及行业</label>
          <el-input v-model="dataForm.trade" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="dataForm.phoneNum" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 84px;display: inline-block">税种</label>
          <el-input v-model="dataForm.tax" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="采纳状态">
          <el-input v-model="dataForm.status" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 100px">问题发布时间</label>
          <el-input v-model="dataForm.date" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input type="textarea" v-model="dataForm.content" :disabled="true" style="width:75%"></el-input>
        </el-form-item>
        <el-form-item label="问题图片">
          <div v-for="(picList,index) in dataForm.picList" >
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
              fit="scale-down"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-input v-model="dataForm.delFlag" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
      </div>
      <div style="border: 1px solid #ccc;padding-left: 20px;margin-top: 20px">
        <p style="border-bottom: 1px solid #ccc;margin-left:-20px;text-indent:1em;padding-bottom:10px">回答详情</p>
        <el-form-item label="更新时间">
          <el-table
            :data="dataList"
            border
            :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
            :row-style="{height:'36px',padding:'5px 0'}"
            :cell-style="{padding:'5px 0'}">
            <el-table-column
              header-align="center"
              align="center"
              width="180"
              label=" ">
              <template slot-scope="scope"><span>回答{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="回答内容">
            </el-table-column>
            <el-table-column
              prop="time"
              header-align="center"
              align="center"
              label="采纳状态">
            </el-table-column>
            <el-table-column
              prop="time"
              header-align="center"
              align="center"
              label="回答日期">
            </el-table-column>
            <el-table-column
            prop="time"
            header-align="center"
            align="center"
            label="咨询师姓名">
          </el-table-column>
            <el-table-column
              prop="time"
              header-align="center"
              align="center"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="time"
              header-align="center"
              align="center"
              label="显示状态">
            </el-table-column>
            <el-table-column
              prop="time"
              header-align="center"
              align="center"
              label="被纠错">
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject:['removeTabHandle'],
    data(){
      return {
        dataList:[],
        dataForm:{
          thirdUserName:'',
          statusName:'',
          policyDate:'',
          id:this.$route.query.id || undefined,
          dataList:{}
        },


      }
    },
    mounted(){
      if( this.dataForm.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/policypack/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.title=data.data.title
          this.dataForm.policyDate=data.data.policyDate
          this.dataForm.statusName=data.data.statusName
          this.dataList.push({name:'新增时间',time:this.commonDate.formatTime('','',data.data.createDate)},
            {name:'上线时间',time:this.commonDate.clearTime(data.data.onlineTime)},
            {name:'更新结束时间',time:this.commonDate.formatTime('','',data.data.updateFinishDate)},
            {name:'辅导结束时间',time:this.commonDate.formatTime('','',data.data.finishDate)})
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      }
    }
  }
</script>
