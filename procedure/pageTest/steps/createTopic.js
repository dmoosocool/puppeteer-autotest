const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

// 新建帖子.
class createTopic {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '发帖 - cnodejs',
            code: 2.1
        }
    }

    static async stepCallback(page, next) {
        let logPath = process.env.logPath;
        // 跳转登录页面
        await page.goto('https://cnodejs.org/topic/create');
        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('发帖页面资源加载超时.', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        log('检查提交按钮..');
        // 检查提交按钮
        let checkSubmitBtn = await page.waitForSelector('#create_topic_form .editor_buttons input[type=submit]', { timeout: 1000 }).then(() => {
            log('已经找到提交按钮的DOM, 即将点击提交按钮.');
            return true;
        }, () => {
            log('未找到提交按钮的DOM, 请更新测试脚本.', 'error');
            return false;
        });

        // 如果没找到DOM, 终止流程.
        if (!checkSubmitBtn) {
            return;
        }

        page.on('dialog', async dialog => {
            log(dialog.message(), 'warning');
            log('关掉弹出框.')
            await dialog.dismiss();
        });

        // 啥也不写就提交.
        log('啥也不写提交.');

        // 截图全屏.
        await page.screenshot({
            path: `${logPath}/2.2 - 啥也不写就提交.png`,
            fullPage: true
        });
        await page.tap('#create_topic_form .editor_buttons input[type=submit]');

        log('检查选择板块页面DOM是否存在.');
        // 检查选择板块.
        let checkSelect = await page.waitForSelector('select#tab-value', { timeout: 1000 }).then(() => {
            log('找到选择板块的下拉框. 即将选择板块.');
            return true;
        }, () => {
            log('未找到选择板块的下拉框, 请更新测试脚本. ', 'error');
            return false;
        });

        // 终止流程.
        if (!checkSelect) {
            return;
        }

        log('开始选择板块');
        await page.select('select#tab-value', 'dev');

        //
        log('选择了板块就提交');
        await page.tap('#create_topic_form .editor_buttons input[type=submit]');

        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('页面资源加载超时', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        let url1 = await page.url();
        if (url1 == 'https://cnodejs.org/topic/create') {
            log('提交出错.', 'error');
        }

        // 检查是否超过限制.
        let checkLimitation = await page.waitForSelector('.alert-error strong', { timeout: 3000 }).then(async () => {
            let errMsg = await page.evaluate(() => {
                return document.querySelector('.alert-error strong').innerHTML;
            });
            log(errMsg, 'warning');
            await page.screenshot({
                path: `${logPath}/2.3 - 选择了板块就提交 出错啦.png`,
                fullPage: true
            });
            if (errMsg == '频率限制：当前操作每天可以进行 7 次') {
                return true;
            } else {
                return false;
            }
        }, async () => {
            log('WTF!!! 没有错误??', 'error');
            return true;
        });

        if (!!await checkLimitation) {
            log('Fuck!!! 居然被限制了!!', 'error');
            // 限制了就执行下一步. 不中断流程了.
            next && next();
            return;
        }

        log('因为之前没有输入标题就提交, 还成功提交了表单, 这个时候得重新选择板块.');
        await page.select('select#tab-value', 'dev');

        // 检查标题.
        let checkTitle = await page.waitForSelector('#title', { timeout: 1000 }).then(() => {
            log('已找到标题的DOM, 即将输入标题.');
            return true;
        }, () => {
            log('未找到标题的DOM, 请更新测试脚本.', 'error');
            return false;
        });

        // 终止流程.
        if (!checkTitle) {
            return;
        }

        // 输入标题.
        log('输入标题..');
        await page.type('#title', '来自puppeteer-autotest的测试标题.', { delay: 35 });

        // 选择完板块 + 输入完标题就提交.
        log('选择完板块 + 输入完标题就提交.');
        await page.tap('#create_topic_form .editor_buttons input[type=submit]');

        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('页面资源加载超时', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        let url2 = await page.url();
        if (url2 == 'https://cnodejs.org/topic/create') {
            log('提交出错.', 'error');
        }

        // 检查是否超过限制.
        let checkLimitation2 = await page.waitForSelector('.alert-error strong', { timeout: 3000 }).then(async () => {
            let errMsg = await page.evaluate(() => {
                return document.querySelector('.alert-error strong').innerHTML;
            });
            await page.screenshot({
                path: `${logPath}/2.4 - 选择完板块 + 输入完标题就提交 出错啦.png`,
                fullPage: true
            });
            log(errMsg, 'warning');
            if (errMsg == '频率限制：当前操作每天可以进行 7 次') {
                return true;
            } else {
                return false;
            }

        }, async () => {
            log('WTF!!! 没有错误??', 'error');
            return true;
        });

        if (!!await checkLimitation2) {
            log('Fuck!!! 居然被限制了!!', 'error');
            // 限制了就执行下一步. 不中断流程了.
            next && next();
            return;
        }
        log('选择完板块+输入完标题就提交, 也成功提交了表单, 但是页面上只恢复了标题内容 居然没有恢复板块.');

        log('选择板块..');
        await page.select('select#tab-value', 'dev');
        log('输入标题..');
        await page.type('#title', '来自puppeteer-autotest的测试标题.' + (+new Date), { delay: 35 });

        // 检查编辑器

        let checkEditor = await page.waitForSelector('.CodeMirror textarea', { timeout: 1000 }).then(() => {
            log('已找到编辑器的DOM, 即将输入内容.');
            return true;
        }, () => {
            log('未找到编辑器的DOM, 请更新测试脚本.', 'error');
            return false;
        });

        if (!checkEditor) {
            return;
        }

        log('输入内容...');
        await page.type('.CodeMirror textarea', '这个是一个来自puppeteer-autotest的测试内容.' + (+ new Date), { delay: 35 });

        await page.tap('#create_topic_form .editor_buttons input[type=submit]');

        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('加载页面资源超时.');
        });


        await page.waitForSelector('#reply_form', { timeout: 3000 }).then(async () => {
            log('发帖成功!');
            await page.screenshot({
                path: `${logPath}/2.4 - 选择完板块 + 输入完标题就提交 出错啦.png`,
                fullPage: true
            });
        }, async () => {
            log('异常', 'warning');
            await page.screenshot({
                path: `${logPath}/2.4 - 选择完板块 + 输入完标题就提交 出错啦.png`,
                fullPage: true
            });
        });

        next && next();
    }
}

module.exports = createTopic;