const chalk = require('chalk');
const puppeteer = require('puppeteer');
const Config = require('../config/config');

class Tools {
    /**
     * 延迟执行
     * @param {int} delay 毫秒数
     */
    static timeout(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(1)
                } catch (e) {
                    reject(0)
                }
            }, delay);
        })
    }

    /**
     *
     * 打印日志. 默认打印信息.
     *
     * @param {string} content 描述信息
     * @param {enum} type title|warning|error|info
     * @example
     * ```javascript
     *  log('hello world', 'title');
     *  log('这里是个警告.', 'warning');
     *  log('这里是个错误.', 'error');
     *  log('这里是个描述.', 'info');
     *  log('这里也是描述.');
     * ```
     */
    static log(content, type) {
        switch (type) {
            case 'title':
                console.log(chalk.green(`${chalk.bold('标题:' + content)}`));
                break;

            case 'warning':
                console.log(chalk.red(`\t${chalk.bold('警告:' + content)}\t`));
                break;

            case 'error':
                console.log(chalk.black(`\t${chalk.bgRed.bold('错误:' + content)}\t`));
                break;

            case 'info':
                console.log(chalk.cyan(`\t${chalk.bold('描述:' + content)}\t`));
                break;
            default:
                console.log(chalk.cyan(`\t${chalk.bold('描述:' + content)}\t`));
                break;
        }
    }

    /**
     * 开始一个流程.
     *
     * @param {string} title 流程名称
     * @param {string} link  流程的入口Url地址
     * @param {string} logPath 日志路径
     * @param {function} callback 回调函数
     */
    static async beginProcedure(title, link, logPath, callback) {
        // 打印log
        this.log(title, 'title');
        let defaultConfig = await Config.getDefault();
        let page = await defaultConfig.page;

        // 打开流程入口Url.
        await page.goto(link);

        // 延迟2秒
        await this.timeout(2000);
        // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        // 执行步骤完毕将步骤截图到日志文件中.
        await page.screenshot({
            path: `${logPath}/0.0${title} - 流程开始.png`
        });

        // 执行具体流程.
        await callback(page);
    }

    /**
     * 开始一个步骤.
     * @param {string} procedure 流程名称
     * @param {object} page 当前流程的标签页
     * @param {string} title 步骤名称
     * @param {number} code 步骤码
     * @param {string} logPath 日志路径
     * @param {function} callback 回调函数
     * @param {function} complateCallback 完成回调
     */
    static async beginStep(procedure, page, title, code, logPath, callback, complateCallback) {
        // 延迟2秒执行步骤.
        await this.timeout(2000);

        // 打印log
        this.log(title, 'title');

        // 通用步骤设置.
        // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        // 执行具体步骤.
        await callback();

        // 执行步骤完毕将步骤截图到日志文件中.
        await page.screenshot({
            path: `${logPath}/${code}${title}.png`
        });

        await complateCallback();
    }
}
module.exports = Tools;