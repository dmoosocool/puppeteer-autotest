// 正常流程.
const Tools = require('../../utils/tools');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 引入流程步骤.
const loginCnodejs = require('./steps/loginCnodejs');
const createTopic = require('./steps/createTopic');
const replyComment = require('./steps/replyComment');

// 日志路径
const logPath = path.resolve(path.dirname(path.dirname(__dirname)) + path.sep + 'logs' + path.sep + moment().format('YYYYMMDDHHmmss'));
// 若文件夹不存在创建日志文件夹.
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}
process.env.logPath = logPath;

// 流程名称
const procedureTitle = 'cnodejs 页面测试.';
// 流程开始url.
const procedureBeginUrl = 'https://cnodejs.org/';

// 流程队列
let step = [
    loginCnodejs,
    createTopic,
    replyComment
];

// 从第一个步骤开始执行.
let index = 0;

module.exports = async function () {
    return new Promise((resolve, reject) => {
        let isRestful = false;
        // 开始一个流程
        Tools.beginProcedure(procedureTitle, procedureBeginUrl, isRestful, (page, isRestful) => {
            // 队列执行一个流程.
            Tools.runStep(step, 0, procedureTitle, page, isRestful, () => {
                item.stepCallback(page);
            });
            resolve();
        });
    });
};
