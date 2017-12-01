<template>
  <div class="parent scroll_style">
    <div class="change"></div>
    <div class="stable">
      <img style="height:60px;margin-bottom:10px;" src="../assets/logo.png">
      <el-form :model="ruleForm" :rules="rules" :status-icon="true" ref="ruleForm" class="login-container">
        <h1 class="title">密码重置</h1>
        <el-form-item prop="userName">
          <el-input type="text" v-model="ruleForm.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword" auto-complete="off" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item prop="reNewPassword">
          <el-input type="password" v-model="ruleForm.reNewPassword" auto-complete="off" placeholder="再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkNo">
          <el-input width='50px' type="password" v-model="ruleForm.checkNo" auto-complete="off" placeholder="验证码"></el-input>
          <el-button type="primary" @click.native.prevent="sendCheckNo"  plain size="small">发送验证码到邮箱</el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">重置</el-button>
        </el-form-item>
        <div class="page-link">
          <span @click='toLogin'>登录</span>
        </div>
      </el-form>
    </div>
    <div class="change"></div>
  </div>
</template>

<script>
import { login, getPassportApi, resetPwdApi } from '../dataService/api';
import { appUtil } from '../config';
let _ = require('lodash');

export default {
  name: 'Login',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      ruleForm: {
        userName: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        reNewPassword: [
          { validator: validatePass,  trigger: 'blur' },
        ],
        checkNo: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    initRuleForm () {
      this.$refs.ruleForm.resetFields();
    },
    sendCheckNo() {
      let userName = _.trim(this.ruleForm.userName);
      if(!userName) {
        this.$refs.ruleForm.validateField('userName');
        return;
      }
      let that = this;
      getPassportApi({userName: userName}).then(data => {
        if (data.errorCode === 0) {
          that.$message({  message: '验证码已经发送到邮箱！', type: 'success' });
        } else {
          that.$message({  message: '验证码发送失败，请重新发送！', type: 'error' });
        }
      });
    },
    handleSubmit() {
      var that = this;
      this.$refs.ruleForm.validate(function (valid) {
        if (valid) {
          var loginParams = {
            userName: _.trim(that.ruleForm.userName),
            password: _.trim(that.ruleForm.newPassword),
            passport: _.trim(that.ruleForm.checkNo)
          };
          that.logining = true;
          resetPwdApi(loginParams).then(function (data) {
            that.logining = false;
            let { errorCode, message, result } = data;
            if (errorCode == 0) {
              that.$message({
                message: '密码重置成功，请重新登录！',
                type: 'success'
              });
              that.$router.push('/login');
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
    toLogin() {
      this.$router.push('/login');
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

