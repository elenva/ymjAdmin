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
                    <p>我的代理级别：省级代理</p>
                    <p>下级代理:33人</p>
                </el-Alert>
                <el-row class="tableWrap">
                    <!-- @tab-click="handleClick" -->
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="下级代理" name="agent"/>
                        <el-tab-pane label="普通用户" name="user"/>
                    </el-tabs>
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
                            label="代理区域"></el-table-column>
                        <el-table-column 
                            prop="county"
                            align="center"
                            label="代理下级人数"></el-table-column>
                        <el-table-column
                            prop="username"
                            align="center"
                            label="代理登陆帐号"></el-table-column>
                        <el-table-column
                            prop="password"
                            align="center"
                            label="代理登陆密码"></el-table-column>
                    </el-table>
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
                                <img :src="item.headimg">
                                <span>{{item.name}}</span>
                            </el-col>
                        </template>
                        <span v-else>未搜索到相关用户</span>
                    </el-row>
                </el-form-item>
                <el-button style="width:100%" type="primary" @click="addAgent">确定添加</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import cities from '@/assets/js/cities.js';
import {$addAgent,$getUsers,$getAgentUsers} from '@/api/index';
export default {
    data(){
        return {
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
        //查询代理相关用户列表
        getAgentUsers(){
            const params = {
                roleId:1,
                openId:111
            }
            $getAgentUsers(params).then(res=> {
                this.agentUsers = res.datas;
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
        }
    }
}
</script>

<style lang="scss" scoped>
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
        .useritem {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            cursor: pointer;
            img{
                width: 30px;height: 30px;
                margin-right: 5px;
                border-radius: 50%;
                outline: none;
                border: none;
            }
        }
        .active {
            background-color: #3c8dbc7d;
        }
    }
</style>