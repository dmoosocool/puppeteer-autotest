const Config = require('../../../config/config');
const { timeout, log } = require('../../../utils/tools');

class checkBankList {
    static getConfig() {
        // 设置步骤标题及步骤码.
        return {
            title: '检查支持银行接口',
            code: 1.1
        }
    }
    // 步骤事件.
    static async stepCallback(page) {
        log('点击查看支持银行按钮.')
        await page.tap('#checkBank');
        timeout(100);
        await page.waitForSelector('.popup .popup-content');

        const listArr = await page.evaluate(() => {
            const bankList = Array.from(document.querySelectorAll('.popup .popup-content'));
            return bankList.map(list => list.textContent);
        });

        // 如果.popup-content的内容为空, 说明银行列表获取失败.
        if (listArr[0].trim() === '') {
            log('获取银行列表失败.', 'error');
        } else {
            log('获取银行列表成功.');
        }
        await page.tap('.popup .closeBtn');
    }
};

module.exports = checkBankList;