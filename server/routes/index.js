module.exports = function(app){
  // 分发user模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现
  var model = require('../models/list');
  // 查询列表；
  app.use('/getList', model.getList);

  // 删除列表；
  app.use('/deleteList', model.deleteList);

  // 增加列表；
  app.use('/addList', model.addList);
};
