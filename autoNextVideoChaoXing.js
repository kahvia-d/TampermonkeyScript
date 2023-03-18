// ==UserScript==
// @name         myself
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// ==/UserScript==

var topDoc
var iframes1
var firstIframe
var firstIframeDocument
var iframes2
var secondIframe
var secondIframeDocument
var videoButton
var video

function tryVideo() {
    //找到顶级文档
    topDoc = document
    // console.log(document.getElementsByTagName('iframe'));
    //查询它下面的的iframe层
    iframes1 = document.getElementsByTagName('iframe')
    if (iframes1 != undefined) {
        // console.log("iframes1:" + iframes1);
        //通过调试工具找到目标iframe层，这里是0层
        firstIframe = iframes1[0]
        if (firstIframe != undefined) {
            // console.log("firstIframe:" + firstIframe);
            //获取这一层文档
            firstIframeDocument = firstIframe.contentDocument
            if (firstIframeDocument != undefined) {
                // console.log("firstIframeDocument:" + firstIframeDocument);
                //再往下面找
                iframes2 = firstIframeDocument.getElementsByTagName('iframe')
                if (iframes2 != undefined) {
                    //获取到我们需要的iframe层
                    secondIframe = iframes2[0]
                    if (secondIframe != undefined) {
                        //这个iframe层的文档中查找video
                        secondIframeDocument = secondIframe.contentDocument
                        if (secondIframeDocument != undefined) {
                            video = secondIframeDocument.getElementById('video')
                            if (video != null) {
                                //通过class标签分析对应作用，started为去除遮罩
                                video.className += " vjs-has-started"
                                // console.log("click")
                                //经过反复测试，只能通过模拟点击遮罩去除后，表层的播放按钮，使其自动播放。需要用户在页面加载后手动点击一下空白处，才能使模拟点击生效。
                                var hs = secondIframeDocument.getElementsByClassName('vjs-icon-placeholder')
                                let model = document.createElement("button")
                                model.click
                                hs[0].click()
                            }
                        }
                    }
                }
            }
        }
    }
}

//尝试跳转下一节，测验自动跳过。
function tryNext() {
    var checker = setInterval(function () {
        video = secondIframeDocument.getElementById('video')
        let className
        if (video != null) {
            className = video.className;
            //如果在放视频，则检测它播放是否结束
            if (className != null && className.includes('vjs-ended')) {
                //结束后则从顶级文档中获取下一节按钮，模拟点击
                let button2 = topDoc.getElementById('prevNextFocusNext');
                if (button2 != null) {
                    let tempButton = document.createElement("button")
                    tempButton.onclick = button2.onclick
                    tempButton.click()
                    console.log(button2)
                    console.log(button2.onclick);
                    // let button3 = topDoc.getElementsByClassName("nextChapter")[0]
                    // if (button3 != null) {
                    //     tempButton.onclick = button3.onclick
                    //     tempButton.click()
                    // }
                }
                console.log("running")
                //结束这一节时，开启新轮回，判断是否需要播放视频
                oneTime()
                //清楚当前这个用完了的定时器
                clearInterval(checker)
            }
        } else {
            //没在播放视频，则模拟点击下一节，跳过答题，同时通过模拟跳过确认
            let button2 = topDoc.getElementById('prevNextFocusNext');
            if (button2 != null) {
                let tempButton = document.createElement("button")
                tempButton.onclick = button2.onclick
                tempButton.click()
                let button3 = topDoc.getElementsByClassName("nextChapter")[0]
                if (button3 != null) {
                    tempButton.onclick = button3.onclick
                    tempButton.click()
                    video = document.createElement("div")
                    oneTime()
                    clearInterval(checker)
                }
            }
        }
    }, 1000)
}

function oneTime() {
    setTimeout(() => {
        tryVideo()
        tryNext()
    }, 3000)
}

window.onload = function () {
    oneTime();
}
