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
        <el-card class="st-card" @dblclick.native="enterIssue(item.id)">
          <el-progress type="circle" :percentage="item.progress" :width="80" style="float:right;"></el-progress>
          <div slot="header" class="clearfix" >
            <span>{{item.projectName}}</span>
            <!-- <el-button style="float:right;"  size="mini" type="danger" @click="enterIssue(item.id)">录问题</el-button> -->
            <el-button style="float:right;margin-right:10px;" icon="el-icon-delete" size="mini" type="danger" @click="deleteIssue(item.id)">删除</el-button>
          </div>
          <div class="label">状态：{{item.projectStatusLabel}} </div>
          <div class="label">创建时间：{{item.createdAt}}</div>
          <div class="label">案例总数：{{item.issueTotal}}</div>
          <div class="label">已作业：{{item.worked}}</div>
          <div class="label">待作业：{{item.unworked}}</div>
          <div style="text-align:center;padding-top:10px">
            <el-button type="primary" size="mini" :disabled="item.unworked > 0" @click="openSubmitProj(item.id)">提交</el-button>
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
    <el-dialog
      title="选择提交项目审核人" :visible.sync="submitDialogVisible" width="30%" center>
      <div style="text-align: center;">
        <el-select v-model="auditUser" filterable placeholder="请选择审核人">
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="submitDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submitProject()" :loading="submitLoading">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveIssue, queryIssueList, createProject, deleteProject, findUserList, submitProjectApi} from '../../dataService/api';
import { Constant } from '../../common/js/constant.js';
import { appUtil } from '../../config';
let _ = require('lodash');


export default {
  name: 'workWaitWork',
  data () {
    return {
      submitLoading: false,
      userList: [],
      auditUser: '',
      currentProjectId: '',
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
      submitDialogVisible: false, // 提交确认框
      cardDataList: []
    }
  },
  methods: {
    openSubmitProj (projectId) {
      this.submitDialogVisible = true;
      this.currentProjectId = projectId;
    },
    submitProject() {
      let that = this;
      that.submitLoading = true;
      submitProjectApi({projectId: this.currentProjectId, auditUser: this.auditUser}).then(res => {
        that.submitLoading = false;
        if (res.errorCode === 0) {
          that.queryIssueList();
          this.submitDialogVisible = false;
          that.$notify.success({ title: '提示', message: res.message, position: 'bottom-right', duration: 1000});
        } else {
          that.$notify.error({ title: '提交失败', message: res.message, position: 'bottom-right', duration: 1000});
        }
      });
    },
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
      queryIssueList({projectStatus: "[1,4]"}).then(data => { // 1待作业 4提交未通过
        if (data.errorCode === 0) {
          that.cardDataList = [];
          let list = data.result.data;
          for (let item of list) {
            item.progress = _.round((item.worked/(item.worked + item.unworked)) * 100, 2);
            item.projectStatusLabel = Constant.projectStatus[item.projectStatus];
            that.cardDataList.push(item);
          }
        }
      })
    },
    queryUserList() {
      let that = this;
      findUserList().then(data => {
        let {errorCode, result} = data;
        if (errorCode === 0) {
          result.data.forEach((value, index, arr) => {
            if (value.role == 'manager') {
              that.userList.push({
                userId: value.id,
                userName: value.fullName
              });
            }
          });
          if (that.userList.length > 0) {
            that.auditUser = that.userList[0].userId;
          }
        }
      })
    }
  },
  mounted: function () {
    this.queryIssueList();
    this.queryUserList();
  }
}
</script>

<style scoped>
  .addPanel {
    padding: 21px 0px;
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
