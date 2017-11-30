<template>
  <el-row :gutter="20" style="padding:10px;margin:0px;">
    <el-col :span="6" v-if="cardDataList.length==0">
      <el-card style="margin-top:20px;">
        <div class="addPanel">
          <div style="height:110px;text-align:center;padding-top:55px;font-size:30px;">
             无待审核数据
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6" v-for="(item, index) in cardDataList" :key="index">
      <el-card class="st-card" @dblclick.native="enterIssue(item.id)">
        <el-progress type="circle" :percentage="item.progress" :width="80" style="float:right;"></el-progress>
        <div slot="header" class="clearfix">
          <span>{{item.projectName}}</span>
        </div>
        <div class="label">创建人 :  {{item.createUser}}</div>
        <div class="label">创建时间 :  {{item.createdAt}} </div>
        <div class="label">提交时间 :  {{item.submitAt}}</div>
        <div class="label">问题总数 :  {{item.issueTotal}}</div>
        <div class="label">已审核 :  {{item.audited}}</div>
        <div class="label">待审核 :  {{item.waitAudited}}</div>
        <div class="label">错误数 :  {{item.errorCount}}</div>
        <div style="text-align:center;padding-top:10px">
          <el-button type="primary" size="mini" @click="auditProjectBefore(item, 3)">通过</el-button>
          <el-button type="primary" size="mini" @click="auditProjectBefore(item, 4)" plain>不通过</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { queryIssueList, auditProApi } from '../../dataService/api';
import { Utils } from '../../common/js/utils.js'

export default {
  name: 'WaitWork',
  data () {
    return {
      dialogVisible: true,
      cardDataList: [],
      passSaving: false,
      nopassSaving: false
    }
  },
  methods: {
    auditProjectBefore(item, status) {
      let that = this;
      if (item.waitAudited > 0 && status == 3) {
        this.$confirm('存在待审核的数据，确认项目通过？','提示').then(() => {
          that.auditProject(item.id, status);
        });
      } else if ((item.errorCount > 0 || item.waitAudited > 0) && status == 3) {
        this.$confirm('存在审核不通过的数据，确认项目通过？','提示').then(() => {
          that.auditProject(item.id, status);
        });
      } else {
        that.auditProject(item.id, status);
      }
    },
    auditProject(projectId, status){
      let that = this;
      let param = {
        projectId: projectId,
        projectStatus: status
      };
      if (status == 3) { // 通过3，不通过4
        that.passSaving = true;
      } else if (status == 4) {
         that.nopassSaving = true;
      }
      auditProApi(param).then(res => {
        if (status == 3) {
          that.passSaving = false;
        } else if (status == 4) {
           that.nopassSaving = false;
        }
        if (res.errorCode === 0) {
          that.$notify.success({ title: '提示', message: res.message, position: 'bottom-right', duration: 2000});
          that.queryProject();
        } else {
           that.$notify.error({ title: '提示', message: res.message, position: 'bottom-right', duration: 2000});
        }
      })
    },
    queryProject() {
      let that = this;
      queryIssueList({projectStatus: JSON.stringify([2])}).then(data => { // 2已提交（待审核）
        if (data.errorCode === 0) {
          that.cardDataList = [];
          let list = data.result.data;
          for (let item of list) {
            item.progress = Utils.round(((item.audited + item.errorCount)/(item.issueTotal)) * 100, 2);
            that.cardDataList.push(item);
          }
        }
      })
    },
    enterIssue(id) {
      this.$router.push({
        name: 'AuditIssue', // 和router/index.js保持一致
        query: {
          projectCode: id
        },
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

