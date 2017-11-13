<template>
  <div>
    <el-row :gutter="20" style="padding:10px;margin:0px;">
      <el-col :span="6">
        <el-card style="margin-top:20px;">
          <div class="addPanel">
            <el-button icon="el-icon-circle-plus" type="primary" @click="addProject();">添加项目</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-for="item in cardDataList" :key="item.id">
        <el-card style="margin-top:20px;cursor:pointer;">
          <el-progress type="circle" :percentage="40" :width="80" style="float:right;"></el-progress>
          <div slot="header" class="clearfix" >
            <span>{{item.projectName}}</span>
            <el-button style="float:right;"  size="mini" type="danger" @click="enterIssue()">录入问题</el-button>
          </div>
          <div>状态：{{item.projectStatus}}</div>
          <div>创建时间：{{item.createDate}}</div>
          <div>问题总数：{{item.issueCount}}</div>
          <div>已作业：{{item.worked}}</div>
          <div>待作业：{{item.waitWork}}</div>
          <div style="text-align:center;padding-top:10px">
            <el-button type="primary" size="mini">通过</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="项目信息" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form ref="issueForm" :model="issueForm" :rules="rules" :show-message="false" :status-icon="true"  label-width="80px">
        <el-form-item prop="issueName" label="项目名称">
          <el-input v-model="issueForm.issueName"></el-input>
        </el-form-item>
        <el-form-item prop="issueDesc" label="项目描述">
          <el-input type="textarea" :rows="3" v-model="issueForm.issueDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveIssue()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveIssue } from '../../dataService/api';

export default {
  name: 'workWaitWork',
  data () {
    return {
      rules: {
        issueName: [
          { required: true, trigger: 'blur' }
        ],
        issueDesc: [
          { required: true, trigger: 'blur' }
        ]
      },
      issueForm:{},
      centerDialogVisible: false,
      cardDataList: [{
        projectName:'宝马',
        projectStatus: 2,
        createDate: '2017-02-12',
        issueCount: '2',
        worked: '12',
        waitWork: '22'
      },{
        projectName:'奔驰',
        projectStatus: 2,
        createDate: '2017-02-12',
        issueCount: '2',
        worked: '12',
        waitWork: '22'
      },{
        projectName:'奥迪',
        projectStatus: 2,
        createDate: '2017-02-12',
        issueCount: '2',
        worked: '12',
        waitWork: '22'
      },{
        projectName:'大众',
        projectStatus: 2,
        createDate: '2017-02-12',
        issueCount: '2',
        worked: '12',
        waitWork: '22'
      },{
        projectName:'现代',
        projectStatus: 2,
        createDate: '2017-02-12',
        issueCount: '2',
        worked: '12',
        waitWork: '22'
      }]
    }
  },
  methods: {
    addProject() {
      this.centerDialogVisible = true;
    },
    saveIssue() {
      let that = this;
      this.$refs.issueForm.validate(function (valid) {
        if (valid) {
          let param = {
            issueName: that.$refs.issueForm,
            issueDesc: that.$refs.issueDesc
          }
          saveIssue(param).then(res => {
          });
          this.centerDialogVisible = false;
        }
      })
    },
    enterIssue() {
      this.$router.push('/worker/enterIssue');
    }
  }
}
</script>

<style scoped>
  .addPanel {
    padding: 64px 0px;
    text-align: center;
  }

.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
