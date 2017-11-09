const Config = require('../../../config/config'); //引入配置项, 其中包含 browser和page.
const { timeout, log } = require('../../../utils/tools'); // 引入工具类.

// 定义一个步骤. 登录Cnodejs.

class loginCnodejs {
    // 设置步骤标题及步骤码.
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '登录 - cnodejs',
            code: 1.1
        }
    }

    // 步骤事件. (具体步骤干啥..)
    static async stepCallback(page, next) {
        let logPath = process.env.logPath;
        // 跳转登录页面
        await page.goto('https://cnodejs.org/signin');
        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('登录页面资源加载超时.', 'warning');
        });

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        // 输入用户名..
        log('检查用户名DOM是否存在.');
        let checkUsername = await page.waitForSelector('#name', { timeout: 1000 }).then(() => {
            log('用户名标签已找到, 即将输入用户名.');
            return true;
        }, () => {
            log('用户名标签没找到. 请更新测试脚本.', 'error');
            return false;
        });

        // 终止步骤.
        if (!checkUsername) {
            return;
        }
        log('------- 输入错误的账号密码 -------');
        log('输入用户名');
        await page.type('#name', 'helloWolrd', { delay: 35 });
        // 输入密码..
        log('检查密码框DOM是否存在.');
        let checkPassword = await page.waitForSelector('#pass', { timeout: 1000 }).then(() => {
            log('密码框标签已找到, 即将输入密码.');
            return true;
        }, () => {
            log('密码框标签未找到, 请更新测试脚本.', 'error');
            return false;
        });

        // 终止步骤.
        if (!checkPassword) {
            return;
        }

        log('输入密码');
        await page.type('#pass', 'goodbyeWorld', { delay: 35 });

        // 提交表单.
        log('检查提交按钮DOM是否存在.');
        let checkSubmitBtn = await page.waitForSelector('#signin_form input[type=submit]', { timeout: 1000 }).then(() => {
            log('提交按钮已找到. 即将提交表单进行登录.');
            return true;
        }, () => {
            log('提交按钮未找到. 请更新测试脚本.', 'error');
            return false;
        });

        // 终止步骤.
        if (!checkSubmitBtn) {
            return;
        }

        // 截图错误的账号密码
        await page.screenshot({
            path: `${logPath}/1.2 - 错误的账号密码.png`
        });


        // 校验用户信息.
        await page.tap('#signin_form input[type=submit]');

        // 等待跳转页面, 设置页面加载资源超时时间为10秒.
        await page.waitForNavigation({ timeout: 3000 }).then(() => {

        }, () => {
            log('获取页面资源超时.', 'warning');
        });

        let url = await page.url();

        // 解决mac chromium 中文乱码.
        await page.mainFrame().addStyleTag({
            content: '*{ font-family: cursive !important; }'
        });

        // 根据跳转的url判断账号密码是否正确.
        if (url.indexOf('signin') > -1) {
            log('账号或密码不正确, 重新输入.', 'error');

            // 截图错误的账号密码提示信息
            await page.screenshot({
                path: `${logPath}/1.3 - 截图错误的账号密码提示信息.png`
            });

            log('------- 输入正确的账号密码 -------');
            await page.type('#name', '输入你的账号', { delay: 35 });
            await page.type('#pass', '输入你的密码', { delay: 35 });

            // 截图正确的账号密码提示信息
            await page.screenshot({
                path: `${logPath}/1.4 - 截图正确的账号密码.png`
            });
            // 点击提交按钮.
            await page.tap('#signin_form input[type=submit]');

            await page.waitForNavigation({ timeout: 3000 }).then(() => {

            }, () => {
                log('获取页面资源超时.', 'warning');
            });

            let rightUrl = await page.url();

            if (rightUrl.indexOf('signin') > -1) {
                log('你这次是真的密码不对啦~  赶紧找回密码!!!!', 'error');
                // 截图正确的账号密码错误的提示信息
                await page.screenshot({
                    path: `${logPath}/1.6 - 截图正确的账号密码错误的提示信息.png`
                });
                return;
            } else {
                // 截图登录成功的界面.
                await page.screenshot({
                    path: `${logPath}/1.5 - 截图登录成功的界面.png`
                });
                log('登录成功!');
            }
        } else {
            log('登录成功!');
        }

        // 执行下一个步骤.
        next && next();
    }
};

module.exports = loginCnodejs;
