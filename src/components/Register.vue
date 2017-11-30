<template>
  <div class="parent scroll_style">
    <div class="change"></div>
    <div class="stable">
      <img style="height:60px;margin-bottom:10px;" src="../assets/logo.png">
      <el-form :model="registerForm" :rules="registerRules" :status-icon="true" ref="registerForm" class="login-container">
        <h1 class="title">用户注册</h1>
        <el-form-item prop="userName">
          <el-input type="text" v-model="registerForm.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="fullName">
          <el-input type="text" v-model="registerForm.fullName" auto-complete="off" placeholder="全称"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="cellPhone">
          <el-input type="text" v-model="registerForm.cellPhone" auto-complete="off" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="company">
          <el-input type="text" v-model="registerForm.company" auto-complete="off" placeholder="所属公司"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input type="password" v-model="registerForm.rePassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="submitRegister" :loading="registering">注册</el-button>
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
      registering: false,
      registerForm: {
      },
      registerRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        fullName: [
          { required: true, message: '请输入全称', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        company:[
          { required: true, message: '请输入所属公司', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        rePassword: [
          { validator: validatePass,  trigger: 'blur' },
        ]
      },
      checked: true
    }
  },
  methods: {
    initRegisterForm () {
      this.$refs.registerForm.resetFields();
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
    register(param) {
      let that = this;
      that.registering = true;
      registerApi(param).then(function (data) {
        that.registering = false;
        let { errorCode, message,  result } = data;
        if (errorCode == 0) {
          that.$message({
            message: '注册成功，请联系管理员进行审核!',
            type: 'success'
          });
        } else {
          that.$message({
            message: message,
            type: 'error'
          });
        }
      })
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

