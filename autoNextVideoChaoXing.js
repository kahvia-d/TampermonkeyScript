// ==UserScript==
// @name         阿东的脚本
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
var secondIframeDocuments = []
var videoButton
var videos = []
var video
var index = -1

function playVideo() {
    var hs = secondIframeDocument.getElementsByClassName('vjs-icon-placeholder')
    let model = document.createElement("button")
    model.click
    hs[0].click()
}

function nextVideo() {
    index = index + 1
    // console.log(videos)
    // console.log(index)
    if (videos.length != 0 && index < videos.length) {
        video = videos[index]
        secondIframeDocument = secondIframeDocuments[index]
        //经过反复测试，只能通过模拟点击遮罩去除后，表层的播放按钮，使其自动播放。需要用户在页面加载后手动点击一下空白处，才能使模拟点击生效。
        console.log("播放第" + index + "个视频")
        playVideo()
    }
}

function tryVideo() {
    //找到顶级文档
    topDoc = document
    // console.log("顶级文档下面的iframe层:" + document.getElementsByTagName('iframe'));
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
                    for (var i = 0; i < iframes2.length; i++) {
                        secondIframe = iframes2[i]
                        if (secondIframe != undefined) {
                            //这个iframe层的文档中查找video
                            secondIframeDocument = secondIframe.contentDocument
                            secondIframeDocuments.push(secondIframeDocument)
                            if (secondIframeDocument != undefined) {
                                video = secondIframeDocument.getElementById('video')
                                // console.log("video:" + video)
                                if (video != null) {
                                    videos.push(video)
                                    //通过class标签分析对应作用，started为去除遮罩
                                    // topDoc.getElementsByClassName('prev_title')[0].click()
                                    video.className += " vjs-has-started"
                                    // console.log("click")

                                }
                            }
                        }
                    }
                    nextVideo()

                }
            }
        }
    }
}



//尝试跳转下一节，测验自动跳过。
function tryNext() {
    var checker = setInterval(function () {
        if (secondIframeDocument != undefined) {
            video = secondIframeDocument.getElementById('video')
        }

        let className
        if (video != null) {
            className = video.className;
            //如果在放视频，则检测它播放是否结束
            if (className != null && className.includes('vjs-ended')) {
                if (index >= videos.length) {
                    //结束后则从顶级文档中获取下一节按钮，模拟点击
                    let button2 = topDoc.getElementById('prevNextFocusNext');
                    if (button2 != null) {
                        let tempButton = document.createElement("button")
                        tempButton.onclick = button2.onclick
                        tempButton.click()
                        // console.log(button2)
                        // console.log(button2.onclick);
                    }
                    console.log("播放结束")
                    //结束这一节时，开启新轮回，判断是否需要播放视频
                    oneTime()
                    //清楚当前这个用完了的定时器
                    clearInterval(checker)
                } else {
                    //当前页面还有视频，那就接着放
                    nextVideo()
                }
            }
            //视频结束的时候，有时也会被打上暂停的标签，所以最好也判断下暂停时是正常暂停还是视频结束
            if (className != null && className.includes('vjs-paused') && !className.includes('vjs-ended')) {
                //检测到暂停了就让它继续播放
                // console.log("name:" + className)
                playVideo()
                var options = secondIframeDocument.getElementsByClassName('tkRadio');
                var subButton = secondIframeDocument.getElementById('videoquiz-submit');
                if (options.length != 0) {
                    console.log("检测到" + options.length + "个被嵌入的题目")
                }
                try {
                    for (var i = 0; i < options.length; i++) {
                        console.log("尝试选项:" + i)
                        options[i].click()
                        subButton.click()
                        if (i == options.length - 1) {
                            //正儿八经最后一个才是正确的
                            console.log("回答完毕")
                        }
                    }
                } catch (e) {
                    //正确选项不是最后一个，若是选到正确的，选项框就会消失，再次顺序提交会捕获异常
                    console.log("回答完毕")
                }
            }
        } else {
            //没在播放视频，则模拟点击下一节，跳过答题，同时通过模拟跳过确认
            let button2 = topDoc.getElementById('prevNextFocusNext');
            if (button2 != null) {
                let tempButton = document.createElement("button")
                tempButton.onclick = button2.onclick
                tempButton.click()
                console.log("下一章")
                let button3 = topDoc.getElementsByClassName("nextChapter")[0]
                console.log(topDoc.getElementsByClassName("nextChapter")[0])
                console.log("按钮状态display:" + button3.style.diplay)
                //这个按钮要是隐藏的，就说明这按钮是跳过测验时要触发的按钮，现在只是跳过开头介绍，不需要触发
                console.log("style.diplay:" + button3.style.display)
                if (button3 != null && (button3.style.display == "")) {
                    tempButton.onclick = button3.onclick
                    tempButton.click()
                    console.log("确认跳过答题，去下一章")
                    video = document.createElement("div")
                }
                oneTime()
                clearInterval(checker)
            }
        }
    }, 1000)
}

function oneTime() {
    setTimeout(() => {
        document.createElement("test").click()
        tryVideo()
        tryNext()
    }, 3000)
}

window.onload = function () {
    oneTime();
}
