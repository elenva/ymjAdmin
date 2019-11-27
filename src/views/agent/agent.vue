<template>
    <div>
        <Page>
            <el-row slot="handleArea">
                <el-col :span="4">
                    <el-button 
                        type="primary" 
                        @click="showAddDialog=true">添加代理</el-button>
                </el-col>
            </el-row>
            <el-row slot="tableArea">
                <el-Alert type="success" :closable="false">
                    <p>我的代理级别：{{agentLevel[$store.state.userInfo.roleId - 1]}}</p>
                    <!-- <p>下级代理:33人</p> -->
                </el-Alert>
                <el-row class="tableWrap">
                    <!-- @tab-click="handleClick" -->
                    <el-tabs v-model="activeName" @tab-click="tabClick">
                        <el-tab-pane label="下级代理" name="agent">
                            <el-table :data="agentUsers">
                                <el-table-column
                                    align="center" 
                                    prop="roleId"
                                    label="代理级别">
                                    <template slot-scope="{row}">
                                        <span v-if="row.roleId === 2">省级代理</span>
                                        <span v-if="row.roleId === 3">市级代理</span>
                                        <span v-if="row.roleId === 4">区/县代理</span>
                                    </template>
                                    </el-table-column>
                                <el-table-column 
                                    align="center"
                                    prop="nickName"
                                    label="微信昵称"></el-table-column>
                                <el-table-column 
                                    align="center"
                                    prop="province"
                                    label="代理区域">
                                    <template slot-scope="{row}">
                                        <span>{{row.province}} {{row.city}} {{row.county}}</span>
                                    </template>
                                    </el-table-column>
                                <el-table-column 
                                    prop="county"
                                    align="center"
                                    label="代理下级人数"></el-table-column>
                                <el-table-column
                                    prop="username"
                                    align="center"
                                    label="代理登陆帐号"></el-table-column>
                                <el-table-column
                                    prop="id"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="{row}">
                                        <el-button size="mini" type="danger" @click="delteAgent(row)">删除</el-button>
                                    </template>
                                    </el-table-column>    
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="普通用户" name="user">
                                                            
                            <el-table 
                                :indent="2"
                                :data="usersByAgentList"
                                @expand-change="expandChange">
                                <el-table-column type="expand">
                                    <template slot-scope="{row}">
                                        <p v-if="row.children && row.children.length">已授权课程</p>
                                        <el-row class="userlist" :gutter="5" v-if="row.children && row.children.length">
                                            <el-col
                                                class="useritem" 
                                                :span="4" 
                                                v-for="item in row.children" 
                                                :key="item.openId">
                                                <el-row class="inner">
                                                    <img :src="item.imgUrl">
                                                    <span>{{item.courseName}}</span>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                    align="left"
                                    prop="toInviterName"
                                    label="微信昵称">
                                    <template slot-scope="{row}">
                                        <el-row type="flex" class="nickName">
                                            <img :src="row.headimg">
                                            <span>{{row.toInviterName}}</span>
                                        </el-row>
                                    </template>
                                    </el-table-column>
                                <el-table-column
                                    prop="id"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="{row}">
                                        <el-button
                                            @click="setAuthorization(row)" 
                                            size="mini" 
                                            type="success">课程授权</el-button>
                                        <el-button
                                            @click="report(row)" 
                                            size="mini" 
                                            type="primary">报告管理</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row >
        </Page>
        <el-dialog
            title="添加代理"
            @close="showAddDialog=false"
            :visible="showAddDialog">
            <el-form label-width="80px" :rules="addDialogRules" :model="addDialogModel" ref="addAgentForm">
                <el-form-item label="所属地区" prop="direct">
                    <el-cascader 
                        filterable
                        v-model="addDialogModel.direct"
                        :options="cities" 
                        clearable 
                        :props="{ checkStrictly: true,value:'label' }"></el-cascader>
                    <span v-if="addDialogModel.direct.length" class="tip">当前选择将添加{{
                            addDialogModel.direct.length === 1 
                            ?'省'
                            :addDialogModel.direct.length === 2
                            ?'市'
                            :addDialogModel.direct.length === 3
                            ?'区/县'
                            :''
                        }}级代理</span>
                </el-form-item>
                <el-form-item label="代理账号" prop="username">
                    <el-input v-model="addDialogModel.username"></el-input>
                </el-form-item>
                <el-form-item label="代理密码" prop="password">
                    <el-input v-model="addDialogModel.password"></el-input>
                </el-form-item>
                <el-form-item label="关联微信">
                    <el-input placeholder="请输入微信昵称" v-model="nickName">
                        <el-button slot="append" icon="el-icon-search" @click="searchWxUser" ></el-button>
                    </el-input>
                    <el-row class="userlist" :gutter="5" v-if="wxUserList">
                        <template v-if="wxUserList.length">
                            <el-col
                                @click.native="chooseWxUser(item)" 
                                class="useritem" 
                                :span="8" 
                                v-for="item in wxUserList" 
                                :key="item.openId" 
                                :class="item.isActive?'active':''">
                                <el-row class="inner">
                                    <img :src="item.headimg">
                                    <span>{{item.name}}</span>
                                </el-row>
                            </el-col>
                        </template>
                        <span v-else>未搜索到相关用户</span>
                    </el-row>
                </el-form-item>
                <el-button style="width:100%" type="primary" @click="addAgent">确定添加</el-button>
            </el-form>
        </el-dialog>
        <!-- 课程授权弹框 -->
        <el-dialog title="课程授权" :visible="Boolean(showAuthDialog)" @close="showAuthDialog=false">
            <el-input placeholder="请输入课程关键字" v-model="coursName">
                <el-button slot="append" icon="el-icon-search" @click="searchCours"></el-button>
            </el-input>
            <el-row class="userlist" :gutter="5" v-if="coursList">
                <template v-if="coursList.length">
                    <el-col
                        @click.native="chooseCours(item)" 
                        class="useritem" 
                        :span="8" 
                        v-for="item in coursList" 
                        :key="item.openId" 
                        :class="item.isActive?'active':''">
                        <el-row class="inner">
                            <img :src="item.imgUrl">
                            <span>{{item.name}}</span>
                        </el-row>
                    </el-col>
                </template>
                <span v-else>未搜索到相关课程</span>
            </el-row>
             <el-button style="width:100%;margin-top:20px;" type="primary" @click="auth" size="mini">授权</el-button>
        </el-dialog>
    </div>
</template>

<script>
import cities from '@/assets/js/cities.js';
import {$addAgent,$getUsers,$getAgentUsers,$getUserByAgent,$getCourse,$authorizeCourseToUser,$authedCourse,$deleteAgent} from '@/api/index';
export default {
    data(){
        return {
            coursName:"",
            coursList:null,
            showAuthDialog:false,
            agentLevel:["超级管理员",'省级代理','市级代理','区/县代理'],//代理级别枚举
            usersByAgentList:[],//普通用户列表
            agentUsers:[],//获取到的列表数据
            nickName:"",
            wxUserList:null,
            cities,
            activeName:"agent",
            showAddDialog:false,
            addDialogModel:{
                direct:[],
                username:'',
                password:'',
                nickName:"",
                openId:"",
            },
            addDialogRules:{
                direct:[
                    { required: true, message: '请选择区域', trigger: 'change' }
                ],
                username:[
                    { required: true, message: '请输入登录账号', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' }
                ]
            }
        }
    },
    mounted(){
        this.getAgentUsers();
    },
    methods:{
        //查询代理用户列表
        getAgentUsers(){
            const {openId,roleId} = this.$store.state.userInfo
            const params = {
                roleId,
                openId:openId || ''
            }
            // const params = {
            //     roleId:1,
            //     openId:1111
            // }
            $getAgentUsers(params).then(res=> {
                this.agentUsers = res.datas;
            })
        },
        //查询该代理下普通用户列表
        getUserByAgent(){
            const {openId,roleId} = this.$store.state.userInfo
            $getUserByAgent(openId||1111).then(res=> {
                this.usersByAgentList = res.datas;
                this.$forceUpdate()
            })
        },
        //通过微信昵称搜索一个用户
        searchWxUser(){
            if(!this.nickName) return;
            $getUsers({
                key:this.nickName,
                page:1
            }).then(res=> {
                this.wxUserList = res.datas;
            })
        },
        //添加一个代理
        addAgent(){
            this.$refs.addAgentForm.validate((res)=> {
                if(!res) return;
                let params = this.addDialogModel;
                if(!params.openId) {
                    this.$message.error(`请通过微信昵称搜索并选择一个用户`);
                    return
                }
                
                let requstParam = {
                    ...params,
                    province:params.direct[0],
                    city:params.direct[1]||'',
                    county:params.direct[2]||'',
                    roleId:params.direct.length?params.direct.length+1:''
                }

                $addAgent(requstParam).then(res=> {
                    if(res.success) {
                        this.getAgentUsers();
                        this.getUserByAgent();
                        this.$refs.addAgentForm.resetFields();
                        this.showAddDialog =false
                    }
                })
            })
        },
        //选择一个微信用户
        chooseWxUser(item){
            this.wxUserList.map(item=> item.isActive = false)
            item.isActive = true;
            this.addDialogModel.nickName = item.name;
            this.addDialogModel.openId = item.openId;
            this.$forceUpdate();
        },
        //发送个人报告
        report(row){
            this.$router.push(`/report?info=${JSON.stringify(row)}`);
        },
        tabClick(){
            if(this.activeName === 'user'){
                this.getUserByAgent();
            }else{
                this.getAgentUsers();
            }
        },
        //点击授权课程按钮
        setAuthorization(row){
            this.showAuthDialog = row
        },
        //搜索课程
        searchCours(){
            const {coursName,showAuthDialog} = this;
            $getCourse({
                key:coursName,
                page:1,
                status:1,
                openId:showAuthDialog.toInviter
            }).then(res=> {
                this.coursList = res.datas;
            })
        },
        chooseCours(item){
            item.isActive = item.isActive?false:true;
            this.$forceUpdate();
        },
        //点击授权按钮
        auth(role){
            const {coursList=[]} = this;
            const arr = [];
            if(!coursList || !coursList.length) {
                this.$message.warning("请输入课程名进行搜索，并至少选中一个");
                return
            }
            coursList.map(item => {
                if(item.isActive) arr.push(item.id);
            })
            if(!arr.length) {
                this.$message.warning("请输入课程名进行搜索，并至少选中一个");
                return
            }
            
            const params = {
                buyType:1,
                courseList:arr,
                num:5,
                openIdList:[this.showAuthDialog.toInviter]
            }
            $authorizeCourseToUser(params).then(res=> {
                if(res.success) {
                    this.showAuthDialog = null;
                    this.coursList = null;
                    this.coursName = "";
                }
            })
        },
        //表格子项展开或者关闭
        expandChange(row){
            if(row.children) return;
            const {usersByAgentList} = this;
            $authedCourse(row.toInviter).then(res=> {
                if(res.success) {
                    const obj = usersByAgentList.find(item=> item.id === row.id );
                    obj.children = res.datas;
                    this.$forceUpdate();
                }
            })
        },
        //删除一个代理
        delteAgent(row) {
            this.$confirm('此操作将删除该代理, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(res=> {
                console.log(row)
                $deleteAgent({
                    id:row.id
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .nickName {
        align-items: center;
        img {
            margin-right: 5px;
            border-radius: 50%;
            height: 40px;
            width: 40px;
        }
    }
    .tip {
        margin-left: 10px;
        font-size: 14px;
        color: #3c8dbc;
    }
    .tableWrap {
        margin-top: 20px;
    }
    .userlist {
        padding: 10px;
        background-color: #f8f8f8;
        margin-top: 10px;
        max-height: 400px;
        overflow-y: auto;
        .useritem {
            margin-bottom: 5px;
            cursor: pointer;
            .inner {
                display: flex;
                align-items: center;
            }
            img{
                width: 30px;height: 30px;
                margin-right: 5px;
                border-radius: 50%;
                outline: none;
                border: none;
            }
        }
        .active {
            .inner {
                background-color: #3c8dbc7d;
            }
        }
    }
</style>