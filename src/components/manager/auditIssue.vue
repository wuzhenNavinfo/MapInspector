<template>
  <div class="layout-container" >
    <div id="map" :style="{height: mapHeight}"></div>
    <div class="left-open-icon" @click="leftPanelCtrl('open')" title="展开">
       <i class="el-icon-caret-right" style="cursor:pointer;" ></i>
    </div>
    <div class="left scroll_style" :class="leftCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>案例列表
        <i class="el-icon-caret-left" style="cursor:pointer;float:right;margin-top:6px;" @click="leftPanelCtrl('close')"></i>
      </div>
      <div style="overflow:auto;" class="scroll_style" :style="{'max-height': panelHeight}">
        <el-input class="search-filter" v-model="schfilter" placeholder="问题描述" prefix-icon="el-icon-search"> </el-input>
        <el-table stripe border highlight-current-row max-height="100%"
          :data="tableData.data" @row-click="selectedRow">
          <el-table-column type="index" width="50px" label="序号"> </el-table-column>
          <el-table-column prop="caseSnap" label="案例概述"> </el-table-column>
          <el-table-column width="64px" prop="caseMediaLength" label="附件数"> </el-table-column>
          <el-table-column width="50px" prop="proMediaLength" label="处理"> </el-table-column>
        </el-table>
        <el-pagination small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ctrl.pageNum"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="ctrl.pageSize"
          layout="total, sizes, prev, next"
          :total="tableData.total">
        </el-pagination>
      </div>
    </div>
    <div class="map_operate_tool">
       <el-tooltip :content="showIconFlag?'图标已打开':'图标已关闭'" >
        <el-switch v-model="showIconFlag" style="margin-bottom:4px;margin-left:4px;" active-color="#409eff" > </el-switch>
       </el-tooltip>
    </div>
    <div class="return-page-icon" :class="rightCollapsed?'open-return-page':'close-return-page'" title="返回上一页">
      <comLogout ></comLogout>
    </div>
    <div class="right scroll_style" :class="rightCollapsed?'open-panel':'close-panel'">
      <div>
        <div class='my-panel'>
          <i class="el-icon-caret-right" style="cursor:pointer;" @click="rightPanelCtrl('close')"></i>案例详情
        </div>
        <div class="scroll_style list-group">
          <ul>
            <li>
              <label>案例编号:</label><div>{{caseForm.caseCode}}</div>
            </li>
            <li>
              <label>案例概述:</label><div>{{caseForm.caseSnap}}</div>
            </li>
            <li>
              <label>案例描述:</label><div>{{caseForm.caseDesc}}</div>
            </li>
            <li>
              <label>处理方法:</label><div>{{caseForm.caseMethod}}</div>
            </li>
          </ul>
          <el-row style="padding-left:6px;">
            <el-col :span="6" v-for="(image, index) in caseForm.caseImages" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list" style="cursor:pointer;" @click="showImages(index)">
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <div class='my-panel'>
          问题处理
          <el-button style="float:right;margin-left:10px;" size="mini" type="warning" :loading="ctrl.saving" @click="saveCaseIssue()" >保存</el-button>
        </div>
        <div class="scroll_style">
          <el-row style="padding:6px;">
            <el-col :span="6" v-for="(image, index) in caseForm.issueImages" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list" style="cursor:pointer;" @click="showIssueImages(index)">
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
    <div>
      <el-dialog :visible.sync="imageDialogVisible">
         <el-carousel ref="imagesCarousel" height="56vh" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="image in caseForm.caseImages" :key="image" style="text-align:center">
              <img :src="ctrl.baseUrl+'/'+image" style="max-width:100%;max-height:100%;">
            </el-carousel-item>
          </el-carousel>
      </el-dialog>
      <el-dialog :visible.sync="issueImageDialogVisible">
         <el-carousel ref="issueImagesCarousel" height="56vh" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="image in caseForm.issueImages" :key="image" style="text-align:center">
              <img :src="ctrl.baseUrl+'/'+image" style="max-width:100%;max-height:100%;">
            </el-carousel-item>
          </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import Maplet from 'Maplet'
import myVideo from 'vue-video'
import ComLogout from '../common/Logout'
import { queryCaseListDetail, queryCaseById, queryIssue, createIssue} from '../../dataService/api';
// import mapMarker from '../../assets/marker.png'
import mapMarker from '../../assets/poi_blue.png'
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig, appUtil } from '../../config';
let _ = require('lodash');

export default {
  name: 'CaseList',
  data () {
    return {
      schfilter: '',
      showIconFlag: true,
      imageDialogVisible: false,
      issueImageDialogVisible: false,
      rightCollapsed: false,
      leftCollapsed: true,
      currentPage1: 1,
      pageCtrl:{},
      selectedRowData:{},
      ctrl: {
        curentUser: appUtil.getCurrentUser(),
        baseUrl: appConfig.serviceUrl,
        caseCreate: false,
        addLocation: false, // 增加点位的标识
        saving: false,
        pageSize: 20,
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
        issueImages: [],
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
    myVideo,
    ComLogout
  },
  methods: {
    handleSizeChange(size) {
      this.ctrl.pageSize = size;
      this.queryCaseList()
    },
    handleCurrentChange(currentPage) {
      this.ctrl.pageNum = currentPage;
      this.queryCaseList()
    },
    handlesuccess(res, file, fileList) {
      if (res.errorCode == 0) {
        this.caseForm.issueImages = this.caseForm.issueImages.concat(res.result.data);
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
      if (flag == 'close') {
        this.leftCollapsed = false;
      }
      if (flag == 'open') {
        this.leftCollapsed = true;
      }
    },
    saveCaseIssue() {
      let param = {
        caseCode: this.selectedRowData.caseCode,
        proCode: this.selectedRowData.proCode,
        images: this.caseForm.issueImages,
        videos:[]
      };
      let that = this;
      that.ctrl.saving = true;
      createIssue(param).then(res => {
        that.ctrl.saving = false;
        if (res.errorCode === 0) {
          that.queryCaseList(that.selectedRowData.proCode);
        }
      })
    },
    deleteImage(index) {
      this.caseForm.issueImages.splice(index, 1);
    },
    showImages(index) {
      this.imageDialogVisible = true;
      let that = this;
      setTimeout(function(){
        that.$refs.imagesCarousel.setActiveItem(index);
      })
    },
    showIssueImages(index) {
      this.issueImageDialogVisible = true;
      let that = this;
      setTimeout(function(){
        that.$refs.issueImagesCarousel.setActiveItem(index);
      })
    },
    selectedRow(row, event) {
      this.selectedRowData = row;
      let that = this;
      queryIssue({proCode: row.proCode, caseCode: row.caseCode}).then(data => {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          that.caseForm = result;
          let lon = result.caseMarker.coordinates[0];
          let lat = result.caseMarker.coordinates[1];
          window.maplet.setCenter(new MPoint (lon, lat));
          window.maplet.clearOverlays();
          window.marker = new MMarker(
              new MPoint(lon, lat),
              new MIcon(mapMarker,32,32,5,22)
          );
          window.maplet.addOverlay(marker);
        }
      })
      that.rightPanelCtrl('open');
    },
    gotoMainPage() {
      this.$router.push('/mainFrame');
    },
    logout: function () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning '
      }).then(() => {
        sessionStorage.removeItem('user');
        this.$router.push('/login');
      }).catch(() => {
      });
    },
    queryCaseList(projectCode) {
      let that = this;
      var param = { pageSize: this.ctrl.pageSize, pageNum: this.ctrl.pageNum,projectCode: projectCode };
      queryCaseListDetail(param).then(function (data) {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          that.tableData = result;
          that.tableDataClone = _.clone(result);
        } else {
          that.$message({
            message: message,
            type: 'error'
          });
        }
      })
    },
    queryAllCaseList(projectCode) {
      this.allCaseList = [];
      let that = this;
      queryCaseListDetail({projectCode: projectCode}).then(function (data) {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          result.data.forEach((value, index, arr) => {
            that.allCaseList.push({
              id: value.id,
              location: [value.marker.coordinates[0], value.marker.coordinates[1]]
            })
          });
          that.addOrRemoveIcon('add');
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
          that.caseForm.location = point.pid;
          window.maplet.clearOverlays();
          let poi = point.pid.split(',');
          window.marker = new MMarker(
              new MPoint(poi[0], poi[1]),
              new MIcon(mapMarker,32,32,5,22)
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
    this.queryCaseList(this.$route.params.projectCode);
    this.initMapbar();
    this.queryAllCaseList(this.$route.params.projectCode);
  },
  watch: {
    'schfilter': function (val, oldVal) {
      this.tableData.data = this.tableDataClone.data.filter( item => (~item.caseSnap.indexOf(val)));
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
  }
  .my-panel{
    padding: 6px;
    background: #20a0ff;
    text-align: left;
    line-height:28px;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: bold;
  }
  .left {
    height:100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 320px;
    background-color: #FFFFFF;
    &.open-panel {
      display: block;
    }
    &.close-panel {
      display: none;
    }
  }
  .right {
    height:100%;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 320px;
    background-color: #FFFFFF;
    overflow: auto;
    &.open-panel {
      display: block;
    }
    &.close-panel {
      display: none;
    }
  }
  .right-open-icon {
    position: absolute;
    right: 0px;
    top: 0px;
    color: #FFFFFF;
    i{
      background-color:#20a0ff;
      padding:10px;
      margin-top: 10px;
      border-radius: 8px 0px 0px 8px
    }
  }
  .return-page-icon {
    position: absolute;
    right: 40px;
    top: 10px;
    color: #FFFFFF;
    &.open-return-page {
      right: 330px;
      :hover{
        background-color: #55A1EF;
      }
    }
    &.close-return-page {
      right: 40px;
      :hover{
        background-color: #55A1EF;
      }
    }
  }
  .left-open-icon {
    position: absolute;
    left: 0px;
    top: 0px;
    color: #FFFFFF;
    i{
      background-color:#20a0ff;
      padding:10px;
      margin-top: 10px;
      border-radius: 0px 8px 8px 0px;
    }
  }
}
.img_delete{
  position: relative;
  top: -70px;
  left: 52px;
  cursor: pointer;
  &:hover {
    background: #CCC;
    border-radius: 2px
  }
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
</style>
