<template>
  <div>
    <el-row :gutter="20" style="padding:10px;margin:0px;">
      <el-col :span="6">
        <el-card style="margin-top:20px;">
          <div class="addPanel">
            <div class="el-upload el-upload--picture-card" @click="addProject();">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-for="item in cardDataList" :key="item.id">
        <el-card class="my-card">
          <el-progress type="circle" :percentage="item.progress" :width="80" style="float:right;"></el-progress>
          <div slot="header" class="clearfix" >
            <span>{{item.projectName}}</span>
            <el-button style="float:right;"  size="mini" type="danger" @click="enterIssue(item.id)">录问题</el-button>
            <el-button style="float:right;margin-right:10px;"  size="mini" type="danger" @click="deleteIssue(item.id)">删除</el-button>
          </div>
          <div class="label">状态：{{item.projectStatusLabel}} </div>
          <div class="label">创建时间：{{item.createdAt}}</div>
          <div class="label">问题总数：{{item.issueTotal}}</div>
          <div class="label">已作业：{{item.worked}}</div>
          <div class="label">待作业：{{item.unworked}}</div>
          <div style="text-align:center;padding-top:10px">
            <el-button type="primary" size="mini">通过</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="项目信息" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form ref="issueForm" :model="issueForm" :rules="rules" :show-message="false" :status-icon="true"  label-width="80px">
        <el-form-item prop="projectName" label="项目名称">
          <el-input v-model="issueForm.projectName"></el-input>
        </el-form-item>
        <el-form-item prop="projectDesc" label="项目描述">
          <el-input type="textarea" :rows="3" v-model="issueForm.projectDesc"></el-input>
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
import { saveIssue, queryIssueList, createProject, deleteProject } from '../../dataService/api';
import { Constant } from '../../common/js/constant.js';
import { appUtil } from '../../config';


export default {
  name: 'workWaitWork',
  data () {
    return {
      curentUser: appUtil.getCurrentUser(),
      rules: {
        projectName: [
          { required: true, trigger: 'blur' }
        ],
        projectDesc: [
          { required: true, trigger: 'blur' }
        ]
      },
      issueForm:{},
      centerDialogVisible: false,
      cardDataList: []
    }
  },
  methods: {
    addProject() {
      this.centerDialogVisible = true;
      this.issueForm.projectName = '';
      this.issueForm.projectDesc = '';
    },
    saveIssue() {
      let that = this;
      this.$refs.issueForm.validate(function (valid) {
        if (valid) {
          let param = {
            createUser: that.curentUser.userId,
            projectName: that.issueForm.projectName,
            projectDesc: that.issueForm.projectDesc
          }
          createProject(param).then(res => {
            if (res.errorCode === 0) {
              that.centerDialogVisible = false;
              that.queryIssueList();
            }
          });
        }
      })
    },
    enterIssue(id) {
      this.$router.push({
        name: 'enterIssue', // 和router/index.js保持一致
        params: {
          projectCode: id
        }
      });
    },
    deleteIssue(id) {
      let that = this;
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning '
      }).then(() => {
          deleteProject({id: id}).then(res => {
            if (res.errorCode === 0) {
              that.queryIssueList();
            }
          })
      }).catch(() => {
      });
    },
    queryIssueList() {
      let that = this;
      queryIssueList({pageSize:1000, pageNum:1}).then(data => {
        if (data.errorCode === 0) {
          that.cardDataList = [];
          let list = data.result.data;
          for (let item of list) {
            item.progress = (item.worked/(item.worked + item.unworked)) * 100;
            item.projectStatusLabel = Constant.projectStatus[item.projectStatus];
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
  .addPanel {
    padding: 17px 0px;
    text-align: center;
  }
  .my-card {
    margin-top:20px;
    cursor:pointer;
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
