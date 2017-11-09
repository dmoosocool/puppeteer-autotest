const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

class postTopic {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '发布主题. - cnodejs',
            code: 12.1
        }
    }

    // 步骤事件. (具体步骤干啥..)
    static async stepCallback(page, next) {
        log('发布主题');

        let result = await page.evaluate(async (options) => {
            var params = {
                accesstoken: options.accessToken,
                title: '这是一个来自puppeteer-autotest发布的主题标题' + +new Date,
                tab: 'dev',
                content: '这是一个来自puppeteer-autotest发布的主题内容' + +new Date
            };

            return await fetch(options.apiPath + '/topics/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(params)
            })
                .then(response => response.json())
                .then(data => data)
                .catch(e => console.log("Oops, error", e));
        }, { apiPath: process.env.apiPath, accessToken: process.env.accessToken });

        if (!!result.success) {
            log('发布成功');
            log('topic_id' + result.topic_id);
        } else {
            log('发布主题失败');
        }

        //执行下一步
        next && next();
    }
}

module.exports = postTopic;