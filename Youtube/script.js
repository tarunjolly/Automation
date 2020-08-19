let puppeeter=require('puppeteer');
let fs=require('fs');
let songName=process.argv[2];

(async function(){
    let browser=await puppeeter.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo:50,
    })

    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    await tab.goto("https://www.youtube.com/",{waitUntil:"networkidle2"});
    await tab.waitForSelector("input[id='search']");
    await tab.type("input[id='search']",songName);
    await tab.waitForSelector("button[id='search-icon-legacy']");
    await tab.click("button[id='search-icon-legacy']");

    await tab.waitForSelector("a[id='video-title']");
    let songPlay=await tab.$("a[id='video-title']");
    await songPlay.click("a[id='video-title']");





})()



