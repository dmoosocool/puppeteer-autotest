let Q = require("q");

let Queue = function (setcount) {
    this.list = [];//任务列表
    this.js = 0;//当前运行任务数
    if (setcount == 0 && typeof setcount != 'number') this.count = 1;
    this.count = setcount;//最高并发数
    this.ps = false;//暂停
};

Queue.prototype = {
    clear: function () {//清空任务队列
        this.list.length = 0;
        return this;
    },
    pause: function () {//暂停任务队列
        this.ps = true;
    },
    rec: function () {//恢复任务队列
        this.ps = false;
        this.run();
    },
    set: function (fn) {//设置任务
        this.list.push(fn);
        return this;
    },
    set_run: function (fn) {//设置任务并启动
        this.list.push(fn);
        this.run();
        return this;
    },
    get: function () {//查询任务数
        return this.list.length;
    },
    run: function () {
        if (!this.ps) {
            //最高并发数-当前运行任务数=可以运行的任务数
            var i = this.count - this.js;
            var p;
            //保存可运行任务
            var k = [];
            //可以运行的任务数-任务数组长度<0的话
            //取可以运行的任务数 否则取任务数组长度
            i - this.list.length > 0 ? p = this.list.length : p = i;
            //循环写入可运行任务到数组K
            while (p) {
                k.push(this.list.shift() || function () { });
                p--;
            }
            (function (obj) {
                k.forEach(function (item) {
                    obj.js++;
                    item().then(function (msg) {
                        console.log(msg);
                        if (obj.get() && obj.js--) {
                            if (obj.count - q.js > 0 && obj.ps == false)
                                obj.run();
                        }
                    });
                });
            })(this)
        }
    }
};

module.exports = Queue;