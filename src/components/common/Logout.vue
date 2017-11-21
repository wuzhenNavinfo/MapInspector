<template>
  <el-dropdown trigger="hover">
    <i class="el-icon-tickets icon-dropdown" style="cursor:pointer;color:white" ></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="gotoMainPage">返回主页</el-dropdown-item>
      <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    gotoMainPage() {
      this.$router.push('/mainFrame');
    },
    logout: function () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning '
      }).then(() => {
        // sessionStorage.removeItem('user');
        this.$router.push('/login');
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped lang="less">
  .open-return-page {
     right: 330px;
  }
  .close-return-page {
     right: 0px;
  }
  .icon-dropdown {
    background-color:#20a0ff;
    padding:10px;
    border-radius: 8px 8px 8px 8px;
  }
</style>
