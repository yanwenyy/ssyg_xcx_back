<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="辅导期名称" prop="title">
        <el-input v-model="dataForm.title" :disabled="true" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="对应月份" prop="policyDate">
        <el-date-picker
          v-model="dataForm.policyDate"
          type="month"
          :disabled="true"
          placeholder="选择对应月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="当前周期" prop="statusName">
        <el-input v-model="dataForm.statusName" :disabled="true" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-table
          :data="dataList"
          border
          :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
          :row-style="{height:'36px',padding:'5px 0'}"
          :cell-style="{padding:'5px 0'}"
          style="width: 381px;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="180"
            label="周期">
          </el-table-column>
          <el-table-column
            prop="time"
            header-align="center"
            align="center"
            width="200"
            label="时间">
          </el-table-column>
        </el-table>
      </el-form-item>
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
        title:'',
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
