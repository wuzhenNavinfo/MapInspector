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
    </div>
    <div class="right-open-icon" title="展开">
       <i class="el-icon-caret-left" :class="operationed?'enabled':'disabled'" @click="rightPanelCtrl('open')" ></i>
    </div>
    <div class="return-page-icon" @click="backPrev()" :class="rightCollapsed?'open-return-page':'close-return-page'">
       <i class="el-icon-back" style="cursor:pointer;" ></i>
       <!-- <el-dropdown trigger="hover">
                      <i class="el-icon-date" style="cursor:pointer;" ></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided >退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                   </el-dropdown> -->
    </div>
    <div class="right" :class="rightCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>
        <i class="el-icon-caret-right" style="cursor:pointer;" @click="rightPanelCtrl('close')"></i>案例详情
        <el-button style="float:right;margin-left:10px;" icon="el-icon-check" size="mini" type="warning" :loading="ctrl.saving" @click="saveCase()" >保存</el-button>
        <el-button style="float:right;" icon="el-icon-delete"  size="mini" type="warning" :loading="ctrl.deleteing" @click="deleteCase()">删除</el-button>
      </div>
      <div class="scroll_style" :style="{'max-height': panelHeight}">
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
            <el-input disabled v-model="caseForm.location" style="width:200px;"></el-input>
            <i class="el-icon-location" @click="addLocation" style="cursor:pointer;font-size:24px;"></i>
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
      <el-dialog custom-class="myDialog" :visible.sync="imageDialogVisible">
         <el-carousel ref="imagesCarousel" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="image in caseForm.images" :key="image" style="text-align:center">
              <img :src="ctrl.baseUrl+'/'+image" style="max-width:100%;max-height:100%;height:500px;">
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
import { queryCaseList, queryCaseById, saveCaseInfo, deleteCaseById} from '../../dataService/api';
import mapMarker from '../../assets/poi_black.png'
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig, appUtil } from '../../config';

export default {
  name: 'CaseList',
  data () {
    return {
      operationed: false,
      imageDialogVisible: false,
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
      console.info(flag);
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
        let {errorCode} = res;
        if (errorCode === 0) {
          window.maplet.clearOverlays();
          that.createCase();
          that.queryCaseList();
        }
      });
    },
    deleteImage(index) {
      this.caseForm.images.splice(index, 1)
    },
    showImages(index) {
      this.imageDialogVisible = true;
      let that = this;
      setTimeout(function(){
        that.$refs.imagesCarousel.setActiveItem(index);
      })
    },
    selectedRow(row, event) {
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
          window.maplet.setCenter(new MPoint (lon, lat));
          window.maplet.clearOverlays();
          window.marker = new MMarker(
              new MPoint(lon, lat),
              new MIcon(mapMarker,32,32,16,26)
          );
          window.maplet.addOverlay(marker);
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
              new MIcon(mapMarker,32,32,16,26)
          );
          window.maplet.addOverlay(marker);
        }
      })
    },
    initMapboxgl() {
      mapboxgl.accessToken="pk.eyJ1IjoiZmFuZ2xhbmsiLCJhIjoiY2lpcjc1YzQxMDA5NHZra3NpaDAyODB4eSJ9.z6uZHccXvtyVqA5zmalfGg"
      var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [116.403909,39.915212],
          zoom: 10,
          maxZoom: 17,
          minZoom: 5,
          pitch: 0
      });
    }
  },
  created: function () {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight;
    this.mapHeight = clientHeight + 'px';
    this.panelHeight = clientHeight - 50 + 'px'; // 后续改善
  },
  mounted: function () {
    this.queryCaseList();
    // this.initMapboxgl();
    this.initMapbar();
  },
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
    font-size: 16px;
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
    top: 0px;
    color: #FFFFFF;
    i {
      background-color:#20a0ff;
      padding:10px;
      margin-top: 10px;
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
    top: 0px;
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
      margin-top: 10px;
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

.map_operate_tool {
  position: absolute;
  z-index: 10;
  top: 10px;
  left: 48%;
}
.my-from {
  .img_delete{
    position: relative;
    top: -73px;
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

.my-dialog{
  background-color: red !important;
}
</style>
