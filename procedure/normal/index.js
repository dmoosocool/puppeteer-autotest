// 正常流程.
const Tools = require('../../utils/tools');
const openAccoutnGuide = require('./steps/openAccountGuide');
const forwardLogin = require('./steps/forwardLogin');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 日志路径
const logPath = path.resolve(path.dirname(path.dirname(__dirname)) + path.sep + 'logs' + path.sep + moment().format('YYYYMMDDHHmmss'));
// 若文件夹不存在创建日志文件夹.
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

// 流程队列
const step = [
    openAccoutnGuide,
    // forwardLogin
];

const procedureTitle = '正常开户';
const procedureBeginUrl = 'http://localhost:12345/pages/accountGuide.html';

module.exports = function () {
    // 开始一个流程
    Tools.beginProcedure(procedureTitle, procedureBeginUrl, logPath, (page) => {
        let steps = [];
        for (var i = 0; i < step.length; i++) {
            // steps.push(function () {
            // return new Promise((resolve, reject) => {
            let item = step[i];
            let config = item.getConfig();
            Tools.beginStep(procedureTitle, page, config.title, config.code, logPath, () => {
                item.stepCallback(page);
            }, () => {
                // 完成回调.
                // resolve();
            });
            // });
            // })
        }

        // Promise.all(steps);

        // step.forEach((item) => {
        //     let config = item.getConfig();
        //     Tools.beginStep(procedureTitle, page, config.title, config.code, logPath, () => {
        //         item.stepCallback(page);
        //     }, () => {
        //         // 完成回调.
        //     });
        // });
    });
};
