<template>
  <el-row class="container">
    <!--
      <el-col :span="24" class="header">
        <el-col :span="6" class="logo" :class="pageCtrl.collapsed?'logo-collapse-width':'logo-width'">
          <transition name="fade">
            <div v-if='sysNameShow'>审图项目</div>
            <div v-if='!sysNameShow'>审</div>
          </transition>
        </el-col>
        <el-col :span="14" :style="backgroundImage">
          <div class="tools" @click.prevent="collapse">
            <i class="fa fa-align-justify"></i>
          </div>
        </el-col>
        <el-col :span="4" class="userinfo">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner"><img src="./assets/user.png" /> {{sysUserName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>我的消息</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
     -->
    <frame-title :titleCtrl="pageCtrl"></frame-title>
    <el-col :span="24" class="main">
      <aside :class="pageCtrl.collapsed?'menu-collapsed':'menu-expanded'">
        <el-menu v-if="userRole == 'manager'" default-active="/manager/waitWork" :unique-opened="true" :collapse="pageCtrl.collapsed" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航菜单</span>
            </template>
            <el-menu-item index="/manager/waitWork">待审核</el-menu-item>
            <!-- <el-menu-item index="/tableView">已审核</el-menu-item> -->
            <el-menu-item index="/manager/caseList" >案例列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航其他</span>
          </el-menu-item>
        </el-menu>
        <el-menu v-if="userRole == 'worker'" default-active="/worker/waitWork" :unique-opened="true" :collapse="pageCtrl.collapsed" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航菜单</span>
            </template>
            <el-menu-item index="/worker/waitWork">待作业</el-menu-item>
            <el-menu-item index="/worker/submited">已提交</el-menu-item>
            <el-menu-item index="/worker/completed">已完成</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航其他</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <section class="content-container">
        <router-view></router-view>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import TableView from './TableView'
import FrameTitle from './FrameTitle'
import {appUtil} from '../config.js'

  export default {
    data() {
      return {
        backgroundImage: {
          'background-image': "url(" + require("../assets/logo.png") + ")",
          'background-repeat': 'no-repeat',
          'background-position': '50px'
        },
        sysNameShow:false,
        sysUserName: '未知',
        userRole: 'worker',
        pageCtrl: {
          collapsed: true,
        }
      }
    },
    components: {
      TableView,
      FrameTitle
    },
    created: function () {
      let role = appUtil.getCurrentUser().role;
      console.info(appUtil.getCurrentUser());
      console.info(role);
      role = "worker";
      if (role == 'manager') {
        this.handleSelect(1, [1, '/manager/waitWork']);
        return;
      }
      if (role == 'worker') {
        this.handleSelect(1, [1, '/worker/waitWork']);
        return;
      }
    },
    methods: {
      collapse: function() {
        this.pageCtrl.collapsed=!this.pageCtrl.collapsed;
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
      },
      handleSelect: function (index, indexPath) {
        if (indexPath[1]) {
          this.$router.push(indexPath[1]);
        }
      }
    }
  }

</script>

<style scoped>
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
	}
  .container .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color:#fff;
  }
  .container .header .logo{
    height:60px;
    font-size: 22px;
    padding-left:20px;
    padding-right:20px;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
  }
  .container .header .logo.logo-width{
    width: 230px;
  }
  .container .header .logo.logo-collapse-width{
    width:64px
  }
  .container .header .tools{
    padding: 0px 23px;
    width:14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
    cursor: pointer;
  }
  .container .header .userinfo .userinfo-inner {
    color:#fff;
  }
  .container .header .userinfo .userinfo-inner img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }

  .container .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
  }
  .container .main aside{
    flex:0 0 230px;
    width: 230px;
  }
  .container .main aside .el-menu {
    height: 100%;
  }
  .container .main .menu-collapsed{
    flex:0 0 64px;
    width: 64px;
  }
	.container .main .menu-expanded{
    flex:0 0 230px;
    width: 230px;
  }

  .content-container {
    flex:1;
  }

</style>
