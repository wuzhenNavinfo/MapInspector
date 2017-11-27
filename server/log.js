var log4js = require('log4js');
log4js.configure({
  appenders: {
    ruleConsole: {type: 'console'},
    ruleFile: {
      type: 'dateFile',
      filename: 'server-',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 5 * 1024 * 1024,
      numBackups: 3,
      alwaysIncludePattern: true,
      replaceConsole: true
    }
  },
  categories: {
    default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}
  }
});

var dateFileLog = log4js.getLogger('dateFile');

exports.logger = dateFileLog;

exports.use = function(app) {
  app.use(log4js.connectLogger(dateFileLog, {level:'info', format:':method :url'}));
}
