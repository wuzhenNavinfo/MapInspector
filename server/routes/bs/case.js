/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/1
 *
 * @copyright @Navinfo, all rights reserved.
 */
var express = require('express');
var router = express.Router();
const path = require('path');
const logger = require('../../log').logger;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var bs_caseController = require('../../controller/bs/bs_caseController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.mapped());
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_caseController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

/**
 * @api {get} /bs/case/list 用户查询(bs/case/list)
 * @apiName list.
 * @apiGroup case manage.
 * @apiDescription 案例查询功能，不传参数返回所有用户,
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} [pageSize] 每页显示个数（可选）.
 * @apiParam {Integer} [pageNum]  查询页码（可选）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "errorCode": 0,
 *     "result": {
 *         "data": [
 *             {
 *                 "createdAt": "2017-11-24",
 *                 "updatedAt": "2017-11-24",
 *                 "id": 23,
 *                 "caseSnap": "台湾海峡问题",
 *                 "caseDesc": "台湾海峡部分地域存在争议",
 *                 "caseMethod": "问题搁置，继续洽谈",
 *                 "images": "images/case/11-24-2017/1511503483687.png",
 *                 "videos": "",
 *                 "marker": {
 *                     "type": "Point",
 *                     "coordinates": [
 *                         119.63061,
 *                         23.64742
 *                     ]
 *                 },
 *                 "createUser": 1,
 *                 "mediaLength": 1
 *             },
 *             {
 *                 "createdAt": "2017-11-23",
 *                 "updatedAt": "2017-11-24",
 *                 "id": 22,
 *                 "caseSnap": "南海问题",
 *                 "caseDesc": "南海属于中国",
 *                 "caseMethod": "干掉猴子",
 *                 "images": "images/case/11-23-2017/1511429261442.jpg,images/case/11-23-2017/1511429266947.jpg,images/case/11-23-2017/1511429267193.jpg",
 *                 "videos": "",
 *                 "marker": {
 *                     "type": "Point",
 *                     "coordinates": [
 *                         119.89719,
 *                         12.31317
 *                     ]
 *                 },
 *                 "createUser": 1,
 *                 "mediaLength": 3
 *             },
 *             {
 *                 "createdAt": "2017-11-21",
 *                 "updatedAt": "2017-11-24",
 *                 "id": 4,
 *                 "caseSnap": "禁止直行",
 *                 "caseDesc": "禁止直行描述",
 *                 "caseMethod": "禁止直行处理方法",
 *                 "images": "images/case/11-21-2017/1511248118886.jpg,images/case/11-21-2017/1511256242868.jpg",
 *                 "videos": "",
 *                 "marker": {
 *                     "type": "Point",
 *                     "coordinates": [
 *                         117.32951,
 *                         40.47641
 *                     ]
 *                 },
 *                 "createUser": 1,
 *                 "mediaLength": 2
 *             }
 *         ],
 *         "total": 8
 *     },
 *     "message": "查找成功"
 * }
 */
router.get('/list', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {get} /bs/case/listDetail 用户查询(bs/case/listDetail).
 * @apiName listDetail.
 * @apiGroup case manage.
 * @apiDescription 案例与问题的联合查询,返回特定项目下案例与问题的关联查询结果,
 * 传递一个参数返回所有结果，传递三个参数可进行分页查询.
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} projectCode 项目Id（必填）.
 * @apiParam {Integer} [pageSize] 每页显示个数（可选）.
 * @apiParam {Integer} [pageNum]  查询页码（可选）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "errorCode": 0,
 *   "result": {
 *     "data": [
 *       {
 *         "issueMediaLength": 1,
 *         "issueId": 122,
 *         "issueStatus": 1,
 *         "proCode": 13,
 *         "caseMediaLength": 2,
 *         "caseSnap": "禁止直行",
 *         "caseDesc": "禁止直行描述",
 *         "caseCode": 4,
 *         "marker": {
 *           "type": "Point",
 *           "coordinates": [
 *             117.32951,
 *             40.47641
 *           ]
 *         },
 *         "createdAt": "2017-11-21"
 *       },
 *       {
 *         "issueMediaLength": 2,
 *         "issueId": 115,
 *         "issueStatus": 1,
 *         "proCode": 13,
 *         "caseMediaLength": 1,
 *         "caseSnap": "黄金坪水系问题",
 *         "caseDesc": "黄金坪水系问题",
 *         "caseCode": 17,
 *         "marker": {
 *           "type": "Point",
 *             124.2956,
 *            39.97433
 *           ]
 *         },
 *         "createdAt": "2017-11-23"
 *       }
 *     ],
 *     "total": 2
 *   },
 *   "message": "查找成功"
 * }
 */
router.get('/listDetail', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt(),
  check('projectCode').exists().withMessage('缺少projectCode参数').isInt().withMessage('projectCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {get} /bs/case/query 案例查询(bs/case/query).
 * @apiName query.
 * @apiGroup case manage.
 * @apiDescription 案例详情接口,返回某个案例的全量信息.
 * @apiParam {Integer} id 案例的Id（必填）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 *  {
 *     "errorCode": 0,
 *     "result": {
 *         "data": {
 *             "createdAt": "2017-11-23",
 *             "updatedAt": "2017-11-23",
 *             "id": 17,
 *             "caseSnap": "黄金坪水系问题",
 *             "caseDesc": "黄金坪水系问题",
 *             "caseMethod": "1",
 *             "images": [
 *                 "images/case/11-23-2017/1511420013768.PNG"
 *             ],
 *             "videos": [],
 *             "marker": {
 *                 "type": "Point",
 *                 "coordinates": [
 *                     124.2956,
 *                     39.97433
 *                 ]
 *             },
 *             "createUser": 1
 *         }
 *     },
 *     "message": "查找成功"
 * }
 */
router.get('/query', [
  sanitize(['id']).toInt(),
  check('id').exists().withMessage('缺少id参数').isInt().withMessage('id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/create 新建案例(bs/case/create).
 * @apiName create.
 * @apiGroup case manage.
 * @apiDescription 新增案例.
 * @apiParam {String} caseSnap 案例概述（必填）.
 * @apiParam {String} [caseDesc] 案例的描述，默认为空（可选）.
 * @apiParam {String} [caseMethod] 案例的处理方法，默认为空（可选）.
 * @apiParam {Array} [images] 案例图片，默认为[]（可选）.
 * @apiParam {Array} [videos] 案例视频，默认为[]（可选）.
 * @apiParam {geoJson} [marker] 案例的点位信息，默认为{type: 'Point', coordinates: [0, 0]}（可选）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "errorCode": 0,
 *  "result": {
 *    "data": {
 *      "createdAt": "2017-11-28",
 *      "updatedAt": "2017-11-28",
 *      "id": 26,
 *      "createUser": 1,
 *      "caseSnap": "111",
 *      "caseDesc": "111",
 *      "caseMethod": "111",
 *      "images": [
 *        "images/case/11-28-2017/1511840633074.jpg",
 *        "images/case/11-28-2017/1511840633090.jpg",
 *        "images/case/11-28-2017/1511840633140.jpg",
 *        "images/case/11-28-2017/1511840633155.jpg"
 *      ],
 *      "videos": [],
 *      "marker": {
 *        "type": "Point",
 *        "coordinates": [
 *          "119.5025",
 *          "23.78178"
 *        ]
 *      }
 *    }
 *  },
 *  "message": "案例创建成功"
 *}
 */
router.post('/create', [
  check('caseSnap').exists().withMessage('caseSnap属性为必填项'),
  sanitize('caseSnap').escape()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/upload 案例上传(bs/case/upload).
 * @apiName upload.
 * @apiGroup case manage.
 * @apiDescription 案例上传接口，支持的图片格式为'.jpg', 'jpeg', '.png', '.gif'.
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "errorCode": 0,
 *  "result": {
 *    "data": [
 *      "images/case/11-28-2017/1511840479211.jpg"
 *    ]
 *  },
 *  "message": "成功上传1张图片"
 *}
 */
router.post('/upload', function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/update 修改案例(bs/case/update).
 * @apiName update.
 * @apiGroup case manage.
 * @apiDescription 修改案例.
 * @apiParam {String} [caseSnap] 案例概述（可选）.
 * @apiParam {String} [caseDesc] 案例的描述，默认为空（可选）.
 * @apiParam {String} [caseMethod] 案例的处理方法，默认为空（可选）.
 * @apiParam {Array} [images] 案例图片，默认为[]（可选）.
 * @apiParam {Array} [videos] 案例视频，默认为[]（可选）.
 * @apiParam {geoJson} [marker] 案例的点位信息，默认为{type: 'Point', coordinates: [0, 0]}（可选）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "errorCode": 0,
 *  "message": "案例更新成功"
 * }
 */
router.post('/update', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数'),
  sanitize(['caseSnap', 'caseDesc', 'caseMethod']).escape()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/delete 案例删除(bs/case/delete).
 * @apiName delete.
 * @apiGroup case manage.
 * @apiDescription 根据案例id删除案例功能.
 * @apiParam {Integer} id 案例主键Id（必填）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "errorCode": 0,
 *  "message": "删除成功"
 * }
 */
router.get('/delete', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

module.exports = router;
