<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li class="pack">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend',query:{id:dataForm.policyId} })">深度解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast',query:{id:dataForm.policyId} })">对比解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-official',query:{id:dataForm.policyId} })">官方解读</li>
    </ul>
        <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
        <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
          <div v-for="(listParts, index) in dataForm.listParts" v-model="dataForm.listParts" :key="reld">
            <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px;position: relative">Part {{index+1}}<el-form-item>
              <el-button type="danger" @click="removePart(listParts,dataForm.listParts[index].expertPart.id)" style="position: absolute;top:-36px;right:0">删除Part</el-button>
            </el-form-item></h2>
            <el-form-item>
              <template>
              </template>
            </el-form-item>
            <el-form-item label="政策原文" :prop="'content'+index">
              <wang-e :key="index+timer" :id='"editor"+index' :index="index" :policy="'content'" @func="editorContent" :econtent="dataForm.listParts[index].expertPart.partContent"></wang-e>
            </el-form-item>
            <el-form-item label="解析" :prop="'resolve'+index">
              <wang-e :key="'resolve_'+index+timer" :id='"resolve_editor"+index' :policy="'resolve'" :index="index"  @func="editorContent" :econtent="dataForm.listParts[index].expertPart.resolve"></wang-e>
            </el-form-item>
            <el-form-item label="音频">
              <div v-for="(expertPartVoices, voiceIndex) in dataForm.listParts[index].expertPartVoices" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
                <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeVoice(index,expertPartVoices,dataForm.listParts[index].expertPartVoices[voiceIndex].id)">x 删除模块</el-button>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].realName"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="音频标题"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].title"></el-input></el-form-item>
              </div>
              <el-button @click="addVoice(index)" type="warning">新增音频</el-button>
            </el-form-item>
            <el-form-item label="视频" :prop="'video'+index">
              <div v-for="(expertPartVideos, videoIndex) in dataForm.listParts[index].expertPartVideos" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
                <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeVideo(index,expertPartVideos,dataForm.listParts[index].expertPartVideos[videoIndex].id)">x 删除模块</el-button>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].vid"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="视频标题"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].title"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="封面链接">
                  <el-input style="width:500px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].cover"></el-input>
                  <el-button plain @click="uploadCover()" @refreshData="getReld" placeholder="请上传封面，填写生成链接">添加封面</el-button>
                  <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：点击添加封面按钮，进行封面上传，复制生成链接</p>
                </el-form-item>
              </div>
              <el-button @click="addVideo(index)" type="warning">新增视频</el-button>
            </el-form-item>
          </div>
            <el-button type="primary" @click="addPart()">新增Part</el-button>
          <div>
            <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">政策背景</h2>
            <el-form-item prop="content">
              <template>
                <div id="editor" v-model="dataForm.content"></div>
              </template>
            </el-form-item>
            <el-form-item style="text-align: center;">
              <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
              <el-button type="info" @click="closePage()">关闭</el-button>
            </el-form-item>
          </div>

        </el-form>
     <!-- </el-tab-pane>
      <el-tab-pane label="深度解读" @click="$router.push({ name: 'policy-unscramble-extend'})"></el-tab-pane>
      <el-tab-pane label="对比解读"></el-tab-pane>
      <el-tab-pane label="官方解读"></el-tab-pane>
    </el-tabs>-->
    <upload-cover v-if="uploadCoverVisible" ref="uploadCoverRef" @refreshData="getReld"></upload-cover>
  </div>
</template>
<script>
  import Vue from 'vue'
  import WangEditor from 'wangeditor'
  import wangE1 from './wangE'
  import uploadCover from './upload-cover'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
      uploadCover,
      'wang-e':wangE1
    },
      inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        uploadCoverVisible:false,
        partIndex:0,
        timer:'',
        imageUrl:'',
        reld:'',
        dataForm:{
          policyId:this.$route.query.id || undefined,
          id:'',
          content:'',
          listParts: [],
        },

      }
    },
    mounted(){
      var that=this
      this.editor = new WangEditor("#editor");
      this.editor.customConfig.uploadImgServer =  this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`); //上传URL
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      this.editor.customConfig.uploadImgMaxLength = 5;
      this.editor.customConfig.uploadFileName = 'file';
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          // var url =result.url;
          var url ="http://"+result.url;
          insertImg(url);
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      this.editor.customConfig.onchange = function (html) {
        // 监控变化，同步更新到 content
        //html=html.replace(/\"/g,"'");
        if(html=='<p><br></p>'){html=''}
        that.dataForm.content=html
      };
      this.editor.create();
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyexpert/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm=data.data
          this.editor.txt.html(data.data.content)
          this.dataForm.policyId=this.$route.query.id
          if(this.dataForm.listParts==null||this.dataForm.listParts==undefined){
            this.dataForm.listParts=[]
          }
        })
      }
    },
    methods:{
      uploadCover () {
        this.uploadCoverVisible = true
        this.$nextTick(() => {
          this.$refs.uploadCoverRef.init()
        })
      },
      getReld(){
        this.reld=new Date().getTime()
      },
      newD(){
        this.timer=new Date().getTime()
      },
      //push对应富文本内容
      editorContent:function(policy,partIndex,content){
        if(policy=='content'){
          this.dataForm.listParts[partIndex].expertPart.partContent=content
        }else if(policy=='resolve'){
          this.dataForm.listParts[partIndex].expertPart.resolve=content
        }

      },
      //添加Part
      addPart:function(){
        this.dataForm.listParts.push({
          value: '',
          expertPart:{
            partContent:'',
            resolve:''
          },
          expertPartVoices:[],
          expertPartVideos:[],
          key: Date.now()
        });
      },
      //删除Part
      removePart:function(item,id){
        var index = this.dataForm.listParts.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids =[id]
            this.$confirm(`确定对该Part进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpert/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts.splice(index, 1);
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
          }else{
            this.dataForm.listParts.splice(index, 1);
          }
        }
        this.newD()
        //console.log(this.dataForm.listParts)
      },
      //添加音频
      addVoice:function(index){
        this.dataForm.listParts[index].expertPartVoices.push({
          realName: '',
          title:'',
          key: Date.now()
        });
      },
      //删除音频
      removeVoice:function(partIndex,item,id){
        var index = this.dataForm.listParts[partIndex].expertPartVoices.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids = [id]
            this.$confirm(`确定对该音频模块进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpertpartvoice/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts[partIndex].expertPartVoices.splice(index, 1)
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
          }else{
            this.dataForm.listParts[partIndex].expertPartVoices.splice(index, 1)
          }

        }
      },
      //添加视频
      addVideo:function(index){
        this.dataForm.listParts[index].expertPartVideos.push({
          vid: '',
          title:'',
          cover:'',
          imageUrl:'',
          key: Date.now()
        });
      },
      //删除视频
      removeVideo:function(partIndex,item,id){
        var index = this.dataForm.listParts[partIndex].expertPartVideos.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids = [id]
            this.$confirm(`确定对该视频模块进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpertpartvideo/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts[partIndex].expertPartVideos.splice(index, 1)
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
          }else{
            this.dataForm.listParts[partIndex].expertPartVideos.splice(index, 1)
          }

        }
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/policyexpert/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closePage()
                  }
                })

              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
  .ul-tab-title{
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    padding-left: 0;
    height: 38px;
    cursor: pointer;
  }
  .ul-tab-title li{
    display: inline-block;
    line-height: 36px;
    width:100px;
    text-align: center;
    cursor: pointer;
    color: #909399;
  }
  .ul-tab-title li.pack{
    color:#409eff;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-top: 1px solid #e4e7ed;
    background:#fff;
  }
  .ul-tab-title li:hover{
    color:#409eff;
  }
</style>

