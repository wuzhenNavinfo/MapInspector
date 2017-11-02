<template>
  <div class='container'>HOME</div>

</template>

<script>


</script>

<style scoped>
  .container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		background-color: red;
	}
  .container .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color:#fff;
  }
  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }
  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color:#fff;
  }
  .container .header .userinfo .userinfo-inner img{
    width: 40px;
    						height: 40px;
    						border-radius: 20px;
    						margin: 10px 0px 10px 10px;
    						float: right;
  }
  .container .header .logo{
    height:60px;
    				font-size: 22px;
    				padding-left:20px;
    				padding-right:20px;
    				border-color: rgba(238,241,146,0.3);
    				border-right-width: 1px;
    				border-right-style: solid;
  }
</style>
