const Config = require('../../../config/config');
const { timeout, log } = require('../../../utils/tools');

class forwardLogin {
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '跳转新开户申请登录页面.',
            code: 1.2
        }
    }
    // 步骤事件.
    static async stepCallback(page) {
        log('点击新开户申请.');
        await page.tap('#oneAccount');

    }
};

module.exports = forwardLogin;