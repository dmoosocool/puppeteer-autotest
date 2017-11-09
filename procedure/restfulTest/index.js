// restful
const Tools = require('../../utils/tools');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 引入流程步骤.
const checkAccessToken = require('./steps/checkAccessToken');
const getTopic = require('./steps/getTopic');
const postTopic = require('./steps/postTopic');
const updateTopic = require('./steps/updateTopic');

// 日志路径
const logPath = path.resolve(path.dirname(path.dirname(__dirname)) + path.sep + 'logs' + path.sep + moment().format('YYYYMMDDHHmmss'));
// 若文件夹不存在创建日志文件夹.
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}
process.env.logPath = logPath;

// 保存token.
const accessToken = '956e9615-4163-4573-af0e-9b91f0f1f036';
process.env.accessToken = accessToken;

// 保存api地址.
const apiPath = 'https://cnodejs.org/api/v1';
process.env.apiPath = apiPath;

// 流程名称
const procedureTitle = 'cnodejs restful测试.';
// 流程开始url.
const procedureBeginUrl = 'https://cnodejs.org/';

// 流程队列
let step = [
    checkAccessToken,
    getTopic,
    postTopic,
    updateTopic
];

// 从第一个步骤开始执行.
let index = 0;

module.exports = async function () {
    return new Promise((resolve, reject) => {
        let isRestful = true;
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
