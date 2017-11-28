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
    <div class="return-page-icon" :class="rightCollapsed?'open-return-page':'close-return-page'">
       <el-checkbox class="st-check" size="medium" v-model="showIconFlag" label="marker开关" border></el-checkbox>
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
              <label>案例编号:</label><div>{{caseForm.id}}</div>
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
            <el-col :span="6" v-for="(image, index) in caseForm.images" :key="index">
              <img :src="ctrl.baseUrl+'/'+image" class="img-list" style="cursor:pointer;" @click="showImages(index)">
            </el-col>
          </el-row>
        </div>
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
      schfilter:'',
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
    createCase() {
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
              that.$notify.success({ title: '提示', message: '保存成功!', position: 'bottom-right', duration: 2000});
            } else {
              that.$notify.error({ title: '提示', message: '保存失败!', position: 'bottom-right', duration: 2000});
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
    },
    fillContent(row, callback) {
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
            new MIcon(markerIcon,22,39,12,33)
          )
          console.info(value);
          marker.id = marker.id + '_' + value.id;
          marker.extraData = {
            id: value.id
          }
          MEvent.addListener(marker, "click", function (mk) {
            console.info(mk);
            that.redraw(mk.extraData.id);
            that.fillContent({id: mk.extraData.id}, null);

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
          marks[i].setIcon(new MIcon(markerIconRed,22,39,12,33));
        } else {
          marks[i].setIcon(new MIcon(markerIcon,22,39,12,33));
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
  .img-delete{
    position: relative;
    top: -72px;
    left: 54px;
    cursor: pointer;
    font-size: 16px;
    color: red;
    &:hover {
      background: #CCC;
      border-radius: 2px
    }
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
