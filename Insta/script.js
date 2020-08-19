let puppeteer=require("puppeteer");
let fs=require("fs");
let credentialsFile = process.argv[2];
let nooflikes=process.argv[3]
// let searchpage = process.argv[3];

let tab;

(async function(){
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized","--incognito","--disable-notifications"],
        slowMo:100
    })
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    url = credentials.url;
    username = credentials.username;
    pwd = credentials.pwd;
    let noofpages=await browser.pages();
     tab=noofpages[0]

    await tab.goto(url,{
        waitUntil:"networkidle0"
    });
    
    await totype("input[name='username']",username)
    console.log("username entered")
    await totype("input[name='password']",pwd)
    console.log("password entered")

   
    await navigator("button[type='submit']");
    await tab.goto(url,{waitUntil:"networkidle0"});
    let idx=0;
    do{
    await tab.waitForSelector("svg[aria-label='Like'][height='24']")
    let like=await tab.$$("svg[aria-label='Like'][height='24']")
    let comment=await tab.$$("textarea[aria-label='Add a comment…']")
    for(let i=0;i<like.length &&idx<nooflikes;i++){
        await like[i].click()
        await comment[idx].click()
        await tab.type("hey beauts")
        idx++;
        console.log("like done h"+idx)
    }

}while(idx<nooflikes)

console.log("while khatam")











    // await tab.waitForSelector(".piCib button")
    // let list=tab.$$(".piCib button")
    // await normalclick(list[1])
    // await tab.goto(`https://www.facebook.com/${searchpage}/posts`,{
    //     waitUntil:"networkidle0"
    // });

    // let like=await tab.$$("#pagelet_timeline_main_column div[role='article'] a[role='button']")
    // console.log(like)

   
   
   
   
   



})()

async function totype(selector,data){
    await tab.waitForSelector(selector);
    await tab.type(selector,data)
}
async function normalclick(selector){
    await tab.waitForSelector(selector);
    await tab.click(selector)
}
async function navigator(selector){
    await Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle2"
    }),tab.click(selector)])
}

async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

