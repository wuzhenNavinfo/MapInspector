/**
 * @description
 * @file
 * @author    lingLing
 * @date      2017/11/8
 *
 * @copyright @Navinfo, all rights reserved.
 */
var fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const config = require('../config');
const formidable = require('formidable');

function upload() {
  let instance = null;

  /**
   * 文件上传构造函数;
   * @param options
   * @constructor
     */
  function Construct(options) {
    this.dir = options.dir ? options.dir : 'images';
    if (!options.calledBack) throw new Error('缺少回掉函数!');
    this.request = options.req;
    this.callback = options.calledBack;
    this.tempPath = path.join(config.ROOTPATH, 'tmp');
    this.dateDir = moment().format('MM-DD-YYYY');
    this.upLoadDir = path.join(config.ROOTPATH, './public/upload/' + this.dir + '/', this.dateDir);
    this._assignDir();
  }
  // 创建文件上传的目录;
  Construct.prototype._assignDir = function () {
    let _self = this;
    async.waterfall([
        // 检查临时上传文件是否存在;
        function (callBack) {
          fs.exists(_self.tempPath, exists => {
            if (exists) {
              callBack(null, true);
            } else {
              callBack(null, false);
            }
          });
        },
        // 创建临时上传文件;
        function (param, callBack) {
          if (!param) {
            fs.mkdir(_self.tempPath, err => {
              if (err) throw err;
              callBack(null, true);
            });
          } else {
            callBack(null, true);
          }
        },
        // 递归异步创建多级目录;
        function(param, cb) {
          function mkDirs(uploadPath, callback) {
            fs.exists(uploadPath, exists => {
              if(!exists) {
                mkDirs(path.dirname(uploadPath), () => {
                  fs.mkdir(uploadPath, err => {
                    if (err) throw err;
                    callback();
                  });
                });
              } else {
                callback();
              }
            });
          }
          mkDirs(_self.upLoadDir, () => {
            cb(null)
          })
        }
      ],
      error => {
        if (error) throw error;
        this._parseRequest();
      });
  };

  // 解析上传文件，并放入指定目录中;
  Construct.prototype._parseRequest = function () {
    let form = new formidable.IncomingForm();
    form.uploadDir  = this.upLoadDir;
    form.maxFieldsSize = 5 * 1024 * 1024;
    form.keepExtensions = true;
    form.parse(this.request, (err, fields, files) => {
      if (err) throw err;
      let fileKeys = Object.keys(files);
      async.map(fileKeys, (key, callback) => {
        var filePath = files[key].path;
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(fileExt.toLowerCase()) === -1) {
          callback(new Error('上传文类型错误!'));
        } else {
          // 以当前时间戳对上传文件进行重命名
          let fileNewName = new Date().getTime() + fileExt;
          let targetFile = path.join(this.upLoadDir, fileNewName);
          // 移动文件
          fs.renameSync(filePath, targetFile);
          callback(null, this.dir + '/' + this.dateDir + '/' + fileNewName);
        }
      }, (err, results) => {
        if (err) throw err;
        this.callback(results);
      });
    });
  };

  return function (options) {
    if (!instance) {
      return new Construct(options)
    }
    return instance;
  }
}

module.exports = upload();
