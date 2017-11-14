<template>
  <div class="layout-container" >
    <div id="map" :style="{height: mapHeight}"></div>
    <div class="left-open-icon" @click="leftPanelCtrl('open')" title="展开">
       <i class="el-icon-caret-right" style="cursor:pointer;" ></i>
    </div>
    <div class="left scroll_style" :class="leftCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>案例列表
        <i class="el-icon-caret-left" style="cursor:pointer;float:right;margin-top:2px;" @click="leftPanelCtrl('close')"></i>
      </div>
      <div style="overflow:auto;" class="scroll_style" :style="{'max-height': panelHeight}">
        <el-table stripe border highlight-current-row max-height="100%"
          :data="tableData.data" @row-dblclick="selectedRow">
          <el-table-column
            type="index" width="50px"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="caseSnap"
            label="问题描述">
          </el-table-column>
          <el-table-column width="70px"
            prop="mediaLength"
            label="附件数">
          </el-table-column>
          <el-table-column
            prop="detailStatus"
            label="处理状态">
          </el-table-column>
        </el-table>
        <el-pagination small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ctrl.pageNum"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="ctrl.pageSize"
          layout="total, sizes, prev, next"
          :total="tableData.total">
        </el-pagination>
      </div>
    </div>
    <div class="return-page-icon" @click="backPrev()" :class="rightCollapsed?'open-return-page':'close-return-page'" title="返回上一页">
       <i class="el-icon-back" style="cursor:pointer;" ></i>
    </div>
    <div class="right scroll_style" :class="rightCollapsed?'open-panel':'close-panel'">
      <div>
        <div class='my-panel'>
          <i class="el-icon-caret-right" style="cursor:pointer;" @click="rightPanelCtrl('close')"></i>问题详情
        </div>
        <div class="scroll_style list-group">
          <ul>
            <li>
              <label>问题编号:</label><div>{{caseForm.id}}</div>
            </li>
            <li>
              <label>问题概述:</label><div>{{caseForm.caseSnap}}</div>
            </li>
            <li>
              <label>问题描述:</label><div>{{caseForm.caseDesc}}</div>
            </li>
            <li>
              <label>处理方法:</label><div>{{caseForm.caseMethod}}</div>
            </li>
          </ul>
          <el-row style="padding-left:6px;">
            <el-col :span="6" v-for="(image, index) in caseForm.images" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list">
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <div class='my-panel'>
          问题处理
          <el-button style="float:right;margin-left:10px;" size="mini" type="warning" :loading="ctrl.saving" @click="saveCase()" >保存</el-button>
        </div>
        <div class="scroll_style">
          <el-row style="padding:6px;">
            <el-col :span="6" v-for="(image, index) in issueDetailImages" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list">
              <div class="el-icon-delete img_delete" @click="deleteImage(index)"></div>
            </el-col>
          </el-row>
          <el-upload
            class="my-upload" multiple
            :action="ctrl.baseUrl+'/api/bs/case/upload?token='+ctrl.curentUser.token"
            :on-success="handlesuccess" :show-file-list="false">
            <el-button size="small" type="primary">点击上传图片</el-button>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Maplet from 'Maplet'
import myVideo from 'vue-video'
import { queryCaseList, queryCaseById, saveCaseInfo} from '../../dataService/api';
import mapMarker from '../../assets/marker.gif'
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig, appUtil } from '../../config';

export default {
  name: 'CaseList',
  data () {
    return {
      issueDetailImages: [],
      rightCollapsed: false,
      leftCollapsed: true,
      currentPage1: 1,
      pageCtrl:{},
      ctrl: {
        curentUser: appUtil.getCurrentUser(),
        baseUrl: appConfig.serviceUrl,
        caseCreate: false,
        addLocation: false, // 增加点位的标识
        saving: false,
        pageSize: 10,
        pageNum:1
      },
      video: {
          sources: [{
              src: videoSrc,
              type: 'video/mp4'
          }],
          options: {
              autoplay: true,
              volume: 0.6,
              poster: 'http://covteam.u.qiniudn.com/poster.png'
          }
      },
      imgUpload: {
        imgSrc: imgSrc,
      },
      caseForm: {
        images:[ ],
        location: ''
      },
      rules: {
        caseSnap: [
          { required: true, trigger: 'blur' }
        ],
        caseDesc: [
          { required: true,  trigger: 'blur' }
        ],
        caseMethod: [
          { required: true, trigger: 'blur' }
        ],
        location: [
          { required: true, trigger: 'blur' }
        ]
      },
      tableData:{
      }
    }
  },
  components: {
    myVideo
  },
  methods: {
    handleSizeChange(size) {
      this.ctrl.pageSize = size;
      this.queryCaseList()
    },
    handleCurrentChange(currentPage) {
      console.log(`当前页: ${currentPage}`);
      this.ctrl.pageNum = currentPage;
      this.queryCaseList()
    },
    handlesuccess(res, file, fileList) {
      if (res.errorCode == 0) {
        this.issueDetailImages = this.issueDetailImages.concat(res.result.data);
      }
    },
    rightPanelCtrl(flag) {
      if (flag == 'close') {
        this.rightCollapsed = false;
      }
      if (flag == 'open') {
        this.rightCollapsed = true;
      }
    },
    leftPanelCtrl(flag) {
      console.info(flag);
      if (flag == 'close') {
        this.leftCollapsed = false;
      }
      if (flag == 'open') {
        this.leftCollapsed = true;
      }
    },
    addLocation () {
      this.caseForm.location = ''
      this.ctrl.addLocation = true;
    },
    saveCase() {
      let that = this;
      this.$refs.caseForm.validate(function (valid) {
        if(valid) {
          let loc = that.caseForm.location.split(',');
          let param = {
            createUser: that.ctrl.curentUser.userId,
            caseSnap: that.caseForm.caseSnap,
            caseDesc: that.caseForm.caseDesc,
            caseMethod: that.caseForm.caseMethod,
            images: that.caseForm.images,
            videos:[],
            marker: { type: 'Point', coordinates: [loc[0], loc[1]]}
          };
          if (that.caseForm.id) { // 修改
            param.id = that.caseForm.id;
          }
          that.ctrl.saving = true;
          saveCaseInfo(param).then(data => {
            that.ctrl.saving = false;
            if (data.errorCode == 0){
              that.queryCaseList();
              that.$notify.success({ title: '提示', message: '保存成功!', position: 'bottom-right', duration: 1000});
            } else {
              that.$notify.error({ title: '提示', message: '保存失败!', position: 'bottom-right', duration: 1000});
            }
          });
        }
      });
    },
    deleteImage(index) {
      this.issueDetailImages.splice(index, 1)
    },
    selectedRow(row, event) {
      let that = this;
      queryCaseById({id: row.id}).then(data => {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          that.caseForm = result.data;
          that.caseForm.location = result.data.marker.coordinates[0]+","+result.data.marker.coordinates[1];
        }
      })
      that.rightPanelCtrl('open');
    },
    backPrev() {
      this.$router.push('/mainFrame');
    },
    queryCaseList() {
      let that = this;
      var param = { pageSize: this.ctrl.pageSize, pageNum: this.ctrl.pageNum };
      queryCaseList(param).then(function (data) {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          that.tableData = result;
        } else {
          that.$message({
            message: message,
            type: 'error'
          });
        }
      })
    },
    initMapbar() {
      let that = this;
      window.maplet = new Maplet("map");
      window.maplet.centerAndZoom(new MPoint(116.38749,39.90515), 8);
      window.maplet.clickToCenter = false;
      // window.maplet.showScale(false);
      window.maplet.showOverview(false);
      MEvent.addListener(window.maplet, "click", function(event,point) {
        if (that.ctrl.addLocation) {
          console.info(point.pid)
          that.caseForm.location = point.pid;
          console.info(that.caseForm.location,'------------')
          window.maplet.clearOverlays();
          let poi = point.pid.split(',');
          window.marker = new MMarker(
              new MPoint(poi[0], poi[1]),
              new MIcon(mapMarker,32,32)
          );
          window.maplet.addOverlay(marker);
        }
      })
    }
  },
  created: function () {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight;
    this.mapHeight = clientHeight + 'px';
    this.panelHeight = clientHeight - 50 + 'px'; // 后续改善
  },
  mounted: function () {
    this.queryCaseList();
    this.initMapbar();
  }
}
</script>

<style scoped>
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.layout-container .map {
  width: 100%;
  height: 100%;
}
.layout-container .my-panel{
  padding: 10px;
  background: #20a0ff;
  text-align: left;
  line-height:26px;
  font-size: 18px;
  color: #FFFFFF;
  font-weight: bold;
}
.layout-container .left {
  height:100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 320px;
  background-color: #FFFFFF;
}
.layout-container .right {
  height:100%;
  position: absolute;
  top: 0px;
  right: 0px;
  width: 320px;
  background-color: #FFFFFF;
  overflow: auto;
}
.layout-container .right.open-panel, .layout-container .left.open-panel {
  display: block;
}
.layout-container .right.close-panel, .layout-container .left.close-panel {
  display: none;
}
.layout-container .right-open-icon {
  position: absolute;
  right: 0px;
  top: 0px;
  color: #FFFFFF;
}
.layout-container .return-page-icon {
  position: absolute;
  right: 40px;
  top: 0px;
  color: #FFFFFF;
}
.layout-container .left-open-icon {
  position: absolute;
  left: 0px;
  top: 0px;
  color: #FFFFFF;
}
.layout-container .right-open-icon i{
  background-color:#20a0ff;
  padding:10px;
  margin-top: 10px;
  border-radius: 8px 0px 0px 8px
}
.layout-container .left-open-icon i{
  background-color:#20a0ff;
  padding:10px;
  margin-top: 10px;
  border-radius: 0px 8px 8px 0px;
}
.layout-container .return-page-icon.open-return-page {
   right: 330px;
}
.layout-container .return-page-icon.close-return-page {
  right: 0px;
}
.layout-container .return-page-icon i{
  background-color:#20a0ff;
  padding:10px;
  margin-top: 10px;
  border-radius: 8px 0px 0px 8px;
}

.img_delete{
  position: relative;
  top: -70px;
  left: 52px;
  cursor: pointer;
}
.img_delete:hover {
  background: #CCC;
  border-radius: 2px
}

.my-from .el-form-item {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-right:10px;
}
.my-from .el-form-item .el-input.el-input__inner{
  padding-left: 6px;
}

.img-list {
  width: 70px;
  height: 70px;
  border-radius: 4px;
}
.my-upload {
  padding: 10px;
  padding-top: 0px;
}

.list-group ul {
  list-style-type: none;
  padding: 0px;
}
.list-group ul li{
  padding: 10px;
  font-size: 14px;
}
.list-group ul li > label{
  width: 80px;
  float: left;
}
.list-group ul li > div{
  margin-left: 80px;
}


/*********************************滚动条样式************************************/
.scroll_style {
  overflow: auto;
  height: 100%;
}
.scroll_style::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
}
.scroll_style::-webkit-scrollbar-thumb {
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  background: #c1c1c1;
}
.scrollDiy::-webkit-scrollbar {
  width: 0 !important;
}
</style>
