<template>
  <div>
    <Page :tableData="tableData" @change="pageChange">
      <el-row type="flex" slot="handleArea">
          <el-col :span="2">
            <el-button type="primary" @click="showUpDialog">上传课程</el-button>      
          </el-col>
          <el-col :span="6">
              <el-input placeholder="请输入关键字" maxlength="20" v-model="key">
                  <el-button slot="append" icon="el-icon-search" @click="selectChange"></el-button>
              </el-input>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4" type="flex" class="selectWrap">
              <el-select 
                  @change="getCourse"
                  placeholder="请选择状态" 
                  maxlength="20"
                  v-model="courseType" 
                  allowClear>
                  <el-option label="全部" value=""/>
                  <el-option label="视频" :value="1"/>
                  <el-option label="音频" :value="2"/>
                  <el-option label="图文" :value="3"/>
              </el-select>
          </el-col>
          <el-col :span="4" type="flex" class="selectWrap">
              <el-select 
                  @change="getCourse"
                  placeholder="请选择状态" 
                  maxlength="20"
                  v-model="status" 
                  allowClear>
                  <el-option label="已上架" :value="1"/>
                  <el-option label="已下架" :value="2"/>
              </el-select>
          </el-col>
      </el-row>
      <el-row  slot="tableArea" v-if="tableData">
          <el-table border :data="tableData.datas">
              <el-table-column
                type="expand">
                <template slot-scope="{row}">
                  <el-table border :data="row.courseVos">
                    <el-table-column 
                      label="课节名称" 
                      align="center"
                      prop="name"></el-table-column>
                    <el-table-column 
                      label="文件链接" 
                      align="center"
                      prop="url"></el-table-column>  
                    <el-table-column 
                      prop="url"
                      align="center"
                      label="操作"
                      >
                      <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="deleteNode(scope.row,row)">删除</el-button>
                        <el-button 
                          size="mini"
                          type="primary" 
                          style="margin-left:10px" @click="editNode(scope.row,row)">修改文件</el-button>
                      </template>
                      </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="name"
                  label="课程名">
                <template slot-scope="{row}">
                  <span>{{row.name}}</span>
                  <span 
                    style="color:#3c8dbc" 
                    v-if="row.recommendOrder">
                    &nbsp;已推荐
                  </span>
                </template>  
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="type"
                  label="课程类型">
                  <template slot-scope="{row}">
                    <span>{{row.type===1
                              ?'视频'
                              : row.type===2
                              ?'音频'
                              :'图文'}}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="createTime"
                  label="购买方式">
                  <template slot-scope="{row}">
                    <span>{{getBuyType(row.buyTypeList)}}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="isfree"
                  label="是否免费">
                  <template slot-scope="{row}">
                    <span>{{row.isfree===1?'免费':'付费'}}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="remark"
                  label="单价">
                  <template slot-scope="{row}">
                    <span>{{getPrice(row.buyTypeList)}}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="keyword1"
                  label="节数">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="keyword2"
                  label="总时长(分钟)">
              </el-table-column>
              <el-table-column
                  align="center"
                  width="220px"
                  prop="status"
                  label="操作">
                  <template slot-scope="{row}">
                      <el-button
                          size="mini" 
                          type="text" 
                          @click="editRow(row)">修改</el-button>
                      <el-button
                          v-if="row.status === 1"
                          @click="setCourseStatus(row.id,2)"
                          style="color:red"
                          size="mini" 
                          type="text">下架</el-button>   
                      <el-button
                          @click="setCourseStatus(row.id,1)"
                          v-if="row.status === 2"
                          style="color:green"
                          size="mini" 
                          type="text">上架</el-button>        
                      <el-button
                          size="mini"
                          @click="addNode(row)" 
                          type="text">添加课程节数</el-button>    
                      <el-button
                          style="color:red"
                          size="mini" 
                          @click="deleteRow(row)"
                          type="text">删除</el-button>    
                  </template>
              </el-table-column>
          </el-table>
      </el-row>
    </Page>
    <el-dialog 
      :visible="Boolean(showAddDialog)" 
      :title="showAddDialog==='111'?'新建':'修改'" 
      @close="showAddDialog=false" 
      width="600px">
      <el-form label-width="120px" ref="addForm" :model="addDialogModel" :rules="addDialogRules">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addDialogModel.name"></el-input>
        </el-form-item>
        <el-form-item label="课程类别" prop="courseTypeList">
          <!-- <el-input v-model="addDialogModel.name"></el-input> -->
          <el-cascader
            style="width:300px;"
            v-model="addDialogModel.courseTypeList"
            :options="baseCourse"
            :props="{
              value:'id',
              label:'name'
            }"></el-cascader>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="addDialogModel.type">
            <el-option :value="1" label="视频"></el-option>
            <el-option :value="2" label="音频"></el-option>
            <el-option :value="3" label="图文"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number 
            :min="0"
            v-model="addDialogModel.courseOrder" 
            :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程浏览量">
          <el-input-number 
            :min="0"
            v-model="addDialogModel.courseView" 
            :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程推荐排序">
          <el-input-number
            :min="0" 
            v-model="addDialogModel.recommendOrder" 
            :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程介绍与描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addDialogModel.description">
          </el-input>
        </el-form-item>
        <el-form-item label="课程封面" prop="imgUrl">
          <input type="file" @change="beforeFMUpload" id="fmInput">
          <p class="imgUrl">{{addDialogModel.imgUrl}}</p>
          <!-- <el-upload
            :action="`${devApiUrl}/sys/saveFile/img`"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="beforeFMUpload">
            <el-button type="primary" size="mini">点击上传</el-button>
          </el-upload> -->
        </el-form-item>
        <el-form-item label="是否免费">
          <el-switch
            :active-value="1"
            :inactive-value="2"
            v-model="addDialogModel.isfree"
            active-text="免费"
            inactive-text="付费">
          </el-switch>
        </el-form-item>
        <template v-if="addDialogModel.isfree === 2">
          <p class="sTitle">按次购买</p>
          <el-form-item label="购买价格" prop="buyTypeList[0].money">
            <el-input-number 
              :min="0"
              v-model="addDialogModel.buyTypeList[0].money" 
              :step="1"></el-input-number>
            <span  class="tip">元/次</span>
          </el-form-item>
          <el-form-item label="购买所得积分" prop="buyTypeList[0].integration">
            <el-input-number 
              :min="0"
              v-model="addDialogModel.buyTypeList[0].integration" 
              :step="1"></el-input-number>
            <span class="tip">购买1个单位产品所反积分</span>
          </el-form-item>
          <el-form-item label="邀请者所得积分" prop="buyTypeList[0].inviteIntegration">
            <el-input-number 
              :min="0"
              v-model="addDialogModel.buyTypeList[0].inviteIntegration" 
              :step="1"></el-input-number>
            <span class="tip">购买1个单位产品邀请者可获得的积分</span>
          </el-form-item>
          <p class="sTitle">按天购买</p>
          <el-form-item label="购买价格" prop="buyTypeList[1].money">
            <el-input-number
              :min="0" 
              v-model="addDialogModel.buyTypeList[1].money" :step="1"></el-input-number>
            <span class="tip">元/天</span>
          </el-form-item>
          <el-form-item label="购买所得积分" prop="buyTypeList[1].integration">
            <el-input-number 
              :min="0" 
              v-model="addDialogModel.buyTypeList[1].integration" 
              :step="1"></el-input-number>
            <span class="tip">购买1个单位产品所反积分</span>
          </el-form-item>
          <el-form-item label="邀请者所得积分" prop="buyTypeList[1].inviteIntegration">
            <el-input-number 
              :min="0"
              v-model="addDialogModel.buyTypeList[1].inviteIntegration" 
              :step="1"></el-input-number>
            <span class="tip">购买1个单位产品邀请者可获得的积分</span>
          </el-form-item>
        </template>
        <el-row class="btnwrap">
          <el-button type="primary" @click="addEvt">
            {{showAddDialog==='111'?'新建':'修改'}}
          </el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      @close="courseVos=null"
      v-if="Boolean(courseVos)"
      :title="!courseVos.name?'添加课节':`修改《${courseVos.name}》`"
      :visible="Boolean(courseVos)">
        <el-form :rules="courseVosRules" :model="courseVos" ref="courseVosForm">
          <el-form-item label="课节名称" prop="name">
            <el-input v-model="courseVos.name"></el-input>
          </el-form-item>
          <el-form-item label="可试看时长(秒)" prop="freeSecond">
            <el-input-number v-model="courseVos.freeSecond" :step="1" :min="0"></el-input-number>
            <span class="tip">输入0表示不可试看该节</span>
          </el-form-item>
          <el-form-item label="课节文件">
            <input type="file" @change="beforeKJUpload" id="kjInput"/>
            <p v-if="courseVos.url">{{courseVos.url}}</p>
          </el-form-item>
          <el-row>
            <el-button type="primary" @click="addcourseVos">添加</el-button>
          </el-row>
        </el-form>
    </el-dialog>
  </div>
    
</template>

<script>
import {$getCourse,$saveFile,$addOrEditCourse,$setCourseStatus,$getOssInfo} from '@/api/index';
import { mapState } from 'vuex'
import Page from '@/components/Page';
import OSS from 'ali-oss';

export default {
  data(){
    return {
      currentNode:null,//当前被选中的行
      courseVos:null,//课节
      courseVosRules:{
        name:[
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        freeSecond:[
          { required: true, message: '不可为空', trigger: 'change' },
        ]
      },
      courseType:"",
      key:'',
      page:1,
      status:1,
      tableData:null,
      showAddDialog:false,
      uploadedList:[{file:'dasdasdas.mp4',documentName:""}],
      addDialogRules:{
        courseTypeList:[
          { required: true, message: '请选择课程类别', trigger: 'change' }
        ],
        name:[
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        buyTypeList:[
          {
            money:[
              { required: true, message: '请输入单价', trigger: 'change' }
            ],
            integration:[
              { required: true, message: '请输入所反积分', trigger: 'change' }
            ],
            inviteIntegration:[
              { required: true, message: '请输入所反积分', trigger: 'change' }
            ],
          },
          {
            money:[
              { required: true, message: '请输入单价', trigger: 'change' }
            ],
            integration:[
              { required: true, message: '请输入所反积分', trigger: 'change' }
            ],
            inviteIntegration:[
              { required: true, message: '请输入所反积分', trigger: 'change' }
            ],
          }
        ]
      },
      addDialogModel:{
        courseTypeList:null,//存储课程类别的数组
        courseTypeStr:"",//服务器存储课程类别的字符串
        courseTypeId:'',//服务器存储课程类别的id
        name:'课程名称',
        type:1,//课程类型
        isfree:1,//是否免费
        courseOrder:"",//课程排序
        courseView:0,//课程浏览量
        description:'',//课程介绍与描述
        recommendOrder:"",//课程推荐排序,
        buyType:1,//购买方式
        imgUrl:"",//课程封面
        buyTypeList:[
          {
            buyType:1,
            money:0,//价格
            integration:0,//购买所得积分
            inviteIntegration:0,
          },
          {
            buyType:2,
            money:0,//价格
            integration:0,//购买所得积分
            inviteIntegration:0,
          }
        ]
      }
    }
  },
  computed:{
    ...mapState({
      baseCourse:"baseCourse"
    })

  },
  mounted(){
    //获取课程列表
    this.getCourse();

    //获取课程类别
    this.$store.dispatch("getBaseCourse")
  },
  watch:{
    baseCourse:{
      handler:function(newV){
        console.log(newV)
      },
      deep:true
    }
  },
  methods:{
    //获取课程列表
    getCourse(data){
      const {courseType,key,page,status} = this;
      let params = {
        courseType,
        key,
        page,
        status
      }
      if(data) {
        params = {
          ...params,
          ...data
        }
      }
      $getCourse(params).then(res =>{
        this.tableData = res
      })
    },
    pageChange(page){
      this.page = page;
      this.getCourse();
    },
    //打开上传的dialog
    showUpDialog(){
      this.showAddDialog = '111';
    },
    selectChange(e) {
      console.log(e)
    },
    //添加事件
    addEvt(){
      const dom = this.$refs.addForm;
      dom.validate(res=> {
        if(res) {
          if(this.addDialogModel.imgUrl) {
            let params = {
              ...this.addDialogModel,
              id:this.showUpDialog === '111'?'':this.showUpDialog,
              courseTypeStr:this.addDialogModel.courseTypeList.join(','),//服务器存储课程类别的字符串
              courseTypeId:this.addDialogModel.courseTypeList[this.addDialogModel.courseTypeList.length-1],//服务器存储课程类别的id
            }
            $addOrEditCourse(params)
              .then(res=> {
                if(!res.success) return
                this.getCourse();
                this.showAddDialog = false
              })
          }else {
            this.$message.error('请上传封面');
          }
          console.log(this.addDialogModel)
        }
      })
    },
    scopeTest(s){
      console.log(s)
    },
    getPrice(list){
      let str = '';
      list.map(item => {
        const _str = item.buyType == 1
          ?` ${item.money}元/次`
          :` ${item.money}元/天`
          str += _str
      })
      return str
    },
    getBuyType(list){
      let str='';
      list.map(item => {
        const _str = item.buyType == 1
          ?` 按次`
          :` 按天`
          str += _str
      })
      return str
    },
    beforeFMUpload(e){
      const file = e.target.files[0]
      $saveFile('img',file).catch(res=> {
        const dom = document.querySelector("#fmInput");
        dom.value = null;
      })
    },
    //修改某条信息
    editRow(row){
      this.showAddDialog = row.id
      let buyTypeList = row.buyTypeList
      let courseTypeList = [];
      if(row.buyTypeList.length && row.buyTypeList.length !== 2) {
        row.buyTypeList.map(item => {
          if(item.buyType == 1) {
            buyTypeList.push({
              buyType:2,
              money:0,//价格
              integration:0,//购买所得积分
              inviteIntegration:0,
            })
          }else {
            buyTypeList.unshift({
              buyType:1,
              money:0,//价格
              integration:0,//购买所得积分
              inviteIntegration:0,
            })
          }
        })
      }
      if(!row.buyTypeList.length) {
        buyTypeList = [
          {
            buyType:1,
            money:0,//价格
            integration:0,//购买所得积分
            inviteIntegration:0,
          },
          {
            buyType:2,
            money:0,//价格
            integration:0,//购买所得积分
            inviteIntegration:0,
          }
        ]
      }
      if(row.courseTypeStr) {
         row.courseTypeStr.split(',').map(item=> {
           courseTypeList.push(item*1)
         })
      }
      this.addDialogModel = {
        ...row,
        buyTypeList,
        courseTypeList
      }
      console.log(this.addDialogModel)
    },
    //修改上架下架状态
    setCourseStatus(id,status){
      $setCourseStatus(id,status).then(res=> {
        if(res.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getCourse()
        }
      })
    },
    //删除一个课程
    deleteRow(row){
      this.$confirm(`此操作将永久删除《${row.name}》, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.setCourseStatus(row.id,0)
      })
    },
    //添加课程节数
    addNode(row) {
      this.currentNode = row;
      this.courseVos = {
        name:'',
        url:'',
        courseVos:[],
        type:row.type
      }
    },
    //获取对象类型
    getObjType(obj){
      return Object.prototype.toString.call(obj);
    },
    //课节文件上传
    beforeKJUpload(e){
      const tp = ['video','audio','img'];
      const file = e.target.files[0]
      console.log(tp[this.courseVos.type-1])
      $saveFile(tp[this.courseVos.type-1],file).catch(res=> {
        const dom = document.querySelector("#kjInput");
        dom.value = null;
      })
    },
    //添加课节
    addcourseVos(){
      this.$refs.courseVosForm.validate(res=> {
        if(res) {
          if(!this.courseVos.url) {
            this.$message.error(`课节文件不可为空`);
          }else {
            const currentNode = this.currentNode;
            const courseVos = currentNode.courseVos;
            const oldCourseVos = JSON.parse(JSON.stringify(currentNode)).courseVos;
            // ---
            // this.courseVos
            const idx = courseVos.findIndex(el=> el.id === this.courseVos.id)
            if( idx!== -1){
              courseVos[idx] = this.courseVos
            }else{
              courseVos.push(this.courseVos);
            }
            this.$set(this.currentNode,'courseVos',courseVos)
            $addOrEditCourse(currentNode)
              .then(res=> {
                if(!res.success) return
                this.getCourse();
                this.currentNode = null
                this.courseVos = null
              })
              .catch(res=> {
                this.$set(this.currentNode,'courseVos',oldCourseVos)
              })
          }
        }
      })
    },
    //编辑课节
    editNode(n,row) {
      this.courseVos = n
      this.currentNode = row
    },
    //删除课节
    deleteNode(n,row){
      this.currentNode = row
      const courseVos = row.courseVos;
      const idx = courseVos.findIndex(item => item.id === n.id)
      this.$confirm(`此操作将永久删除《${n.name}》, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        courseVos.splice(idx,1);
      this.$set(this.currentNode,'courseVos',courseVos);
      $addOrEditCourse(this.currentNode)
        .then(res=> {
          if(!res.success) return
          this.getCourse();
          this.currentNode = null
          this.courseVos = null
          this.$message.success(`删除成功`)
        })
      })
    }
  },
  components:{
    Page
  }
}
</script>

<style lang="scss" scoped>
  .dialogItem {
    align-items: center;
    margin-bottom: 10px;
  }
  .tip {
    color: #999;
    margin-left: 20px;
    font-size: 14px;
  }
  .btnwrap {
    text-align: center;
    margin-top: 50px;
    button {
      width: 100%;
    }
  }
  .sTitle {
    font-size: 16px;
    font-weight: 600;
  }
  .imgUrl {
    word-break: break-all;
    line-height: 1;
  }
</style>