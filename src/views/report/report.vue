<template>
    <div>
        <page>
            <el-row type="flex" slot="handleArea" >
                <el-Alert type="success"  :closable="false">
                    微信昵称:{{info.toInviterName}}
                </el-Alert>
            </el-row>
            <el-row slot="tableArea" >
                <el-row>
                    <el-button type="primary" @click="openAddDialog">添加报告</el-button>
                </el-row>
                <el-row class="tableWrap">
                    <el-table :data="list">
                        <el-table-column label="发送时间" prop="createTime" align="center"/>
                        <el-table-column label="标题" prop="title" align="center"/>
                        <el-table-column label="操作" prop="createTime" align="center">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="preview(row)">内容预览</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-row>
        </page>
        <el-dialog 
            width="1000px"
            title="添加报告"
            @close="addDialogClose"
            :visible="showAddDialog">
            <el-row class="titleWrap">
                <el-input v-model="title" placeholder="请输入标题" :disabled="previewFlag"></el-input>
            </el-row>
            <el-row>
                <quillEditor v-model="content" :options="editorOption" style="height:500px;" :disabled="previewFlag"/>
            </el-row>
            
            <el-row class="btnWrap" >
                <el-button class="btn" type="primary" @click="addReport"  v-if="!previewFlag" :disabled="previewFlag">确定添加</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
    import {$getReport,$addReport} from '@/api/index.js';
    export default {
        components:{quillEditor},
        data(){
            return {
                title:'',
                previewFlag:false,
                showAddDialog:false,
                content:"",
                editorOption:{
                    theme: 'snow',
                    readOnly: true,
                },
                list:[]
            }
        },
        computed:{
            info(){
                return JSON.parse(this.$route.query.info)
            },
            userInfo(){
                return this.$store.state.userInfo
            }
        },
        mounted(){
            console.log(this.info)
            this.getReport();
        },
        methods:{
            getReport(){
                $getReport(this.info.toInviter).then(res=> {
                    this.list = res.datas;
                })
            },
            openAddDialog(){
                this.content = "";
                this.showAddDialog=true
            },
            addReport(){
                if(!this.content || !this.title) {
                    this.$message.warning(`标题或者内容不可为空！`)
                    return
                }

                const params = {
                    content:this.content,
                    openId:this.info.toInviter,
                    sysOpenId:this.userInfo.openId || '',
                    title:this.title
                }
                $addReport(params).then(res=> {
                    if(res.success) {
                        this.getReport();
                        this.showAddDialog = false;
                    }
                })
            },
            preview(row) {
                this.content = row.content;
                this.showAddDialog=true;
                this.previewFlag = true;
            },
            addDialogClose(){
                this.showAddDialog=false;
                this.previewFlag = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .titleWrap {
        margin-bottom: 20px;
    }
    .tableWrap {
        margin-top: 20px;
    }
    .btnWrap {
        text-align: center;
        min-height: 60px;
        margin-top: 80px;
        .btn {
            text-align: center;
            width: 300px;
        }
    }
    
</style>