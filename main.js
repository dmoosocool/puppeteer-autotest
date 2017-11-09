// 页面测试
const pageTest = require('./procedure/pageTest');

// restful测试
const restfulTest = require('./procedure/restfulTest');

// 流程队列.
let procedureArr = [
    pageTest,
    // restfulTest
];

// 执行流程队列.
procedureArr.reduce(async (promise, value) => {
    return promise.then(async () => {
        await value();
        return Promise.resolve();
    });
}, Promise.resolve());