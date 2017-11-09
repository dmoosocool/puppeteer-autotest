const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

class updateTopic {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '修改主题. - cnodejs',
            code: 13.1
        }
    }

    // 步骤事件. (具体步骤干啥..)
    static async stepCallback(page, next) {
        log('修改主题');
        let result = await page.evaluate(async (options) => {
            var params = {
                accesstoken: options.accessToken,
                topic_id: options.topic_id,
                title: '这是一个来自puppeteer-autotest修改的主题标题' + +new Date,
                tab: 'dev',
                content: '这是一个来自puppeteer-autotest修改的主题内容' + +new Date
            };

            return await fetch(options.apiPath + '/topics/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(params)
            })
                .then(response => response.json())
                .then(data => data)
                .catch(e => console.log("Oops, error", e));
        }, { apiPath: process.env.apiPath, accessToken: process.env.accessToken, topic_id: '5a03fc6484ed7ceb219ea851' });

        if (!!result.success) {
            log('修改成功');
            log('topic_id' + result.topic_id);
        } else {
            log('修改主题失败');
        }

        //执行下一步
        next && next();
    }
}

module.exports = updateTopic;