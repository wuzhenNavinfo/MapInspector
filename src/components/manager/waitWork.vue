<template>
  <el-row :gutter="20" style="padding:10px;margin:0px;">
    <el-col :span="6" v-for="(item, index) in cardDataList" :key="index">
      <el-card class="st-card" @dblclick.native="enterIssue(item.id)">
        <el-progress type="circle" :percentage="25" :width="80" style="float:right;"></el-progress>
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
        </div>
        <div class="label">创建人 :  {{item.userName}}</div>
        <div class="label">创建时间 :  {{item.createdAt}} </div>
        <div class="label">提交时间 :  {{item.submitAt}}</div>
        <div class="label">问题总数 :  {{item.issueTotal}}</div>
        <div class="label">已审核 :  {{item.audited}}</div>
        <div class="label">待审核 :  {{item.waitAudited}}</div>
        <div class="label">错误数 :  {{item.errorCount}}</div>
        <div style="text-align:center;padding-top:10px">
          <el-button type="primary" size="mini">通过</el-button>
          <el-button type="primary" size="mini" plain>不通过</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { queryIssueList } from '../../dataService/api';
let _ = require('lodash');

export default {
  name: 'WaitWork',
  data () {
    return {
      dialogVisible: true,
      cardDataList: []
    }
  },
  methods: {
    queryProject() {
      let that = this;
      queryIssueList({projectStatus: JSON.stringify([2])}).then(data => { // 2已提交（待审核）
        if (data.errorCode === 0) {
          that.cardDataList = [];
          let list = data.result.data;
          for (let item of list) {
            item.progress = _.round((item.worked/(item.worked + item.unworked)) * 100, 2);
            // item.projectStatusLabel = Constant.projectStatus[item.projectStatus];
            that.cardDataList.push(item);
          }
        }
      })
    },
    enterIssue(id) {
      return;
      this.$router.push({
        name: 'AuditIssue', // 和router/index.js保持一致
        params: {
          projectCode: id
        }
      });
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

