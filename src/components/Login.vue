<template>
  <div class="parent scroll_style">
    <div class="change"></div>
    <div class="stable">
      <img style="height:60px;margin-bottom:10px;" src="../assets/logo.png">
      <el-form :model="ruleForm" :rules="rules" :status-icon="true" ref="ruleForm" class="login-container">
        <h1 class="title" >系统登录</h1>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" @keyup.enter.native="handleSubmit()" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
        <div class="page-link">
          <span @click='toResetPassword'>重置密码</span>
          <span @click='toRegister'>用户注册</span>
        </div>
      </el-form>
    </div>
    <div class="change"></div>
  </div>
</template>

<script>
import { login, registerApi } from '../dataService/api';
import { appUtil } from '../config';

export default {
  name: 'Login',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      ruleForm: {
        account: '',
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
    initRuleForm () {
      this.$refs.ruleForm.resetFields();
    },
    submitRegister () {
      var that = this;
      this.$refs.registerForm.validate(function (valid) {
        if (valid) {
          var param = {
            userName: that.registerForm.userName,
            fullName: that.registerForm.fullName,
            password: that.registerForm.password,
            cellPhone: that.registerForm.cellPhone,
            email: that.registerForm.email,
            company: that.registerForm.company
          };
          that.register(param);
        }
      });
    },
    handleSubmit() {
      var that = this;
      this.$refs.ruleForm.validate(function (valid) {
        if (valid) {
          var loginParams = { userName: that.ruleForm.account, password: that.ruleForm.checkPass };
          that.logining = true;
          login(loginParams).then(function (data) {
            that.logining = false;
            let { errorCode, message,  result } = data;
            if (errorCode == 0) {
              if (result.status==0) {
                that.$message({ message: '此账号还未审核通过，请先联系管理员进行审核！', type: 'error' });
              } else {
                appUtil.setCurrentUser(result);
                that.$router.push('/mainFrame');
              }
            } else {
              that.$message({
                message: message,
                type: 'error'
              });
            }
          })
        }
      });
    },
    toRegister() {
      this.$router.push('/register');
    },
    toResetPassword() {
      this.$router.push('/resetPassword');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .parent{
    height: 100%;
    display:flex; /*设为伸缩容器*/
    flex-flow:row; /*伸缩项目单行排列*/
    align-items: center; /* 上下居中 */
    background-image: url(../assets/login_back.png);
    background-size: 100% 100%;
    background-position: 50%;
    .stable{
      width:450px; /*固定宽度*/
    }
    .change{
      flex:1; /*这里设置为占比1，填充满剩余空间*/
    }
  }
</style>

