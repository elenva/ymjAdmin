<template>
    <Page>
        <el-row slot="handleArea">
            <el-col :span="4">
                <el-button type="primary">添加代理</el-button>
            </el-col>
        </el-row>
        <el-row slot="tableArea">
            <el-Alert type="success" :closable="false">
                <p>我的代理级别：省级代理</p>
                <p>下级代理:33人</p>
            </el-Alert>
            <el-row class="tableWrap">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="下级代理" name="first"/>
                    <el-tab-pane label="普通用户" name="second"/>
                </el-tabs>
            </el-row>
        </el-row >
    </Page>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .tableWrap {
        margin-top: 20px;
    }
</style>