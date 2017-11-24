<template>
  <div>
    <el-row :gutter="20" style="padding:10px;margin:0px;">
      <el-col :span="6" v-if="cardDataList.length==0">
        <el-card style="margin-top:20px;">
          <div class="addPanel">
            <div style="height:110px;text-align:center;padding-top:55px;font-size:30px;">
               无已提交数据
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-for="item in cardDataList" :key="item.id">
        <el-card class="st-card" >
          <el-progress type="circle" :percentage="item.progress" :width="80" style="float:right;"></el-progress>
          <div slot="header" class="clearfix" >
            <span>{{item.projectName}}</span>
          </div>
          <div class="label">状态：审核中 </div>
          <div class="label">创建时间：{{item.createdAt}}</div>
          <div class="label">问题总数：{{item.issueTotal}}</div>
          <div class="label">已审核数：{{item.audited}}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryIssueList } from '../../dataService/api';

export default {
  name: 'workWaitWork',
  data () {
    return {
      cardDataList: []
    }
  },
  methods: {
    queryIssueList() {
      let that = this;
      queryIssueList({projectStatus: "[2]"}).then(data => {
        if (data.errorCode === 0) {
          that.cardDataList = [];
          let list = data.result.data;
          for (let item of list) {
            item.progress = _.round((item.audited/(item.issueTotal)) * 100, 2);
            that.cardDataList.push(item);
          }
        }
      })
    }
  },
  mounted: function () {
    this.queryIssueList();
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
