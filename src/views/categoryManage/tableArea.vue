<template>
    <div v-if="info" class="wrap">
        <el-row class="buttonWrap">
            <el-col :span="18" class="title">{{info.name||''}}</el-col>
            <el-col :span="6" class="buttons">
                <el-button
                    @click="add()" 
                    type="primary" 
                    size="mini">添加子类别</el-button>
            </el-col>
            
        </el-row>
        <el-table
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :data="info.children">
            <el-table-column
                label="图标"
                width="100px"
                prop="icon_img">
                <template slot-scope="{row}">
                    <img :src="row.icon_img" class="icon">
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="name" 
                label="类别名">
            </el-table-column>
            <el-table-column
                align="center" 
                label="操作">
                <template slot-scope="{row}">
                    <el-button type="danger" size="mini">删除</el-button>
                    <el-button type="success" size="mini">修改</el-button>
                    <el-button
                        @click="add(row)"
                        type="primary" 
                        size="mini" 
                        v-if="row.id===5 || row.pid === 5">添加子类</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <tableArea :info="info"/> -->
        <el-dialog
            width="475px" 
            :visible="Boolean(showDialog)" 
            :title="dialogTitle" 
            @close="showDialog=false">
            <el-form
                ref="addDialogForm" 
                :model="addDialogModel" 
                :rules="addDialogRule" 
                label-width="80px">
                <el-form-item label="子类名" prop="name">
                    <el-input v-model="addDialogModel.name"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon_img" ref="upIcon">
                    <el-upload
                        action="''"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="beforeUpload">
                        <img 
                            v-if="addDialogModel.icon_img" 
                            :src="addDialogModel.icon_img" class="uploadIcon">
                        <div v-else class="uploader">
                            <i  class="el-icon-plus"></i>
                        </div>
                    </el-upload>
                </el-form-item>
                <div class="btnWrap">
                    <el-button 
                        type="primary" 
                        class="button" 
                        @click="addAjax">添加</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {$saveFile,$setCategory} from '@/api/index';
export default {
    name:"tableArea",
    props:["info"],
    data(){
        return {
            dialogTitle:"",
            showDialog:false,
            addDialogModel:{
                icon_img:"",
                name:""
            },
            addDialogRule:{
                icon_img:[
                    { required: true, message: '请上传图标', trigger: 'change' }
                ],
                name:[
                    { required: true, message: '请输入子类名', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        add(row){
            const infoName = this.info.name;
            this.dialogTitle = row?`给${row.name}添加子类`:`给${infoName}添加子类`
            this.showDialog = row || this.info
        },
        beforeUpload(f){
            $saveFile('img',f.raw).then(res=> {
                this.addDialogModel.icon_img = res;
                const upIcon = this.$refs.upIcon
                upIcon.clearValidate();
            })
        },
        addAjax(){
            const {addDialogModel,showDialog} = this;
            this.$refs.addDialogForm.validate(err => {
                if(!err) return;
                let params = addDialogModel;
                addDialogModel.id = !showDialog.pid?'':showDialog.id
                $setCategory(addDialogModel)
                    .then(res=> {
                        if(res.success) {
                            this.showDialog = false;
                            this.$emit(`refresh`)
                        }
                    })
            })
        }
    }    
}
</script>

<style lang="scss" scoped>
    .buttonWrap {
        display: flex;
        align-items: center;
        .buttons{
            text-align:right;
        }
    }
    .wrap {
        margin-bottom: 60px;
        border:1px solid #ccc;
    }
    .icon {
        width: 40px;
        height: 40px;
        position: relative;
        top: 6px;
    }
    .uploadIcon {
        width: 100px;
        height: 100px;
    }
    .uploader {
        width: 100px;
        height: 100px;
        background-color: #ccc;
        display: table-cell;
        vertical-align: middle;
        i {
            vertical-align: middle;
        }
    }
    .btnWrap {
        text-align: center;
        .button {
            width: 120px;
        }
    }
</style>