<template>
    <Page :tableData="tableData" @change="pageChange">
        <el-row type="flex" slot="handleArea">
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
                    <el-option label="审核中" :value="1"/>
                    <el-option label="提现成功" :value="2"/>
                    <el-option label="提现失败" :value="3"/>
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
                            @click="handlePass(row)" 
                            size="mini" 
                            type="primary">通过</el-button>
                        <el-button
                            @click="handleCancel(row)" 
                            size="mini" 
                            type="danger">不通过</el-button>    
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </Page>
</template>

<script>
import {$getPutList,$updatePut} from '@/api/index';
import Page from '@/components/Page';

export default {
    data(){
        return {
            type:1,
            key:'',
            page:1,
            tableData:null
        }
    },
    mounted(){
        this.getPutList()
    },
    methods:{
        getPutList(){
            const {key,page,type} = this;
            const params = {
                key,page,type
            }
            $getPutList(params).then(res=> {
                this.tableData = res;
            })
        },
        selectChange(){
            this.page = 1;
            this.$nextTick(()=>this.getPutList())
        },
        //审核通过
        handlePass(row){
            row.status = 2;
            this.updatePut(row);
        },
        //审核取消
        handleCancel(row){
            this.$prompt('请输入提现失败的原因', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                row.status = 3;
                row.refuseRemark = value;
                this.updatePut(row);
            })   
        },
        //更新某条审核的状态
        updatePut(row){
            $updatePut(row).then(res=> {
                this.page = 1;
                this.$nextTick(()=> {
                    this.getPutList()
                })
            })
        },
        pageChange(page){
            this.page = page;
            this.$nextTick(()=> this.getPutList())
        }
    },
    components:{
        Page
    }
}
</script>

<style lang="scss" scoped>

</style>