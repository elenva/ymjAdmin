<template>
    <div>
        <Page @change="pageChange" :tableData="formData" v-if="formData">
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
                        <template slot-scope="{row}">
                            <el-button 
                                type="danger" 
                                size="mini" 
                                @click="del(row)">删除</el-button>
                            <el-button 
                                type="primary" 
                                size="mini" 
                                @click="send(row)">发送</el-button>
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
        <!-- 发送给用户 -->
        <el-dialog 
            :visible="Boolean(showSendDialog)" 
            width="1000px" 
            @close="showSendDialog=false">
            <el-radio-group v-model="sendDialogRadio">
                <el-radio label="1">指定用户</el-radio>
                <el-radio label="2">全部用户</el-radio>
            </el-radio-group>
            <UserList
                v-if="sendDialogRadio === '1'" 
                :selection="true" 
                @selectedRow="selectedRow"/>
            <div style="text-align:right">
                <el-button type="primary" @click="sendModalSure">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { $getCoupons,$addCoupons,$delCoupon,$postCouponToUser } from '@/api/index.js';
    import UserList from '@/components/UserList';
    export default {
        data(){
            return {
                selectedRows:[],
                sendDialogRadio:'1',
                showSendDialog:false,
                formData:null,
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
                currentPage:1,
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
        components:{UserList},
        methods:{
            getCoupons(data){
                let params ={
                    page:this.currentPage,
                    key:this.keyword
                }
                if(data) params ={...params,...data}
                $getCoupons(params).then(res=> {
                    this.formData = res;
                })
            },
            //搜索
            search(){
                this.getCoupons();
            },
            //pageChange
            pageChange(page){
                this.currentPage = page;
                this.$nextTick(()=> this.getCoupons());
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
            },
            //删除优惠券
            del(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $delCoupon(row.id).then(res=> {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCoupons({page:1});
                    })
                })
                
            },
            //把优惠券发送给用户
            send(row) {
                this.showSendDialog = row.id;
            },
            //选择用户表格选中事件
            selectedRow(rows){
                this.selectedRows = rows;
                console.log(rows)
            },
            //选择用户模态框确认事件
            sendModalSure(){
                const {selectedRows,sendDialogRadio,showSendDialog} = this;
                const openIds = [];
                selectedRows.length && selectedRows.map(item=> {
                    openIds.push(item.openId);
                })
                const params = {
                    id:showSendDialog,
                    openIds,
                    sendDialogRadio
                }

                $postCouponToUser(params).then(res=> {
                    this.$message.success(`操作成功`);
                    this.showSendDialog = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">

</style>