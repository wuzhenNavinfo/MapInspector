<template>
  <el-row class="container">
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
            <el-menu-item index="/manager/alreadyAudit">已审核</el-menu-item>
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
            <el-menu-item index="/worker/alreadyWork">已提交</el-menu-item>
            <el-menu-item index="/worker/alreadyCompleted">已完成</el-menu-item>
            <el-menu-item index="/worker/caseList">案例列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航其他</span>
          </el-menu-item>
        </el-menu>
        <el-menu v-if="userRole == 'superManager'" default-active="/user/waitAuditList" :unique-opened="true" :collapse="pageCtrl.collapsed" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">注册账号审核</span>
            </template>
            <el-menu-item index="/user/waitAuditList">待审核</el-menu-item>
            <el-menu-item index="/user/auditedList">审核通过</el-menu-item>
            <el-menu-item index="/user/auditNoPass">审核不通过</el-menu-item>
          </el-submenu>
        </el-menu>
      </aside>
      <section class="content-container scroll_style" style='over-flow:auto;'>
        <router-view></router-view>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import FrameTitle from './FrameTitle'
import AlreadWork from './worker/alreadyWork'
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
          collapsed: false,
        }
      }
    },
    components: {
      FrameTitle,
      AlreadWork
    },
    created: function () {
      this.userRole = appUtil.getCurrentUser().role;
      // this.userRole = 'superManager';
      if (this.userRole == 'manager') {
        this.handleSelect(1, [1, '/manager/waitWork']);
        return;
      }
      if (this.userRole == 'worker') {
        this.handleSelect(1, [1, '/worker/waitWork']);
        return;
      }
      if (this.userRole == 'superManager') {
        this.handleSelect(1, [1, '/user/waitAuditList']);
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
		.main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside{
        flex:0 0 230px;
        width: 230px;
        .el-menu {
          height: 100%;
        }
      }
      .menu-collapsed{
        flex:0 0 64px;
        width: 64px;
      }
      .menu-expanded{
        flex:0 0 230px;
        width: 230px;
      }
    }
	}
  .content-container {
    flex:1;
  }

</style>
