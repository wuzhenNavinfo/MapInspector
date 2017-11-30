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
      <el-table-column prop="company" label="所属公司"></el-table-column>
      <el-table-column width="110px" prop="cellPhone" label="电话"></el-table-column>
      <el-table-column width="100px" prop="createdAt" label="注册时间"></el-table-column>
      <el-table-column width="100px" prop="expiredAt" label="过期时间"></el-table-column>
      <el-table-column width="80px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
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

    <el-dialog
      title="注册账号审核"
      :visible.sync="centerDialogVisible"
      width="460px"
      center>
      <div style="padding-left:30px;">
        <span style="margin-right:20px;">设置角色</span>
        <el-radio-group v-model="roleId">
          <el-radio :label="2">作业员</el-radio>
          <el-radio :label="3">管理员</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditPass(1)">不通过</el-button>
        <el-button type="primary" @click="auditPass(2)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { queryAllUserListApi, updateUserApi } from '../../dataService/api';
let _ = require('lodash');

export default {
  name: 'WaitWork',
  data () {
    return {
      schfilter: '',
      roleId: 2,
      currentUser: {},
      centerDialogVisible: false,
      pageSize: 20,
      pageNum: 1,
      tableData: [],
      tableDataClone: []
    }
  },
  methods: {
    auditPass(flag) {
      let param = {
        userId: this.currentUser.id,
        status: 2 // 不通过
      };
      if (flag==2) { // 通过
        param.roleId = this.roleId;
        param.status = 1;
      }
      let that = this;
      updateUserApi(param).then(data => {
        that.centerDialogVisible = false;
        console.info(data);
        let {errorCode, message, result} = data;
        if (errorCode === 0) {
          that.$notify.success({ title: '提示', message: message, position: 'bottom-right', duration: 2000});
          that.queryAllUser();
        } else {
          that.$notify.error({ title: '提示', message: message, position: 'bottom-right', duration: 2000});
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryAllUser();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.queryAllUser();
    },
    handleEdit(index, row) {
      this.roleId = 2; // 作业员
      this.currentUser = row;
      this.centerDialogVisible = true;
    },
    queryAllUser() {
      let that = this;
      queryAllUserListApi({status: '[0]', pageSize: this.pageSize, pageNum: this.pageNum }).then(data => { // status 0待审核
        if (data.errorCode === 0) {
          that.tableData = data.result;
          that.tableDataClone = _.clone(data.result);
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

