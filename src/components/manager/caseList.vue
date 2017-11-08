<template>
  <div class="parent">
    <div class="stable left scroll_style">
      <div class='my-panel'>案例列表</div>
      <el-table stripe border highlight-current-row
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
    <div class="change">
      <div class="my_map_operate_tool">
        <el-button-group>
          <el-button icon="el-icon-circle-plus" size="mini" type="danger" @click="createCase">创建</el-button>
          <el-button icon="el-icon-location" size="mini" type="danger"  @click="addLocation">标记</el-button>
        </el-button-group>
      </div>
      <div id="map" style='height: 100%;'></div>
    </div>
    <div class="stable right scroll_style" :class="{close: !ctrl.caseCreate, open: ctrl.caseCreate}">
      <div class='my-panel'>案例详情
        <el-button style="float:right" size="mini" type="primary" :loading="ctrl.saving" @click="saveCase()">保 存</el-button>
      </div>
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
          <el-input disabled v-model="caseForm.location"></el-input>
        </el-form-item>
        <el-row style="padding-left:10px;">
          <el-col :span="6" v-for="(image, index) in caseForm.images" :key="index">
            <img :src="ctrl.baseUrl+'/'+image" class="img-list">
            <div class="el-icon-delete img_delete" @click="deleteImage(index)"></div>
          </el-col>
        </el-row>
        <el-upload
          class="my-upload" multiple
          :action="ctrl.baseUrl+'/api/bs/case/upload'" :before-upload="handleBeforeUpload"
          :on-success="handlesuccess" :show-file-list="false">
          <el-button size="small" type="primary">点击上传图片</el-button>
        </el-upload>
        <el-row>
          <el-col :span="18" width="260px;"><my-video width="260px;" :sources="video.sources" :options="video.options"></my-video></el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import myVideo from 'vue-video'
import { queryCaseList, queryCaseById, saveCase } from '../../dataService/api';
import imgSrc from '../../assets/user.png'
import videoSrc from '../../assets/2.mp4'
import { appConfig } from '../../config';

export default {
  name: 'CaseList',
  data () {
    return {
      currentPage1: 1,
      ctrl: {
        baseUrl: appConfig.serviceUrl,
        caseCreate: false,
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
        file: {
          precent: 0
        },
        isShowPrecent: false
      },
      caseForm: {
        images:[ ]
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
    createCase() {
      this.ctrl.caseCreate = true;
      this.caseForm.id = '';
      this.caseForm.caseSnap = '';
      this.caseForm.caseDesc = '';
      this.caseForm.caseMethod = '';
      this.caseForm.location = '';
      this.caseForm.images = [];
      this.caseForm.videos = [];
    },
    addLocation () {
      this.caseForm.location = '111.2221,39.988'
    },
    saveCase() {
      let that = this;
      this.$refs.caseForm.validate(function (valid) {
        if(valid) {
          that.ctrl.saving = true;
          let param = {};
          saveCase(param).then(data => {

          });
        }
      });
    },
    deleteImage(index) {
      this.caseForm.images.splice(index, 1)
    },
    selectedRow(row, event) {
      queryCaseById({id: row.id}).then(data => {
        let { errorCode, message, result } = data;
        if (errorCode == 0) {
          this.caseForm = result.data;
        }
      })
      this.ctrl.caseCreate = true;
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
    }
  },
  created: function () {
    this.queryCaseList();
  },
  mounted: function () {
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
}
</script>

<style scoped>
.parent{
  height:100%;
  display:flex;/*设为伸缩容器*/
  flex-flow:row;/*伸缩项目单行排列*/
}
.parent .stable{
  width:320px; /*固定宽度*/
}
.parent .stable.left {
  border-right: solid #e6e6e6 1px;
}
.parent .stable.right.open {
  border-left: solid #e6e6e6 1px;
  overflow-y: auto;
  width: 320px;
}
.parent .stable.right.close {
  border-left: solid #e6e6e6 1px;
  overflow-y: auto;
  width: 1px;
}
.parent .stable.right .img_delete{
  position: relative;
  top: -70px;
  left: 52px;
  cursor: pointer;
}
.parent .stable.right .img_delete:hover {
  background: #CCC;
  border-radius: 2px
}

.parent .change{
  flex:1;/*这里设置为占比1，填充满剩余空间*/
}

.parent .my-panel{
  padding: 10px;
  background: #D8DCE5;
  text-align: left;
  line-height:26px;
  font-size: 18px;
}
.my_map_operate_tool {
  position: absolute;
  z-index: 10;
  top: 10px;
  left: 48%;
}

.my-from .el-form-item{
  margin-top: 10px;
  margin-bottom: 10px;
  padding-right:10px;
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
