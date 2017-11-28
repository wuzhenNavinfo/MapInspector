<template>
  <div class="parent">
    <div class="change"></div>
    <div class="stable">
      <img style="height:60px;margin-bottom:10px;" src="../assets/logo.png">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane  label="登录" name="loginTab">
          <el-form :model="ruleForm" :rules="rules" :status-icon="true" ref="ruleForm" class="login-container">
            <el-form-item prop="account">
              <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" @keyup.enter.native="handleSubmit()" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="registerTab">
          <el-form :model="registerForm" :rules="registerRules" :status-icon="true" ref="registerForm" class="login-container">
            <el-form-item prop="userName">
              <el-input type="text" v-model="registerForm.userName" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="fullName">
              <el-input type="text" v-model="registerForm.fullName" auto-complete="off" placeholder="昵称"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="rePassword">
              <el-input type="password" v-model="registerForm.rePassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="registerForm.role">
                <el-radio :label="1">作业员</el-radio>
                <el-radio :label="2">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click.native.prevent="submitRegister" :loading="registering">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
      activeName: 'loginTab',
      logining: false,
      registering: false,
      ruleForm: {
        account: '',
        checkPass: ''
      },
      registerForm: {
        role: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      registerRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        fullName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
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
    tabClick(tab, event) {
      if (tab.name == 'loginTab') {
        this.initRuleForm();
      } else {
        this.initRegisterForm();
      }
    },
    initRuleForm () {
      this.activeName = 'loginTab';
      this.$refs.ruleForm.resetFields();
    },
    initRegisterForm () {
      this.activeName = 'registerTab';
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
            role: that.registerForm.role,
            email: 'wuzhen@navinfo2.com'
          };
          if (param.role == 2) {
            that.$confirm('注册的角色是管理员？', '确认', {
              type: 'warning '
            }).then(() => {
              that.register(param);
            })
          } else {
            that.register(param);
          }
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
            message: '注册成功，请重新登录!',
            type: 'success'
          });
          that.initRuleForm()
        } else {
          that.$message({
            message: message,
            type: 'error'
          });
        }
      })
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
              console.log(result)
              appUtil.setCurrentUser(result);
              that.$router.push('/mainFrame');
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
    loginSubmit() {

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
      opacity: .8;
    }
    .change{
      flex:1; /*这里设置为占比1，填充满剩余空间*/
    }
  }

  .login-container {
    border-radius: 0px 0px 5px 5px;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .remember {
      margin: 0px 0px 15px 0px;
    }
  }
</style>
<style lang="less">
  .el-tabs--card >.el-tabs__header .el-tabs__item.is-active {
     color: #ffffff;
     font-size: 18px;
  }
  .el-tabs--card >.el-tabs__header .el-tabs__item {
     color:#409EFF;
  }

  .el-tabs--card {
    & .el-tabs__header {
      margin: 0px;
      border-bottom-width: 0px;
    }
  }
  .el-tabs__item{
    padding: 0 75px;
  }
  .el-tabs__nav > div {
    width: 210px;
  }
</style>

