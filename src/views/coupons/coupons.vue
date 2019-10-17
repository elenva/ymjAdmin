<template>
    <div>
        <Page @change="pageChange" :tableData="formData.datas">
            <el-row type="flex" slot="handleArea">
                <el-col :span="18">
                    <el-button type="primary" @click="addCoupon">添加优惠券</el-button>
                    <!-- <el-button type="danger">删除优惠券</el-button> -->
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="请输入关键字" maxlength="20" v-model="keyword">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row  slot="tableArea">
                <el-table border :data="formData.datas">
                    <el-table-column
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        prop="keyword2"
                        label="使用限制">
                    </el-table-column>
                    <el-table-column
                        prop="keyword1"
                        label="金额">
                    </el-table-column>
                    <el-table-column
                        prop="beginTime"
                        label="开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        label="结束时间">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="地址">
                        <template>
                            <el-button type="danger" size="small">删除</el-button>
                            <el-button type="primary" size="small">发送</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </Page>
    <!-- 添加优惠券 -->
        <el-dialog 
            title="添加优惠券"
            width="400px"
            @close="closeAddModal"
            :visible="showAddModal">
            <el-form :model="formModel" :rules="rules" ref="addForm" >
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="formModel.name" ></el-input>
                </el-form-item>
                <el-form-item label="优惠券限制"  prop="keyword2">
                    <el-input v-model="formModel.keyword2"></el-input>
                </el-form-item>
                <el-form-item label="优惠券价值" prop="keyword1">
                    <el-input-number 
                        v-model="formModel.keyword1" 
                        :min="0" 
                        label="单位:元"></el-input-number>
                </el-form-item>
                <el-form-item label="有效时间" prop="rangeTime">
                    <el-date-picker
                        style="width:360px"
                        v-model="formModel.rangeTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-row>
                <el-button type="primary" @click="addFormSubmit">提交</el-button>
                <el-button @click="addFormReset">重置</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import { $getCoupons,$addCoupons } from '@/api/index.js'
    export default {
        data(){
            return {
                formData:[],
                keyword:'',
                showAddModal:false,//显示添加优惠券的模态框
                formModel:{
                    rangeTime:[],
                    // beginTime:'',
                    // endTime:'',
                    keyword1:1,//抵扣价格
                    keyword2:'',//满减
                    name:'',
                },
                rules:{
                    rangeTime:[
                        {required:true,message:"请选择开始结束时间",trigger:'change'}
                    ],
                    keyword1:[
                        {required:true,message:"请输入优惠券金额",trigger:'change'}
                    ],
                    keyword2:[
                        {required:true,message:"请输入优惠券限制",trigger:'change'}
                    ],
                    name:[
                        {required:true,message:"请输入优惠券名称",trigger:'change'}
                    ],
                }
            }
        },
        mounted(){
            this.getCoupons()
        },
        methods:{
            getCoupons(data){
                let params ={
                    page:1,
                    key:this.keyword
                }
                if(data) params ={...params,...data}
                $getCoupons(params).then(res=> {
                    console.log(res)
                    this.formData = res;
                })
            },
            //搜索
            search(){
                if(!this.keyword) return;
                this.getCoupons();
            },
            //pageChange
            pageChange(page){
                this.getCoupons({page})
            },
            //添加优惠券
            addCoupon(){
                this.showAddModal = true
            },
            //关闭添加优惠券弹窗
            closeAddModal(){
                this.showAddModal = false;
            },
            //提交添加优惠券表单
            addFormSubmit(){
                this.$refs.addForm.validate(res=> {
                    if(res) {
                        const params= {
                            ...this.formModel,
                            beginTimeStamp:new Date(this.formModel.rangeTime[0]).getTime(),
                            endTimeStamp:new Date(this.formModel.rangeTime[1]).getTime()
                        }
                        $addCoupons(params).then(res=> {
                            this.closeAddModal();
                            this.addFormReset();
                            this.getCoupons();
                        })
                    }
                })
            },
            //重置添加优惠券表单
            addFormReset(){
                this.$refs.addForm.resetFields();
            }
        }
    }
</script>

<style scoped lang="scss">

</style>