// 正常流程.
const Tools = require('../../utils/tools');
// const openAccoutnGuide = require('./steps/openAccountGuide');
// const forwardLogin = require('./steps/forwardLogin');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 日志路径
const logPath = path.resolve(path.dirname(path.dirname(__dirname)) + path.sep + 'logs' + path.sep + moment().format('YYYYMMDDHHmmss'));
// 若文件夹不存在创建日志文件夹.
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}
process.env.logPath = logPath;

// 流程名称
const procedureTitle = '流程名称';
// 流程开始url.
const procedureBeginUrl = 'http://www.baidu.com';

// 流程队列
let step = [

];

let index = 0;

module.exports = function () {
    // 开始一个流程
    Tools.beginProcedure(procedureTitle, procedureBeginUrl, (page) => {
        // 队列执行一个流程.
        Tools.runStep(step, 0, procedureTitle, page, () => {
            item.stepCallback(page);
        });
    });
};
