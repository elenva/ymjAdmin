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
          <el-col :span="6" type="flex" class="selectWrap">
              <el-select 
                  placeholder="请选择状态" 
                  maxlength="20"
                  @change="selectChange"
                  v-model="type" 
                  allowClear>
                  <el-option label="全部" :value="0"/>
                  <el-option label="视频" :value="1"/>
                  <el-option label="音频" :value="2"/>
                  <el-option label="图文" :value="3"/>
              </el-select>
          </el-col>
      </el-row>
      <el-row  slot="tableArea" v-if="tableData">
          <el-table border :data="tableData.datas">
              <el-table-column
                  align="center"
                  prop="cardName"
                  label="持有人">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="cardNum"
                  label="银行卡号">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="createTime"
                  label="申请时间">
              </el-table-column>
              <el-table-column
                  align="center"
                  v-if="type===3"
                  prop="refuseRemark"
                  label="拒绝原因">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="remark"
                  label="提现说明">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="status"
                  label="状态">
                  <template slot-scope="{row}">
                      <span v-show="row.status === 1" style="color:blue;">审核中</span>
                      <span v-show="row.status === 2" style="color:grren;">提现成功</span>
                      <span v-show="row.status === 3" style="color:red;">提现失败</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="status"
                  label="操作">
                  <template slot-scope="{row}" v-if="row.status === 1">
                      <el-button
                          size="mini" 
                          type="primary">通过</el-button>
                      <el-button
                          size="mini" 
                          type="danger">不通过</el-button>    
                  </template>
              </el-table-column>
          </el-table>
      </el-row>
    </Page>
    <el-dialog 
      :visible="showAddDialog" 
      title="新建课程" 
      @close="showAddDialog=false" 
      width="600px">
      <el-form label-width="110px" ref="addForm" :model="addDialogModel" :rules="addDialogRules">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addDialogModel.name"></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="addDialogModel.type">
            <el-option :value="1" label="视频"></el-option>
            <el-option :value="2" label="音频"></el-option>
            <el-option :value="3" label="图文"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="addDialogModel.courseOrder" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程浏览量">
          <el-input-number v-model="addDialogModel.courseView" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程推荐排序">
          <el-input-number v-model="addDialogModel.recommendOrder" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="课程介绍与描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addDialogModel.description">
          </el-input>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-switch
            v-model="addDialogModel.isfree"
            active-text="免费"
            inactive-text="付费">
          </el-switch>
        </el-form-item>
        <template v-if="!addDialogModel.isfree">
          <el-form-item label="购买方式">
             <el-radio-group v-model="addDialogModel.buyType">
                <el-radio :label="1">按次购买</el-radio>
                <el-radio :label="2">时长购买</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="购买价格" prop="buyTypeList[0].money">
            <el-input-number v-model="addDialogModel.buyTypeList[0].money" :step="1"></el-input-number>
            <span v-if="addDialogModel.buyType===1" class="tip">元/次</span>
            <span v-else class="tip">元/天</span>
          </el-form-item>
          <el-form-item label="购买所得积分" prop="buyTypeList[0].integration">
            <el-input-number v-model="addDialogModel.buyTypeList[0].integration" :step="1"></el-input-number>
            <span class="tip">购买1个单位产品所反积分</span>
          </el-form-item>
        </template>
        <el-row class="btnwrap">
          <el-button type="primary" @click="addEvt">添加</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
    
</template>

<script>
import {$getPutList,$updatePut} from '@/api/index';
import Page from '@/components/Page';

export default {
  data(){
    return {
      type:0,
      key:'',
      page:1,
      tableData:null,
      showAddDialog:true,
      uploadedList:[{file:'dasdasdas.mp4',documentName:""}],
      addDialogRules:{
        name:[
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        buyTypeList:[
          {
            money:[
              { required: true, message: '请输入单价', trigger: 'change' }
            ],
            integration:[
              { required: true, message: '请输入所反积分', trigger: 'change' }
            ],
          }
        ]
      },
      addDialogModel:{
        name:'课程名称',
        type:1,//课程类型
        isfree:false,//是否免费
        courseOrder:"",//课程排序
        courseView:0,//课程浏览量
        description:'',//课程介绍与描述
        recommendOrder:"",//课程推荐排序,
        buyType:1,//购买方式
        buyTypeList:[
          {
            money:"",//价格
            integration:0,//购买所得积分
          }
        ]
      }
    }
  },
  mounted(){

  },
  methods:{
    pageChange(page){
      this.page = page;
    },
    //打开上传的dialog
    showUpDialog(){
      this.showAddDialog = true;
    },
    selectChange(e) {
      console.log(e)
    },
    //添加事件
    addEvt(){
      const dom = this.$refs.addForm;
      dom.validate(res=> {

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
</style>