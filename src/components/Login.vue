<template>
  <div class="parent">
    <div class="change"></div>
    <div class="stable">
      <el-form :model="ruleForm" :rules="rules" :status-icon="true" ref="ruleForm" class="login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="change"></div>
  </div>
</template>

<script>
import { login } from '../dataService/api';

export default {
  name: 'Login',
  data () {
    return {
      logining: false,
      ruleForm: {
        account: 'wuzhen',
        checkPass: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    }
  },
  methods: {
    handleSubmit() {
      var that = this;
      this.$refs.ruleForm.validate(function (valid) {
        if (valid) {
          that.logining = true;
          var loginParams = { username: that.ruleForm.account, password: that.ruleForm.checkPass };
          loginParams = { pageSize: 2, pageNum: 1 };
          login(loginParams).then(function (data) {
            console.info(that);
            console.info(data);
            // let { msg, code, user } = data;
            if (data) {
              that.logining = false;
              sessionStorage.setItem('user',data)
              that.$router.push('/home');
            }
          })
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .parent{
    height: 100%;
    display:flex; /*设为伸缩容器*/
    flex-flow:row; /*伸缩项目单行排列*/
    align-items: center; /* 上下居中 */
    background-image: url(../assets/bg.jpg);
    background-size: 100% 100%;
    background-position: 50%;
  }
  .stable{
    width:450px; /*固定宽度*/
  }
  .change{
    flex:1; /*这里设置为占比1，填充满剩余空间*/
  }
  .login-container {
    border-radius: 5px;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login-container .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
  .login-container .remember {
        margin: 0px 0px 15px 0px;
      }
</style>
