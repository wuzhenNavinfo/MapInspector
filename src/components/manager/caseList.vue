<template>
  <div class="layout-container" >
    <div id="map" :style="{height: mapHeight}"></div>
    <div class="left-open-icon" @click="leftPanelCtrl('open')" title="展开">
       <i class="el-icon-caret-right" style="cursor:pointer;" ></i>
    </div>
    <div class="left" :class="leftCollapsed?'open-panel':'close-panel'">
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
            prop="createdAt"
            label="创建时间">
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
    <div class="map_operate_tool">
       <el-button size="mini" type="danger" @click="createCase()">创 建</el-button>
    </div>
    <div class="right-open-icon" @click="rightPanelCtrl('open')" title="展开">
       <i class="el-icon-caret-left" style="cursor:pointer;" ></i>
    </div>
    <div class="return-page-icon" @click="backPrev()" :class="rightCollapsed?'open-return-page':'close-return-page'" title="返回上一页">
       <i class="el-icon-back" style="cursor:pointer;" ></i>
    </div>
    <div class="right" :class="rightCollapsed?'open-panel':'close-panel'">
      <div class='my-panel'>
        <i class="el-icon-caret-right" style="cursor:pointer;" @click="rightPanelCtrl('close')"></i>案例详情
        <el-button style="float:right;margin-left:10px;" size="mini" type="warning" :loading="ctrl.saving" @click="saveCase()" >保存</el-button>
        <el-button style="float:right;"  size="mini" type="warning" :loading="ctrl.deleteing" @click="deleteCase()">删除</el-button>
      </div>
      <div class="scroll_style" :style="{'max-height': panelHeight}">
        <el-form ref="caseForm" :model="caseForm" class="my-from" :rules="rules" :show-message="false" :status-icon="true"  label-width="80px">
          <el-form-item label="问题编号">
            <el-input disabled v-model="caseForm.id"></el-input>
          </el-form-item>
          <el-form-item prop="caseSnap" label="问题概述">
            <el-input v-model="caseForm.caseSnap"></el-input>
          </el-form-item>
          <el-form-item prop="caseDesc" label="详细描述">
            <el-input type="textarea" v-model="caseForm.caseDesc"></el-input>
          </el-form-item>
          <el-form-item prop="caseMethod" label="处理方法">
            <el-input type="textarea" v-model="caseForm.caseMethod"></el-input>
          </el-form-item>
          <el-form-item prop="location" disabled label="点位信息">
            <el-input disabled v-model="caseForm.location" style="width:200px;"></el-input>
            <i class="el-icon-location" @click="addLocation" style="cursor:pointer;"></i>
          </el-form-item>
          <el-row style="padding-left:10px;">
            <el-col :span="6" v-for="(image, index) in caseForm.images" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list">
              <div class="el-icon-delete img_delete" @click="deleteImage(index)"></div>
            </el-col>
          </el-row>
          <el-upload
            class="my-upload" multiple
            :action="ctrl.baseUrl+'/api/bs/case/upload?token='+ctrl.curentUser.token" :before-upload="handleBeforeUpload"
            :on-success="handlesuccess" :show-file-list="false">
            <el-button size="small" type="primary">点击上传图片</el-button>
          </el-upload>
          <el-row>
            <el-col :span="18" width="260px;">
              <!-- <my-video width="260px;" :sources="video.sources" :options="video.options"></my-video> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Maplet from 'Maplet'
import myVideo from 'vue-video'
import { queryCaseList, queryCaseById, saveCaseInfo, deleteCaseById} from '../../dataService/api';
import mapMarker from '../../assets/marker.gif'
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig, appUtil } from '../../config';

export default {
  name: 'CaseList',
  data () {
    return {
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
    createCase() {
      this.clearCase();
      this.rightPanelCtrl('open');
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
        that.createCase();
        that.queryCaseList();
      });
    },
    deleteImage(index) {
      this.caseForm.images.splice(index, 1)
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
  right: 40px;
}
.layout-container .return-page-icon i{
  background-color:#20a0ff;
  padding:10px;
  margin-top: 10px;
  border-radius: 8px 8px 8px 8px;
}

.map_operate_tool {
  position: absolute;
  z-index: 10;
  top: 10px;
  left: 48%;
}
.my-from .img_delete{
  position: relative;
  top: -70px;
  left: 52px;
  cursor: pointer;
}
.my-from .img_delete:hover {
  background: #CCC;
  border-radius: 2px
}
.my-from .el-form-item{
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
</style>
