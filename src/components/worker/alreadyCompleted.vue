<template>
  <div style="padding:6px;">
    <el-table stripe border highlight-current-row max-height="100%"
      :data="tableData">
      <el-table-column type="index" width="50px" label="序号"> </el-table-column>
      <el-table-column width="80px" prop="id" label="项目编号"> </el-table-column>
      <el-table-column width="260px" prop="projectName" label="项目名称"> </el-table-column>
      <el-table-column prop="projectDesc" label="项目描述"> </el-table-column>
      <el-table-column width="80px" prop="issueTotal" label="问题数"> </el-table-column>
      <el-table-column width="100px" prop="submitAt" label="提交时间"> </el-table-column>
      <el-table-column width="100px" prop="auditedAt" label="审核时间"> </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { queryIssueList } from '../../dataService/api';
let _ = require('lodash');

export default {
  name: 'WaitWork',
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    formatterStatus(row, column) {
      let value = '未知';
      if (row.projectStatus == 2) {
        value = '待审核'
      } else if (row.projectStatus == 3) {
        value = '审核通过'
      } else if (row.projectStatus == 4) {
        value = '审核未通过'
      }
      return value;
    },
    queryProject() {
      let that = this;
      queryIssueList({projectStatus: JSON.stringify([3])}).then(data => { // 3已完成（审核通过）4 审核未通过
        if (data.errorCode === 0) {
          that.tableData = [];
          let list = data.result.data;
          for (let item of list) {
            that.tableData.push(item);
          }
        }
      })
    }
  },
  mounted: function () {
    this.queryProject();
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

