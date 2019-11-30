<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="企业ID" prop="companyid">
        <el-input v-model="dataForm.id" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="companyname">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业性质" prop="companynature">
        <el-select v-model="dataForm.companynature" placeholder="企业性质">
          <el-option
            v-for="item in companynature"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规模" prop="companyscale">
        <el-select v-model="dataForm.companyscale" placeholder="规模">
          <el-option
            v-for="item in companyscale"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业">
        <el-checkbox-group v-model="dataForm.trade">
          <el-checkbox v-for="item in tradeList" :label="item.tradeId" :key="item.tradeId">{{item.tradeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="地区"  prop="province">
        <v-distpicker hide-area :province="dataForm.province" :city="dataForm.city" @selected="onSelected"></v-distpicker>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="dataForm.createtime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import VDistpicker from 'v-distpicker'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          companyid: '',
          companyname: '',
          companynature: '',
          companyscale: '',
          province: '',
          city:'',
          trade: '',
          createtime:''
        },
        tradeList: [],
        companyscale:[],
        companynature:[],
        dataRule: {
          companyid: [
            { companyid: true, message: '企业id不能为空', trigger: 'blur' }
          ],
          companyname: [
            { companyname: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          companynature: [
            { companynature: true, message: '企业性质不能为空', trigger: 'blur' }
          ],
          companyscale: [
            { companyscale: true, message: '规模不能为空', trigger: 'blur' }
          ],
          province: [
            { province: true, message: '地区不能为空', trigger: 'blur' }
          ],
          city: [
            { city: true, message: '地区不能为空', trigger: 'blur' }
          ],
          trade: [
            { trade: true, message: '行业不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      VDistpicker
    },
    mounted () {
      this.getTrade();
      this.getCompanyScale ();
      this.getCompanyNature();
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                var datas=data.data;
                this.dataForm.companyid = datas.companyid;
                this.dataForm.companyname = datas.companyname;
                this.dataForm.companynature = datas.companynature;
                this.dataForm.companyscale = datas.companyscale;
                this.dataForm.createtime = datas.createtime;
                this.dataForm.trade = datas.trade?datas.trade.split(',').slice(1,datas.trade.length-1):[];
                if(datas.province=="北京"||datas.province=="上海"||datas.province=="天津"||datas.province=="重庆"){
                  this.dataForm.province = datas.province+"市";
                  this.dataForm.city = datas.city+"城区";
                }else{
                  this.dataForm.province = datas.province+"省";
                  this.dataForm.city = datas.city+"市";
                }
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.trade==''){
          this.$message.error('行业不能为空!');
          return false;
        }
        else if(this.dataForm.province==''||this.dataForm.city==''){
          this.$message.error('省份不能为空!');
          return false;
        }
        if(this.dataForm.province=="北京市"||this.dataForm.province=="上海市"||this.dataForm.province=="天津市"||this.dataForm.province=="重庆市"){
          this.dataForm.province = this.dataForm.province.split("市")[0];
          this.dataForm.city = this.dataForm.city.split("城区")[0];
        }else{
          this.dataForm.province = this.dataForm.province.split("省")[0];
          this.dataForm.city = this.dataForm.city.split("市")[0];
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/update`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.id,
                'companyname': this.dataForm.companyname,
                'companynature': this.dataForm.companynature,
                'companyscale': this.dataForm.companyscale,
                'province': this.dataForm.province,
                'city': this.dataForm.city,
                'trade': ","+this.dataForm.trade.join(",")+",",
                'positiotn': this.dataForm.positiotn,
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 行业选择
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      // 获取行业
      getTrade () {
        this.$http({
          url: this.$http.adornUrl('/biz/trade/select'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data,i;
            for(i in datas){
              datas[i].tradeId=datas[i].tradeId.toString();
            }
            this.tradeList = datas;
          }
        })
      },
      // 获取规模
      getCompanyScale () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=2'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companyscale = data.data;
          }
        })
      },
      // 获取性质
      getCompanyNature () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=3'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companynature = data.data;
          }
        })
      },

      //城市选择
      onSelected (e) {
        this.dataForm.province=e.province.value;
        this.dataForm.city=e.city.value
      },


    }
  }
</script>
