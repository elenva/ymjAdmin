<template>
  <page :tableData="tableData" v-if="tableData" @change="pageChange">
    <el-row type="flex" slot="handleArea">
      <el-col :span="18">
          <!-- <el-button type="primary" @click="addCoupon">添加优惠券</el-button> -->
          <!-- <el-button type="danger">删除优惠券</el-button> -->
      </el-col>
      <el-col :span="6">
          <el-input placeholder="请输入关键字" maxlength="20" v-model="key">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
      </el-col>
    </el-row>
    <el-table
      slot="tableArea"
      :data="tableData.datas"
      @selection-change="selectionChange"
      border
      ref="table"
      style="width: 100%">
      <el-table-column
        v-if="select"
        type="selection"
        width="55">
        </el-table-column>
      <el-table-column
          prop="name"
          label="昵称">
      </el-table-column>
      <el-table-column
          prop="openId"
          label="openId">
      </el-table-column>
      <el-table-column
          prop="integration"
          label="个人积分">
      </el-table-column>
      <el-table-column
          prop="code"
          label="邀请码">
      </el-table-column>
      <el-table-column
          prop="city"
          label="城市">
      </el-table-column>
      <el-table-column
          prop="sex"
          width="66"
          label="性别">
          <template slot-scope="{row}">
            <span>{{row.sex
                      ?row.sex===1
                      ?'男'
                      :'女'
                      :'未知'}}</span>
          </template>
      </el-table-column>
      <!-- <el-table-column
          label="操作"
          width="180">
        <template slot-scope="scope">
            <el-button @click="resetting(scope.row.id)" type="warning" style="transition: .4s;"  :ref="scope.row.id"  icon="el-icon-refresh" size="small" circle></el-button>
            <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" size="small" circle></el-button>
            <el-button @click="deleteUser(scope.row.id)" v-if="scope.row.active != '0'" type="danger" icon="el-icon-delete" circle size="small"></el-button>
            <el-button @click="deleteUser(scope.row.id)" v-else icon="el-icon-check" circle size="small"></el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </page>
  
</template>

<script>
  import ToolBar from '@/components/ToolBar.vue';
  import HelpHint from '@/components/HelpHint.vue';
  import {$getUsers} from '@/api/index.js'
  export default {
    props:['select'],
    data() {
      return {
        key:'',
        currentPage:1,
        tableData:null
      }
    },
    mounted(){
        alert(this.select)
      //获取用户列表
      this.getUsersList();
    },
    methods: {
      getUsersList(data){
        let params = {
          page:this.currentPage,
          key:this.key
        }
        if(data) params = {...params,...data}
        $getUsers(params).then(res=> {
          if(res.success) {
            this.tableData = res
          }
        })
      },
      pageChange(page){
        this.currentPage = page;
        this.$nextTick(()=> this.getUsersList())
      },
      search(){
        this.getUsersList({page:1})
      },
      selectionChange(rows){
        console.log(rows)
      }


    },
    components: {
      ToolBar,HelpHint
    }
  }
</script>
<style lang="scss">

</style>
