<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="6" class="logo" :class="titleCtrl.collapsed?'logo-collapse-width':'logo-width'">
        <transition name="fade">
          <div v-if='!sysNameShow'>审图常见问题审查工具</div>
          <div v-if='sysNameShow'>审图</div>
        </transition>
      </el-col>
      <el-col :span="14" :style="backgroundImage">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify" style="font-size:14px;"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" />{{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {appUtil} from '../config'

  export default {
    data() {
      return {
        backgroundImage: {
          'background-image': "url(" + require("../assets/logo.png") + ")",
          'background-repeat': 'no-repeat',
          'background-position': '50px'
        },
        sysNameShow:false,
        sysUserName: appUtil.getCurrentUser().fullName
      }
    },
    props: ['titleCtrl'],
    created: function () {
    },
    methods: {
      collapse: function() {
        this.titleCtrl.collapsed=!this.titleCtrl.collapsed;
        this.sysNameShow = !this.sysNameShow;
      },
      logout: function () {
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning '
        }).then(() => {
          sessionStorage.removeItem('user');
          this.$router.push('/login');
        }).catch(() => {
        });
      }
    }
  }

</script>

<style scoped lang="less">
  // 过渡状态
  .fade-enter-active {
    transition: all 1.3s ease-out;
  }
  .fade-leave-active {
    transition: all .1s ease-out;
  }
  .fade-enter{
    transform: translateX(20px);
    opacity: 0;
  }

  .container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
      height: 60px;
      line-height: 60px;
      background: #20a0ff;
      color:#fff;
      .logo{
        height:60px;
        font-size: 20px;
        padding-left:10px;
        padding-right:10px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
        &.logo-width{
          width: 230px;
        }
        &.logo-collapse-width{
          width:64px
        }
      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        cursor: pointer;
        .userinfo-inner {
          color:#fff;
          img{
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }

      }
    }
	}
</style>
