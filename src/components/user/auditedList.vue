<template>
  <div style="padding:6px;">
    <el-input style="width:260px;margin-bottom:2px;" class="search-filter" v-model="schfilter"
      placeholder="搜索账号，全称，公司" prefix-icon="el-icon-search"> </el-input>
    <el-table stripe border highlight-current-row max-height="100%"
      :data="tableData.data">
      <el-table-column type="index" width="50px" label="序号"> </el-table-column>
      <el-table-column width="120px" prop="userName" label="账号"> </el-table-column>
      <el-table-column prop="fullName" label="全称"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column width="160px" prop="company" label="所属公司"> </el-table-column>
      <el-table-column width="110px" prop="cellPhone" label="电话"> </el-table-column>
      <el-table-column width="80px" prop="role" label="角色">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.role=='visitor'" type="warning">游客</el-tag>
          <el-tag v-if="scope.row.role=='manager'" type="success">管理员</el-tag>
          <el-tag v-if="scope.row.role=='worker'" type="primary">作业员</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" prop="createdAt" label="注册时间"> </el-table-column>
      <el-table-column width="100px" prop="expiredAt" label="过期时间"> </el-table-column>
      <el-table-column width="180px" label="操作">
        <template slot-scope="scope" v-if="scope.row.role!='visitor'">
          <el-button size="mini" :disabled="scope.row.isExpired || scope.row.status==3" type="warning" @click="outOfService(scope.$index, scope.row, 99)">强制过期</el-button>
          <el-button v-if="scope.row.status==1" size="mini" type="danger" @click="outOfService(scope.$index, scope.row, 3)">停用</el-button>
          <el-button v-if="scope.row.status==3" size="mini" type="danger" @click="outOfService(scope.$index, scope.row, 1)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[20, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total">
    </el-pagination>
  </div>
</template>

<script>

import { queryAllUserListApi, updateUserApi  } from '../../dataService/api';
import { Utils } from '../../common/js/utils.js'

export default {
  name: 'WaitWork',
  data () {
    return {
      schfilter: '',
      pageSize: 20,
      pageNum: 1,
      tableData: [],
      tableDataClone: []
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryAllUser();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.queryAllUser();
    },
    outOfService(index, row, flag) {
      let param = {
        userId: row.id,
        status: flag
      };
      let that = this;
      updateUserApi(param).then(data => {
        that.centerDialogVisible = false;
        let {errorCode, message, result} = data;
        if (errorCode === 0) {
          that.$notify.success({ title: '提示', message: message, position: 'bottom-right', duration: 2000});
          that.queryAllUser();
        } else {
          that.$notify.error({ title: '提示', message: message, position: 'bottom-right', duration: 2000});
        }
      });
    },
    queryAllUser() {
      let that = this;
      queryAllUserListApi({status: '[1,3]', pageSize: this.pageSize, pageNum: this.pageNum }).then(data => {// status 1审核通过 3停用
        if (data.errorCode === 0) {
          that.tableData = data.result;
          that.tableDataClone = Utils.clone(data.result);
        }
      })
    }
  },
  mounted: function () {
    this.queryAllUser();
  },
  watch: {
    'schfilter': function (val, oldVal) {
      this.tableData.data = this.tableDataClone.data.filter(function (item) {
        return (item.userName.indexOf(val) > -1) || (item.fullName.indexOf(val) > -1) || (item.company.indexOf(val) > -1);
      })
    }
  }
}
</script>

<style scoped>

.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>

