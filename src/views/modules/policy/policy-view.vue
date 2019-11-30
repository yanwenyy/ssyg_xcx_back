<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="辅导期名称" prop="title">
        <el-input v-model="dataForm.title" :disabled="true" placeholder="请输入辅导期名称" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="对应月份" prop="month">
        <el-date-picker
          v-model="dataForm.month"
          type="month"
          :disabled="true"
          placeholder="选择对应月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上线时间" prop="time">
        <el-date-picker
          v-model="dataForm.time"
          type="datetime"
          :disabled="true"
          placeholder="选择上线时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
          :row-style="{height:'36px',padding:'5px 0'}"
          :cell-style="{padding:'5px 0'}"
          style="width: 381px;">
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="180"
            label="周期">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="200"
            label="时间">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="$router.push({ name: 'policy-pack' })">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data(){
    return {
      dataForm:{
        title:'',
        month:'',
        time:'',
        policyId:this.$route.query.policyId || undefined,
        dataList:{}
      },


    }
  },
  mounted(){
    if( this.dataForm.policyId!=undefined){
      this.$http({
        url: this.$http.adornUrl(`/biz/policy/info/${this.policyId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.title=data.policy.title
      })
    }

  }
}
</script>
