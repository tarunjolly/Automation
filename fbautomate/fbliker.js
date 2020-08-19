let puppeteer=require('puppeteer');
let fs=require('fs');


let credentialFile=process.argv[2];

let pageName=process.argv[3];
let postToLike=20;
//let numberOfPost=process.argv[4];

(async function(){
    let data=await fs.promises.readFile(credentialFile);
    let credentials=JSON.parse(data);
    login=credentials.login;
    email=credentials.email;
    pwd=credentials.pwd;

    //starting the browser
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximised","--disable-notifications"]
    })

    let numberOfPages=await browser.pages();
    let tab=numberOfPages[0];
    //goto page
    //1.
    await tab.goto(login,{
        waitUntil:"networkidle2"
    })
    //#email
    await tab.waitForSelector("#email");
    await tab.type("#email",email);

    
    await tab.waitForSelector("#pass");
    await tab.type("#pass",pwd);

    await tab.waitForSelector("input[data-testid='royal_login_button']");
    await navigationHelper(tab,"input[data-testid='royal_login_button']");

    await tab.waitForSelector("input[data-testid='search_input']");
    await tab.type("input[data-testid='search_input']","DTU times");
    await tab.keyboard.press("Enter");

    await tab.goto("https://www.facebook.com/hindustantimes/",{waitUntil:"networkidle2"});
    await Promise.all([tab.click("div[data-key='tab_posts']"), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    let idx = 0
    do {
        // _1xnd> ._4-u2.4-u8
        await tab.waitForSelector("#pagelet_timeline_main_column ._1xnd .clearfix.uiMorePager");
        let allposts = await tab.$$("#pagelet_timeline_main_column ._1xnd > ._4-u2._4-u8");
        let cPost = allposts[idx];
        let cPostLike = await cPost.$("._666k");
        await cPostLike.click({ delay: 2000 });
        idx++;
        
        await tab.waitForSelector(".uiMorePagerLoader", { hidden: true });

    } while (idx < postToLike)




})()


async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}
