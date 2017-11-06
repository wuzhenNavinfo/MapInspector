<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="6" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <transition name="fade">
          <div v-if='sysNameShow'>{{sysName}}</div>
        </transition>
      </el-col>
      <el-col :span="14">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" /> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-menu default-active="/tableView" :unique-opened="true" :collapse="collapsed" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航菜单</span>
            </template>
            <el-menu-item index="where">待审核</el-menu-item>
            <el-menu-item index="/tableView">已审核</el-menu-item>
            <el-menu-item index="/manager/waitWork" >案例列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航其他</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <section class="content-container" style="overflow-y:auto">
        <!-- <table-view></table-view> -->
        <router-view></router-view>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import TableView from './TableView'

  export default {
    data() {
      return {
        sysName:'图审项目',
        sysNameShow:true,
        collapsed:false,
        sysUserName: '吴振',
        sysUserAvatar: '',
      }
    },
    components: {
      TableView
    },
    methods: {
      collapse: function() {
        this.collapsed=!this.collapsed;
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

        this.$router.push(index);
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
    width:66px
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
    flex:0 0 60px;
    width: 60px;
  }
	.container .main .menu-expanded{
    flex:0 0 230px;
    width: 230px;
  }

  .content-container {
    flex:1;
    padding: 10px;
  }

</style>
