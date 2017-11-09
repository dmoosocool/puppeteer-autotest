

[TOC]

# 介绍

> **Puppeteer**是一个通过[DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)控制headless chromium的高级node库, 也可通过设置设置非headless Chromium.
>
> Puppeteer有chrome官方团队进行维护, 相对于其他如PhantomJs, CasperJs 前景更好.



## Puppeteer 适合干些什么事?

- 爬虫
- 前端自动化测试（表单操作、事件模拟、键盘输入... 等）



## 安装Puppeteer

> 建议使用新版本node.js (8+ 支持async/await 用法). 

```shell
npm i -S puppeteer //建议最好使用npm进行安装. 
```



>  顺利安装好会在 **./node_modules/puppeteer/.local-chromium** 中 若是不成功, 根据提示设置环境变量PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,也可设置到npmrc中下载不包含chromium的 puppeteer. 自行下载chromium。
>
>  [手动下载地址](https://download-chromium.appspot.com/) (需翻墙….) 根据自己的系统选择对应的版本下载.
>
>  **注意：**
>
>  - **v64版本以下的chromium Puppeteer支持的不好**
>  - **若是手动下载的运行时在设置中需指定Chromium位置.**
>
>  ```javascript
>  const browser = await puppeteer.launch({
>   // 指定chromium路径 若是自己下载的需要指定下载路径.
>   executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
>   // true不会打开浏览器.
>   headless: false
>  });
>  ```

## puppeteer-autotest

> 本来想用puppeteer + mocha + chai 直接写自动化测试的, 结果发现 mocha中执行puppeteer不能打开浏览器, 所以puppeteer-autotest 中添加了两个概念, **流程**和**步骤**。puppeteer-autotest, 在一个流程中可以队列执行步骤.

### 流程

> 流程由多个步骤组成. 

#### 示例:

```javascript
// 正常流程.
const Tools = require('../../utils/tools');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 引入流程步骤.
const loginCnodejs = require('./steps/loginCnodejs');
const createTopic = require('./steps/createTopic');
const replyComment = require('./steps/replyComment');

// 日志路径
const logPath = path.resolve(path.dirname(path.dirname(__dirname)) + path.sep + 'logs' + path.sep + moment().format('YYYYMMDDHHmmss'));
// 若文件夹不存在创建日志文件夹.
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}
process.env.logPath = logPath;

// 流程名称
const procedureTitle = 'cnodejs 页面测试.';
// 流程开始url.
const procedureBeginUrl = 'https://cnodejs.org/';

// 流程队列
let step = [
    loginCnodejs,
    createTopic,
    replyComment
];

// 从第一个步骤开始执行.
let index = 0;

module.exports = async function () {
    return new Promise((resolve, reject) => {
        // 这不是一个restful的测试.
        let isRestful = false;
        // 开始一个流程
        Tools.beginProcedure(procedureTitle, procedureBeginUrl, isRestful, (page, isRestful) => {
            // 队列执行一个流程.
            Tools.runStep(step, 0, procedureTitle, page, isRestful, () => {
                item.stepCallback(page);
            });
            resolve();
        });
    });
};

```



### 步骤

> 步骤应该保证一个步骤中只干一件事情(包括 **正常**及**异常** 步骤).

####示例:

```javascript
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
      	// 执行loginCnodejs步骤.

        // 执行下一个步骤.
        next && next();
    }
};

module.exports = loginCnodejs;
```

## Puppeteer常用命令

- 设置浏览器.

```javascript
const browser = await puppeteer.launch({
  // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
  executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
  timeout: 15000, //设置超时时间,
  ignoreHTTPSErrors: true, // 如果是访问https页面 此属性会忽略https错误,
  devtools: true, // 打开开发者工具, 当此值为true时, headless总为false,
  headless: false, // 关闭headless模式, 不会打开浏览器,
})
```

- 打开一个新标签页

```javascript
const page = browser.newPage();
```

- 页面跳转

```javascript
await page.goto('https://cnodejs.com'); //如果页面跳转其中一些资源加载超时会报错.

// 建议这样写可避免因为promise所报的超时错误.
await page.goto('https://cnodejs.com', {timeout: 3000}).then( () => {
    console.log('跳转成功并且资源正确加载完毕.');
}, () => {
    console.log('跳转成功, 资源加载超时.');
});

```



- 设置浏览器参数,

```javascript
const devices = require('puppeteer/DeviceDescriptors');
// 设置测试机型.
const testDevice = devices['iPhone 6'];
await page.emulate(testDevice);
```

- 获取页面标题

```javascript
let title = await page.title();
```

- 获取焦点

```javascript
await page.focus('#elementId'); 
```

- 点击按钮

```javascript
await page.click('#elementId'); 
await page.tap('#elementId'); //用于手机端
```

- 获取DOM

```javascript
let el = await page.$('#elementId');  // 相当于document.querySelector('#elementId');
await el.click();	// 执行点击事件

let list = await page.$$('.someclass'); // 相当于document.querySelectorAll('.someClass');
```

- 获取DOM属性

```javascript
let inputValue = await page.$eval('#input', el => el.value);
```

- 文本输入

```javascript
await page.type('#inputId', '输入内容.');
await page.type('#inputId', '输入内容.', { delay: 200 }); // 设置输入间隔200ms(拟人输入);
```

- evaluate

```javascript
let result = await page.evaluate( () => {
  // 获取一个元素, 这里可直接使用js
  return document.getElementById('testEl').getAttribute('anyAttr');
})

console.log(result); // testEl的anyAttr属性值.
```

- waitFor 等待(元素或者函数或者一个延迟毫秒)

> [waitFor 详细文档](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#framewaitforselectororfunctionortimeout-options-args)

```javascript
await page.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]]);
```

- 设置页面样式

```javascript
await page.mainFrame().addStyleTag({
    content: '* { background-color: red; }';
});
```

- 屏幕截图

```javascript
await page.screenshot({
  path: 'some/to/path.png',
  fullPage: true // 全屏截取, 默认false.
});
```

- 发送请求. 在浏览器中使用fetch发送请求.

```javascript
// 向http://example.com发送一个POST请求, 请求参数为 {a:1, b:2};
let result = await page.evaluete( async (options) => {
   return await fetch('http://example.com', {
        method: 'POST', // 
      	header: {
            'Content-Type': 'application/json; charset=utf-8'
        },
      	body: JSON.stringify(options)
    })
  		.then(response => response.json())
  		.then(data => data)
  		.fail( e => console.log('Oops, error', e));
}, { a: 1, b: 2});
console.log(result); //接口返回值.

```

- 发送请求. 通过puppeteer的page.on('request'); 进行拦截. 使用goto进行触发请求.

```javascript
await page.setRequestInterceptionEnabled(true);
page.on('request', request => {
  const overrides = {};
  
  // 如果是需要请求的地址.
  if (request.url === 'http://www.google.com') {
    //设置请求方式.
    overrides.method = 'POST';
    //设置参数
    overrides.postData = 'a=b&c=d';
  }
  request.continue(overrides);
});
let response = await page.goto('http://www.google.com');
response.json();// 将response.body 转成json。
response.ok(); //  返回一个boolean值 如果状态码为200-299则为true, 其他则为false.
response.status; // 返回状态码
response.text(); // 返回 response body.
response.headers // 返回 HTTP headers
```

- 关闭页面中的弹框

```javascript
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();

  // 当页面中有弹框调起的时候触发.
  page.on('dialog', async dialog => {
    console.log(dialog.message()); //打印弹框的内容
    await dialog.dismiss(); //关闭弹框
  });
  
  page.evaluate(() => alert('1'));  // 浏览器中执行 alert('1');
});
```



## 在做cnodejs自动化测试时遇到的问题



1. 页面在跳转的时候经常资源加载超时,  同样也是获取一些用户头像时候网络超时.

![页面跳转时经常资源加载超时](https://ws2.sinaimg.cn/large/006tKfTcgy1flbld370hij30mi0naaig.jpg)

2. 在发布话题和回复话题中的编辑器…   

![回复编辑器](https://ws3.sinaimg.cn/large/006tKfTcgy1flbm059iocj30ns060wfj.jpg)

查看DOM结构这里的回复是表单提交 但是 将textarea.editor[name="r_content"]中设置值依旧提醒回复内容不能为空... 有点绝望.

到这里...... 通过页面的点击方法为cnodejs添加自动测试**失败**~

还有 Mac版本的 chromium 不强行给页面所有元素设置字体 有情况会变成 框框...

就算设置了也有可能有些位置会变成框框...

有哪位老哥找到方法了告诉下...



完成项

- [x] 可以用户登录cnodejs

- [ ] ~~创建话题~~  不能在编辑其中模拟输入内容. 失败.
- [ ] ~~回复话题~~ 不能在编辑其中模拟输入内容. 失败.

效果图

![pagetest](https://ws3.sinaimg.cn/large/006tKfTcgy1flbwnk6skdg31a40qwe84.gif)



## 通过puppeteer-autotest为cnodejs做页面自动化测试 发现几点问题.

1. 发布话题的时候,  js校验只校验了板块选项卡, 而标题内容的校验都由服务端校验的. 这里的表单内容js全部校验一次 是不是可以缓解下服务端的压力?
2. 同样的问题也出现在了回复话题中, 对于未填写回复内容的时候的校验也是由服务端校验的.



## 下面来用puppeteer-autotest为cnodejs做restful api测试

1. 在procedure 下新建文件夹restfulTest
2. restfulTest中新建index.js 用来管理这个流程
3. restfulTest中新建steps文件夹 该文件夹中存放所有的流程.



完成项

- 校验accessToken. checkAccessToken.
- 获取话题 getTopic
- 新建话题 postTopic
- 修改话题 updateTopic

#### 效果图

![restful autotest](https://ws2.sinaimg.cn/large/006tKfTcgy1flbw5urrs0g30ew0lkgoy.gif)

## 相关资料

### Puppeteer案例

https://juejin.im/entry/59ad6c4f5188250f4850dccc

https://github.com/zhentaoo/puppeteer-deep

https://segmentfault.com/a/1190000011627343

http://www.cnblogs.com/dolphinX/p/7715268.html

### 官方api

https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md