<template>
  <div style="border:solid red 1px;height:100%;">
    <div id="allmap" style="border:solid red 1px;height:100%;"></div>
  </div>
</template>

<script>
// import {MP, MapBar} from '../map'
// import BMap from 'BMap'
import Maplet from 'Maplet'

export default {
  name: 'Map',
  data () {
    return {

    }
  },
  methods: {
    initBMap() {
      MP("GseQ0VeRd8fyD1pE3q0wP3jD").then( BMap => {
        var th = this
        var map = new BMap.Map("allmap");            // 创建Map实例
        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
        map.centerAndZoom(point,15);
        map.enableScrollWheelZoom();
      })
    },
    initBMap2() {
      var map = new BMap.Map('allmap')
      var point = new BMap.Point(114.0552, 22.55) // 创建点坐标
      map.centerAndZoom(point, 12)
      map.enableScrollWheelZoom()    // 启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom()    // 启用地图惯性拖拽，默认禁用
    },
    initMapbar() {
      console.info('=========');
      console.info(Maplet);
      window.maplet = new Maplet("allmap");
      window.maplet.centerAndZoom(new MPoint(116.38672,39.90805), 8);
    }
  },
  mounted() {
    this.$nextTick(function () {
      // this.initBMap();
      // this.initBMap2();
      this.initMapbar();
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
