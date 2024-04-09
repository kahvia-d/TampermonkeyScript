// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  try to take over the world!
// @author       You
// @match        https://changjiang.yuketang.cn/v2/web/studentCards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// ==/UserScript==

function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time)
    })
}

function watch() {
    //等待时间的单位为毫秒（ms）
    let waitTime = 5000;

    return new Promise((resolve, reject) => {
        //时间到了以后，返回true，表示 watch 这个过程完成，外部无需继续等待，外部程序继续执行。
        setTimeout(() => {
            resolve(true);
        }, waitTime)
    })
}

(async function () {
    'use strict';

    // Your code here...

    //页面刚打开的时候，模拟点击 “查看课件”
    await wait(3000);
    document.getElementsByClassName('ppt_img_box')[0].click();

    await wait(2000);

    //获取ppt页面
    let pages = document.getElementsByClassName('swiper-no-swiping');

    for (let i = 0; i < pages.length; i++) {
        //点击对应页面进行切换。
        pages[i].click();
        //观看ppt，完成后进行下一轮循环，即下一页
        await watch();
        console.log(`第${i}页看完了`);
    }

    console.log("全部观看完成");

})();