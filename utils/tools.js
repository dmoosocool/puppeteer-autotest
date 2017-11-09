const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
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
        let updatedContent = '';
        let logPath = process.env.logPath;
        switch (type) {
            case 'title':
                updatedContent = '标题:' + content;
                console.log(chalk.green(`${chalk.bold(updatedContent)}`));
                break;

            case 'warning':
                updatedContent = '警告:' + content;
                console.log(chalk.red(`\t${chalk.bold(updatedContent)}\t`));
                break;

            case 'error':
                updatedContent = '错误:' + content;
                console.log(chalk.black(`\t${chalk.bgRed.bold(updatedContent)}\t`));
                break;

            case 'info':
                updatedContent = '描述:' + content;
                console.log(chalk.cyan(`\t${chalk.bold(updatedContent)}\t`));
                break;
            default:
                updatedContent = '描述:' + content;
                console.log(chalk.cyan(`\t${chalk.bold(updatedContent)}\t`));
                break;
        }

        fs.writeFileSync(`${logPath}/log.txt`, updatedContent + '\n', {
            encoding: 'utf8',
            flag: 'a+'
        });
    }

    /**
     * 开始一个流程.
     *
     * @param {string} title 流程名称
     * @param {string} link  流程的入口Url地址
     * @param {boolean} isRestful 是否是restful接口.
     * @param {function} callback 回调函数
     */
    static async beginProcedure(title, link, isRestful, callback) {

        // 打印log
        this.log(title, 'title');
        let defaultConfig = await Config.getDefault();
        let page = await defaultConfig.page;
        let logPath = process.env.logPath;

        // 打开流程入口Url.
        if (!isRestful) {
            await page.goto(link, { timeout: 3000 }).then(() => { }, () => {
                this.log('跳转页面:' + link + '超时', 'warining');
            });

            await page.waitForNavigation({ timeout: 3000 }).then(() => {

            }, () => {
                this.log(`加载页面资源超时: ${link}`, 'warning');
            });

            // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
            await page.mainFrame().addStyleTag({
                content: '*{ font-family: cursive !important; }'
            });

            // 执行步骤完毕将步骤截图到日志文件中.
            await page.screenshot({
                path: `${logPath}/0.0${title} - 流程开始.png`
            });
        }

        // 执行具体流程.
        await callback(page, isRestful);
    }

    /**
     * 开始一个步骤.
     * @param {string} procedure 流程名称
     * @param {object} page 当前流程的标签页
     * @param {string} title 步骤名称
     * @param {number} code 步骤码
     * @param {function} callback 回调函数
     */
    static async beginStep(procedure, page, title, code, isRestful, callback) {

        let logPath = process.env.logPath;

        // 打印log
        this.log(title, 'title');

        if (!isRestful) {
            // 通用步骤设置.
            // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
            await page.mainFrame().addStyleTag({
                content: '*{ font-family: cursive !important; }'
            });

            // 执行步骤完毕将步骤截图到日志文件中.
            await page.screenshot({
                path: `${logPath}/${code}${title}.png`
            });
        }

        // 执行具体步骤.
        await callback();

    }

    /**
     * 队列执行流程数组.
     *
     * @param {Array} stepArr  流程数组
     * @param {int} index   开始执行的下标
     * @param {string} procedure 流程名称
     * @param {Page} page  puppeteer Page对象
     */
    static async runStep(stepArr, index, procedure, page, isRestful) {
        if (index == stepArr.length) {
            return;
        }
        let logPath = process.env.logPath;

        let item = stepArr[index],
            config = item.getConfig();

        this.beginStep(procedure, page, config.title, config.code, isRestful, () => {
            index++;
            item.stepCallback(page, () => this.runStep(stepArr, index, procedure, page));
        });
    }
}
module.exports = Tools;