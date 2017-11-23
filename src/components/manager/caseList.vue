<template>
  <div class="layout-container" >
    <div id="map" :style="{height: mapHeight}"></div>
    <div class="left-open-icon" @click="leftPanelCtrl('open')" title="展开">
       <i class="el-icon-caret-right" style="cursor:pointer;" ></i>
    </div>
    <div class="left" :class="leftCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>案例列表
        <i class="el-icon-caret-left" style="cursor:pointer;float:right;margin-top:6px;" @click="leftPanelCtrl('close')"></i>
      </div>
      <div style="overflow:auto;" class="scroll_style" :style="{'max-height': panelHeight}">
        <el-input class="search-filter" v-model="schfilter" placeholder="案例概述" prefix-icon="el-icon-search"> </el-input>
        <el-table stripe border highlight-current-row max-height="100%"
          :data="tableData.data" @row-click="selectedRow">
          <el-table-column type="index" width="50px" label="序号"> </el-table-column>
          <el-table-column prop="caseSnap" label="案例概述"> </el-table-column>
          <el-table-column width="64px" prop="mediaLength" label="附件数"> </el-table-column>
          <el-table-column width="92px" prop="createdAt" label="创建时间"> </el-table-column>
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
       <el-button size="mini" type="danger" icon="el-icon-circle-plus" @click="createCase()">创 建</el-button>
       <el-tooltip :content="showIconFlag?'图标已打开':'图标已关闭'" >
         <el-switch v-model="showIconFlag" style="margin-bottom:4px;margin-left:4px;" active-color="#409eff" > </el-switch>
       </el-tooltip>
    </div>
    <div class="right-open-icon" title="展开">
       <i class="el-icon-caret-left" :class="operationed?'enabled':'disabled'" @click="rightPanelCtrl('open')" ></i>
    </div>
    <div class="return-page-icon" :class="rightCollapsed?'open-return-page':'close-return-page'">
       <comLogout ></comLogout>
    </div>
    <div class="right" :class="rightCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>
        <i class="el-icon-caret-right" style="cursor:pointer;" @click="rightPanelCtrl('close')"></i>案例详情
        <el-button style="float:right;margin-left:10px;" icon="el-icon-check" size="mini" type="warning" :loading="ctrl.saving" @click="saveCase()" >保存</el-button>
        <el-button style="float:right;" icon="el-icon-delete"  size="mini" type="warning" :loading="ctrl.deleteing" @click="deleteCase()">删除</el-button>
      </div>
      <div class="scroll_style" :style="{'max-height': panelHeight}" @click.stop="rightPanelClick();">
        <el-form ref="caseForm" :model="caseForm" class="my-from" :rules="rules" :show-message="false" :status-icon="true"  label-width="80px">
          <el-form-item label="问题编号">
            <el-input disabled v-model="caseForm.id"></el-input>
          </el-form-item>
          <el-form-item prop="caseSnap" label="案例概述">
            <el-input v-model="caseForm.caseSnap"></el-input>
          </el-form-item>
          <el-form-item prop="caseDesc" label="案例描述">
            <el-input type="textarea" v-model="caseForm.caseDesc"></el-input>
          </el-form-item>
          <el-form-item prop="caseMethod" label="处理方法">
            <el-input type="textarea" v-model="caseForm.caseMethod"></el-input>
          </el-form-item>
          <el-form-item prop="location" disabled label="点位信息">
            <el-input disabled v-model="caseForm.location" style="width:190px;"></el-input>
            <!--  <i class="el-icon-location" @click="addLocation" title="修改点位" style="cursor:pointer;font-size:24px;"></i> -->
            <el-button class="location-add-icon" :class="{selected: ctrl.addLocation}" @click.stop="addLocation($event)"  type="primary" size="mini" round icon="el-icon-location"></el-button>
          </el-form-item>
          <el-row style="padding-left:10px;">
            <el-col :span="6" v-for="(image, index) in caseForm.images" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list" style="cursor:pointer;" @click="showImages(index)">
              <div class="el-icon-circle-close-outline img_delete" @click="deleteImage(index)"></div>
            </el-col>
          </el-row>
          <el-upload
            class="my-upload" multiple
            :action="ctrl.baseUrl+'/api/bs/case/upload?token='+ctrl.curentUser.token" :before-upload="handleBeforeUpload"
            :on-success="handlesuccess" :show-file-list="false">
            <el-button size="small" icon="el-icon-upload" type="primary">点击上传图片</el-button>
          </el-upload>
          <el-row>
            <el-col :span="18" width="260px;">
              <!-- <my-video width="260px;" :sources="video.sources" :options="video.options"></my-video> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div>
      <el-dialog custom-class="my-dialog" :visible.sync="imageDialogVisible">
         <el-carousel ref="imagesCarousel" height="56vh" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="image in caseForm.images" :key="image" style="text-align:center">
              <img :src="ctrl.baseUrl+'/'+image" style="max-width:100%;max-height:100%;">
            </el-carousel-item>
          </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Maplet from 'Maplet'
import myVideo from 'vue-video'
import ComLogout from '../common/Logout'
import { queryCaseList, queryCaseById, saveCaseInfo, deleteCaseById} from '../../dataService/api';
import markerIcon from '../../assets/poi_blue.png'
import markerIconRed from '../../assets/poi_red.png'
import markerIconGreen from '../../assets/poi_green.png'
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig, appUtil } from '../../config';
let _ = require('lodash');

export default {
  name: 'CaseList',
  data () {
    return {
      currentEditMarker: null,
      schfilter:'',
      operationed: false,
      showIconFlag: true,
      imageDialogVisible: false,
      rightCollapsed: false,
      leftCollapsed: true,
      currentPage1: 1,
      pageCtrl:{},
      allCaseList:[], // 存储所有的案例
      ctrl: {
        curentUser: appUtil.getCurrentUser(),
        baseUrl: appConfig.serviceUrl,
        caseCreate: false,
        addLocation: false, // 增加点位的标识
        saving: false,
        deleteing: false,
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
        file: {
          precent: 0
        },
        isShowPrecent: false
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
    myVideo,
    ComLogout
  },
  methods: {
    gotoMainPage: function () {
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
        if (!this.caseForm.images) {
          this.caseForm.images = [];
        }
        this.caseForm.images = this.caseForm.images.concat(res.result.data);
      }
    },
    handleProgress(event, file, fileList) {
      this.imgUpload.file = file;
    },
    handleBeforeUpload(file) {
      this.imgUpload.isShowPrecent = true;
    },
    rightPanelCtrl(flag) {
      if (flag == 'close') {
        this.rightCollapsed = false;
      }
      if (flag == 'open') {
        if (this.operationed) {
          this.rightCollapsed = true;
        }
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
    createCase() {
      this.operationed = true;
      this.clearCase();
      this.rightPanelCtrl('open');
      if (this.$refs.caseForm && this.$refs.caseForm.clearValidate) {
        this.$refs.caseForm.clearValidate();
      }
      this.ctrl.addLocation = false;
    },
    clearCase() {
      this.caseForm.id = '';
      this.caseForm.caseSnap = '';
      this.caseForm.caseDesc = '';
      this.caseForm.caseMethod = '';
      this.caseForm.location = '';
      this.caseForm.images = [];
      this.caseForm.videos = [];
    },
    addLocation (e) {
      // this.caseForm.location = ''
      this.ctrl.addLocation = !this.ctrl.addLocation;
      this.showIconFlag = true;
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
            that.ctrl.addLocation = false;
            that.ctrl.saving = false;
            if (data.errorCode == 0){
              that.queryCaseList();
              that.queryAllCaseList();
              if (!that.caseForm.id) { // 修改
                that.caseForm.id = data.result.data.id;
              }
              that.$notify.success({ title: '提示', message: '保存成功!', position: 'bottom-right', duration: 1000});
            } else {
              that.$notify.error({ title: '提示', message: '保存失败!', position: 'bottom-right', duration: 1000});
            }
          });
        }
      });
    },
    deleteCase() {
      this.ctrl.deleteing = false;
      if (!this.caseForm.id) {
        return;
      }
      let that = this;
      deleteCaseById({id: this.caseForm.id}).then(res => {
        that.ctrl.addLocation = false;
        let {errorCode} = res;
        if (errorCode === 0) {
          that.createCase();
          that.queryCaseList();
          that.queryAllCaseList();
        }
      });
    },
    deleteImage(index) {
      this.caseForm.images.splice(index, 1);
    },
    showImages(index) {
      this.imageDialogVisible = true;
      let that = this;
      setTimeout(function(){
        that.$refs.imagesCarousel.setActiveItem(index);
      })
    },
    selectedRow(row) {
      let that = this;
      this.fillContent(row, function (loc) {
        window.maplet.setCenter(new MPoint (loc.lon, loc.lat));
        that.redraw(row.id);
      });
      this.ctrl.addLocation = false;
    },
    fillContent(row, callback) {
      if (this.$refs.caseForm && this.$refs.caseForm.clearValidate) {
        this.$refs.caseForm.clearValidate();
      }
      this.operationed = true;
      let that = this;
      queryCaseById({id: row.id}).then(data => {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          that.caseForm = result.data;
          let lon = result.data.marker.coordinates[0];
          let lat = result.data.marker.coordinates[1];
          that.caseForm.location = lon + "," + lat;
          if (callback) {
            callback({lon: lon, lat: lat});
          }
        }
      })
      that.rightPanelCtrl('open');
    },
    queryCaseList() {
      let that = this;
      var param = { pageSize: this.ctrl.pageSize, pageNum: this.ctrl.pageNum };
      queryCaseList(param).then(function (data) {
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
    queryAllCaseList() {
      this.allCaseList = [];
      let that = this;
      queryCaseList({}).then(function (data) {
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
    addOrRemoveIcon(flag) {
      let that = this;
      if (flag == 'add') {
        window.maplet.clearOverlays();
        let that = this;
        this.allCaseList.forEach((value, index, arr) => {
          let marker = new MMarker(
            new MPoint(value.location[0], value.location[1]),
            new MIcon(markerIcon,22,39,5,22)
          )
          marker.id = marker.id + '_' + value.id;
          MEvent.addListener(marker, "click", function (mk) {
            if (that.currentEditMarker) { // 删除当前新建的点
              window.maplet.removeOverlay(that.currentEditMarker);
            }
            that.redraw(mk.id.split('_')[1]);
            that.fillContent({id: mk.id.split('_')[1]}, null);

          });
          window.maplet.addOverlay(marker);
        })
      } else {
        window.maplet.clearOverlays();
      }
    },
    redraw(id) {
      let marks = window.maplet.getMarkers();
      for (let i = 0; i < marks.length; i++) {
        let item = marks[i];
        let itemId = item.id.split('_')[1];
        if (itemId == id) {
          marks[i].setIcon(new MIcon(markerIconRed,22,39,5,22));
        } else {
          marks[i].setIcon(new MIcon(markerIcon,22,39,5,22));
        }
      }
    },
    initMapbar() {
      let that = this;
      window.maplet = new Maplet("map");
      window.maplet.centerAndZoom(new MPoint(116.38749,39.90515), 8);
      window.maplet.clickToCenter = false;
      // window.maplet.showScale(false);
      window.maplet.showOverview(false);
      // 地图绑定单击事件
      MEvent.addListener(window.maplet, "click", function(event,point) {
        if (that.ctrl.addLocation) {
          that.caseForm.location = point.pid;
          if (that.currentEditMarker) {
            window.maplet.removeOverlay(that.currentEditMarker);
            that.currentEditMarker = null;
          }
          let poi = point.pid.split(',');
          that.currentEditMarker = new MMarker(
              new MPoint(poi[0], poi[1]),
              new MIcon(markerIconGreen,22,39,5,22)
          );
          window.maplet.addOverlay(that.currentEditMarker);
        }
      })
    },
    rightPanelClick() {
       this.ctrl.addLocation = false;
    }
  },
  created: function () {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight;
    this.mapHeight = clientHeight + 'px';
    this.panelHeight = clientHeight - 50 + 'px'; // 后续改善
  },
  mounted: function () {
    this.queryCaseList();
    this.queryAllCaseList();
    this.initMapbar();
  },
  watch: {
    'showIconFlag': {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.addOrRemoveIcon('add');
        } else {
          this.addOrRemoveIcon('remove');
        }
      }
    },
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
    &.open-panel{
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
    &.open-panel{
      display: block;
    }
    &.close-panel {
      display: none;
    }
  }
  .right-open-icon {
    position: absolute;
    right: 0px;
    top: 11px;
    color: #FFFFFF;
    i {
      background-color:#20a0ff;
      padding:10px;
      border-radius: 8px 0px 0px 8px;
      cursor:pointer;
    }
    .disabled {
      cursor: not-allowed;
      background-color: #ccc;
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
    i{
      background-color:#20a0ff;
      padding:10px;
      border-radius: 8px 8px 8px 8px;
    }
  }
  .left-open-icon {
    position: absolute;
    left: 0px;
    top: 0px;
    color: #FFFFFF;
    i {
      background-color:#20a0ff;
      padding:10px;
      margin-top: 10px;
      border-radius: 0px 8px 8px 0px;
    }
  }
}

.my-from {
  .img_delete{
    position: relative;
    top: -72px;
    left: 54px;
    cursor: pointer;
    font-size: 16px;
  }
  .img_delete:hover {
    background: #CCC;
    border-radius: 2px
  }
  .el-form-item{
    margin-top: 10px;
    margin-bottom: 10px;
    padding-right:10px;
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

<style lang="less">
  .return-page-icon .el-dropdown:hover {
     border-radius: 6px;
  }
  .search-filter {
    .el-input__inner {
       border-radius: 0px;
    }
  }
  .location-add-icon {
    padding: 3px 3px !important;
    font-size: 18px;
  }
  .location-add-icon.selected {
    background-color: #ccc;
    border-color: #ccc;
  }
</style>
