const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

// 添加回复.
class replyComment {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '回帖 - cnodejs',
            code: 3.1
        }
    }

    static async stepCallback(page, next) {
        let logPath = process.env.logPath;
        // 找到自己的帖子 测试回帖功能.
        await page.goto('https://cnodejs.org/topic/5a02e5b85eebf62d4d86fd4c');
        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('发帖页面资源加载超时.', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        let checkSubmitBtn = await page.waitForSelector('#reply_form input[type=submit]', { timeout: 2000 }).then(() => {
            log('找到了提交按钮.');
            return true;
        }, () => {
            log('未找到了提交按钮. 请修改测试脚本.', 'error');
            return false;
        });

        if (!checkSubmitBtn) {
            return;
        }

        log('啥也不写就回复');
        await page.tap('#reply_form input[type=submit]');

        await page.waitForNavigation({ timeout: 3000 }).then(() => { }, () => {
            log('页面资源加载超时', 'warning');
        });

        await page.waitForSelector('.alert alert-error', { timeout: 3000 }).then(() => {
            log('不写回复内容,居然没有错误???', 'error');
        }, () => {
            log('回复内容不能为空!');
        });

        await page.screenshot({
            path: `${logPath}/3.2 - 截图错误信息.png`,
            fullPage: true
        });

        log('写回复内容,再提交.');
        await page.goto('https://cnodejs.org/topic/5a02e5b85eebf62d4d86fd4c');
        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('发帖页面资源加载超时.', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        // 检查编辑器

        let checkEditor = await page.waitForSelector('#reply_form textarea[name=r_content]', { timeout: 1000 }).then(() => {
            log('已找到编辑器的DOM, 即将输入内容.');
            return true;
        }, () => {
            log('未找到编辑器的DOM, 请更新测试脚本.', 'error');
            return false;
        });

        if (!checkEditor) {
            return;
        }
        log('输入回复内容...');

        await page.type('.CodeMirror textarea', '这个是一个来自puppeteer-autotest的测试内容.' + (+ new Date), { delay: 35 });

        log('输入内容完毕');
        await timeout(3000);
        await page.screenshot({
            path: `${logPath}/3.3 - 输入回复内容提交.png`,
            fullPage: true
        });

        log('输入不了内容 测试失败...');

        next && next();
    }
}

module.exports = replyComment;