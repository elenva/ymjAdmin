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
    <div id="icp">
      <a href="http://www.beian.miit.gov.cn">
        蜀ICP备19034242号
      </a>
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
        if(!username || !password) {
          this.$message.warning(`帐号密码不可为空`);
          return
        }
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
        }).catch(res => this.loginLoading = false)
      }
    }
  }
</script>

<style lang="scss">
  @import "Login.scss";
  #icp {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 30px;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    z-index: 100;
    width: 100%;
    background:#000;
  }
</style>
