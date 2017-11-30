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

import { queryIssueList, queryAllUserListApi } from '../../dataService/api';
let _ = require('lodash');

export default {
  name: 'WaitWork',
  data () {
    return {
      schfilter: '',
      centerDialogVisible: false,
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
    queryAllUser() {
      let that = this;
      queryAllUserListApi({status: '[2]', pageSize: this.pageSize, pageNum: this.pageNum }).then(data => {
        if (data.errorCode === 0) {
          that.tableData = data.result;
          that.tableDataClone = _.clone(data.result);
        }
      })
    },
    watch: {
      'schfilter': function (val, oldVal) {
        this.tableData.data = this.tableDataClone.data.filter(function (item) {
          return (item.userName.indexOf(val) > -1) || (item.fullName.indexOf(val) > -1) || (item.company.indexOf(val) > -1);
        })
      }
    }
  },
  mounted: function () {
    this.queryAllUser();
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

