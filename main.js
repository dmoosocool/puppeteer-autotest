// 默认开户流程
const normal = require('./procedure/normal');

// 流程队列.
let procedureArr = [
    normal
];

// 执行流程队列.
procedureArr.forEach(item => {
    item();
});