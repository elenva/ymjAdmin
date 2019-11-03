<template>
    <div class="wrap">
        <div>
            <slot name="handleArea"/>
        </div>
        <div class="tableWrap">
           <slot name="tableArea"/>
        </div>
        <div class="pagenationWrap" v-if="tableData">
            <el-pagination
                @current-change="currentChange"
                background
                layout="prev, pager, next"
                :total="tableData?tableData.total:0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:['tableData'],
        methods:{
            currentChange(pg){
                this.$emit('change',pg)
            },
        },
        mounted(){
            console.log(this.tableData)
        }
    }
</script>

<style lang="scss" scoped>
.wrap{
    .tableWrap {
        margin-top: 30px;
    }
    .pagenationWrap {
        margin-top: 20px;
        text-align: right;
    }
}

</style>