const puppeteer = require('puppeteer');
const { timeout, log } = require('../utils/tools');
const CONFIG = require('../config/config');

let accountGuide = async () => {
    // 打开项目地址
    await page.goto('http://localhost:12345/pages/accountGuide.html');
    // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
    await page.mainFrame().addStyleTag({
        content: '*{ font-family: cursive !important; }'
    });

    await page.screenshot({
        path: `${CONFIG.logPath}/1.1开户引导页.png`
    });

    // 等待默认请求2秒
    await timeout(2000);

    console.log('点击查看支持银行按钮.');
    await page.tap('#checkBank');
    await timeout(100);

    await page.screenshot({
        path: `${CONFIG.logPath}/1.2开户引导页-银行支持.png`
    });

    console.log('关闭支持银行的弹框.');
    await page.tap('.popup .closeBtn');

    await timeout(1000);
    console.log('点击查询进度');
    await page.tap('#result');
    await timeout(1000);

    // mac 上chromium v64版本字体有问题 强行设置字体避免乱码.
    await page.mainFrame().addStyleTag({
        content: '*{ font-family: cursive !important; }'
    });
    await timeout(1000);

    await page.screenshot({
        path: `${CONFIG.logPath}/2.1查询进度-登录.png`
    });
    console.log('截图日志已存入:' + path.resolve(CONFIG.logPath) + '中');

    // keep the browser open
    // await browser.close();
}

module.exports = accountGuide;