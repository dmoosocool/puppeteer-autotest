const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

class getTopic {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '获取主题. - cnodejs',
            code: 11.1
        }
    }

    static async funcGetTopic(page, topicId) {
        let result = await page.evaluate(async (options) => {
            return await fetch(options.apiPath + '/topic/' + options.topicId + '?mdrender=false', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(response => response.json())
                .then(data => data)
                .catch(e => console.log("Oops, error", e));
        }, { apiPath: process.env.apiPath, topicId });
        return result;
    }

    // 步骤事件. (具体步骤干啥..)
    static async stepCallback(page, next) {
        log('获取主题');
        let result = await this.funcGetTopic(page, '5a02e5b85eebf62d4d86fd4c');
        if (!!result.success) {
            log('获取成功');
            log('标题：' + result.data.title);
            log('内容：' + result.data.content);
        } else {
            log('获取主题失败');
        }

        //执行下一步
        next && next();
    }
}

module.exports = getTopic;