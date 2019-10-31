<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <img src="../../assets/images/logo.svg" width="100" height="100" alt="">
        <p>{{ $Config.siteName }}</p>
      </div>
      <el-input
          placeholder="请输入用户名"
          suffix-icon="fa fa-user"
          v-model="username"
          style="margin-bottom: 18px"
      >
      </el-input>

      <el-input
          placeholder="请输入密码"
          suffix-icon="fa fa-keyboard-o"
          v-model="password"
          type="password"
          style="margin-bottom: 18px"
          @keyup.native.enter="login"
      >
      </el-input>

      <el-button
          type="primary" :loading="loginLoading"
          style="width: 100%;margin-bottom: 18px"
          @click.native="login"
      >登录
      </el-button>
      <div>
        <!-- <el-checkbox v-model="Remenber"> Remenber</el-checkbox> -->
        <!-- <a href="javascript:;" style="float: right;color: #3C8DBC;font-size: 14px">Register</a> -->
      </div>

    </div>
  </div>
</template>

<script>
  import {setToken} from '../../utils/dataStorage'
  import {$login} from '@/api/index.js'

  export default {
    data() {
      return {
        username: '',
        password: '',
        Remenber: true,
        loginLoading: false
      }
    },
    methods: {
      login() {
        const {username,password} = this;
        this.loginLoading = true;
        //loginApi({userNmae:this.userNmae,password:this.password}).then(r=>{}).catch(_=>{})
        $login({username,password}).then(res=> {
          this.loginLoading = false;
          if(res.success) {
            this.$store.commit("setUserInfo",res.datas)
            this.$router.push({path:"/"})
            this.$notify({
              title: '登录成功',
              message: "",
              type: 'success'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "Login.scss";
</style>
