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
var bs_issueController = require('../../controller/bs/bs_issueController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.mapped());
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_issueController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

/**
 * @api {post} /bs/issue/create 创建问题(bs/issue/create).
 * @apiName create.
 * @apiGroup issue manage.
 * @apiDescription 新增问题.
 * @apiParam {Array} proCode 问题所在的项目id(必传).
 * @apiParam {Array} caseCode 问题对应的案例id(必传).
 * @apiParam {Array} [images] 问题图片，默认为[]（可选）.
 * @apiParam {Array} [videos] 问题视频，默认为[]（可选）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "errorCode": 0,
 *  "message": "问题创建成功"
 * }
 */
router.post('/create', [
  check('proCode').exists().withMessage('缺少proCode参数').isInt().withMessage('proCode必须为整数'),
  check('caseCode').exists().withMessage('缺少caseCode参数').isInt().withMessage('caseCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/issue/auditIssue 审核问题(bs/issue/auditIssue).
 * @apiName auditIssue.
 * @apiGroup issue manage.
 * @apiDescription 审核问题.
 * @apiParam {Array} issueStatus 问题的状态(必传)，可选值为[0待审核，1审核通过，2审核不通过].
 * @apiParam {Array} issueId 问题的主键id(必传).
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "errorCode": 0,
 *  "message": "问题审核成功"
 * }
 */
router.post('/auditIssue', [
  check('issueStatus').exists().withMessage('缺少issueStatus参数').isInt().withMessage('issueStatus必须为整数'),
  check('issueId').exists().withMessage('缺少issueId参数').isInt().withMessage('issueId必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {get} /bs/issue/find 查询单条问题(bs/issue/find).
 * @apiName find.
 * @apiGroup issue manage.
 * @apiDescription 根据项目id和案例id查询单条问题;
 * @apiParam {Integer} proCode 问题所在的项目id(必传).
 * @apiParam {Integer} caseCode 问题对应的案例id(必传).
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "errorCode": 0,
 *  "result": {
 *    "caseCode": 4,
 *    "caseSnap": "禁止直行",
 *    "caseDesc": "禁止直行描述",
 *    "caseMethod": "禁止直行处理方法",
 *    "caseMarker": {
 *      "type": "Point",
 *      "coordinates": [
 *        117.32951,
 *        40.47641
 *      ]
 *    },
 *    "caseImages": [
 *      "images/case/11-21-2017/1511248118886.jpg",
 *      "images/case/11-21-2017/1511256242868.jpg"
 *    ],
 *    "caseVideos": [],
 *    "issueId": 134,
 *    "issueStatus": 0,
 *    "issueVideos": [],
 *    "issueImages": [
 *      "images/case/11-28-2017/1511847270216.jpg",
 *      "images/case/11-28-2017/1511847270245.jpg"
 *    ]
 *  },
 *  "message": "问题查询成功"
 *}
 */
router.get('/find', [
  check('proCode').exists().withMessage('缺少proCode参数').isInt().withMessage('proCode必须为整数'),
  check('caseCode').exists().withMessage('缺少caseCode参数').isInt().withMessage('caseCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/issue/upload 问题上传(bs/issue/upload).
 * @apiName upload.
 * @apiGroup issue manage.
 * @apiDescription 问题上传接口，支持的图片格式为'.jpg', 'jpeg', '.png', '.gif'.
 * @apiUse ErrorExample
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
 * @api {get} /bs/issue/delete 问题删除(bs/issue/delete)
 * @apiName delete.
 * @apiGroup issue manage.
 * @apiDescription 根据问题id删除问题功能.
 * @apiParam {Integer} id 问题主键Id（必填）.
 * @apiUse ErrorExample
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "errorCode": 0,
 *  "message": "删除成功"
 * }
 */
router.get('/delete', [
  check('id')
  .exists().withMessage('项目id不能为空')
  .isInt().withMessage('项目id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});


module.exports = router;
