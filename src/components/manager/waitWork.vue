<template>
  <el-row :gutter="20" style="padding:20px;">
    <el-col :span="6" v-for="o in 17" :key="o">
      <el-card style="margin-top:20px;">
        <el-progress type="circle" :percentage="25" :width="80" style="float:right;"></el-progress>
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
        </div>
        <div>创建人:{{cardDataList[0].createPerson}}</div>
        <div>创建时间:2017-02-12</div>
        <div>提交时间:</div>
        <div>问题总数:</div>
        <div>已审核:</div>
        <div>待审核:</div>
        <div>错误数:</div>
        <div style="text-align:center;padding-top:10px">
          <el-button type="primary" size="mini">通过</el-button>
          <el-button type="primary" size="mini" plain>不通过</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'WaitWork',
  data () {
    return {
      cardDataList: [{
        title:"卡片名称",
        createPerson:'吴振'
      }]
    }
  },
  methods: {
    handleSubmit() {
    }
  }
}
</script>

<style scoped>
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
