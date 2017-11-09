const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

class checkAccessToken {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '校验accesstoken - cnodejs',
            code: 10.1
        }
    }

    static async checkToken(page, token) {
        log("token值为" + token);
        const apiPath = process.env.apiPath;
        let result = await page.evaluate(async (options) => {
            var params = {
                accesstoken: options.token,
            };
            return await fetch(options.apiPath + '/accesstoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(params)
            })
                .then(response => response.json())
                .then(data => data)
                .catch(e => console.log("Oops, error", e));
        }, { token, apiPath });
        return result;
    }


    // 步骤事件. (具体步骤干啥..)
    static async stepCallback(page, next) {
        log('传入错误的token');
        let checkWrongToken = await this.checkToken(page, 'asdhjkadhajkshdjkashk');
        if (!checkWrongToken.success) {
            log('校验错误的token 正确');
        }

        log('传入正确的token');
        let checkRightToken = await this.checkToken(page, process.env.accessToken);

        if (!!checkRightToken.success) {
            log('校验正确的token 正确');
            log(checkRightToken.loginname + ', 欢迎回来~');
        }

        //执行下一步
        next && next();
    }
}

module.exports = checkAccessToken;