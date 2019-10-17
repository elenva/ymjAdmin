<template>
    <Page>
        <el-row type="flex" slot="handleArea">
            <el-col :span="6">
                <el-input placeholder="请输入关键字" maxlength="20">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row  slot="tableArea">
            <el-table border>
                <el-table-column
                    prop="date"
                    label="日期">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                    <template>
                        <el-button type="danger" size="small">删除</el-button>
                        <el-button type="primary" size="small">发送</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </Page>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>