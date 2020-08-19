let puppeteer=require('puppeteer');
let fs=require('fs');

let credentialFile=process.argv[2];

(async function(){
    //reading the credentails for login 
    let data=await fs.promises.readFile(credentialFile);
    let credentials=JSON.parse(data);
    login=credentials.login;
    email=credentials.email;
    pwd=credentials.pwd;

    //starting the browser
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximised"]
    })

    //creates an empty page
    //await browser.newPage();
    //return array of currently open pages
    let numberOfPages=await browser.pages();
    let tab=numberOfPages[0];
    //goto page
    //1.
    await tab.goto(login,{
        waitUntil:"networkidle2"
    })

    //2.
    //wait for element
    await tab.waitForSelector("#input-1");
    await tab.type("#input-1",email);

    
    await tab.waitForSelector("#input-2");
    await tab.type("#input-2",pwd);

    await tab.waitForSelector("button[data-analytics='LoginPassword']");
    // if a click causes navigation
    // await tab.click("button[data-analytics='LoginPassword']");
    // 3. 
    await navigationHelper(tab,"button[data-analytics='LoginPassword']");
    await tab.waitForSelector("a[data-analytics='NavBarProfileDropDown']");
    await tab.click("a[data-analytics='NavBarProfileDropDown']");
    await tab.waitForSelector("a[data-analytics='NavBarProfileDropDownAdministration']", { visible: true });
    await navigationHelper(tab, "a[data-analytics='NavBarProfileDropDownAdministration']");


    //**************Manage Challenges page******************************************
    await tab.waitForSelector(".administration ul li a");
    let manageTabs = await tab.$$(".administration ul li a");
    await Promise.all([manageTabs[1].click(), tab.waitForNavigation({
        waitUntil: "networkidle2"
    })]);

    //handle a single question
    await HandleSinglePage(tab,browser);
    console.log("all question processed");


    //console.log(href);
    // let chref="https://www.hackerrank.com"+href;
//    let newTab=await browser.newPage();

})()



async function HandleSinglePage(tab,browser)
{
    await tab.waitForSelector(".backbone.block-center")
    let qonPage=await tab.$$(".backbone.block-center");
    let chrefArr=[];
    for(let i=0;i<qonPage.length;i++)
    {
        let href = await tab.evaluate(function (q) {
            return q.getAttribute("href");
        }, qonPage[i]);
        let c="https://www.hackerrank.com"+href;
        chrefArr.push(c);
    }
    let promisearray=[];
    for(let i=0;i<chrefArr.length;i++)
    {
        let newTab=await browser.newPage();
        let willbesolved= SolveOneQuestion(newTab,chrefArr[i]);
        promisearray.push(willbesolved);
    }
    // 1 page all process

    await Promise.all(promisearray);
    console.log("1 page solved");
    let pList = await tab.$$(".pagination ul li");
    let nextBtn = pList[pList.length - 2];
    function getter(elem) {
        return elem.getAttribute("class");
    }
    let className = await tab.evaluate(getter, nextBtn);
    if (className === "disabled") {
        return;
    } else {
        await Promise.all([nextBtn.click(), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
        HandleSinglePage(tab, browser);
    }
    // you have reached the last page
    // go to next page until reached the last page

}




async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}




async function SolveOneQuestion(newTab,chref){
    await newTab.goto(chref,{
        waitUntil:"networkidle0"
    })
    await newTab.waitForSelector("li[data-tab='moderators']");
    await navigationHelper(newTab, "li[data-tab='moderators']");
    await newTab.waitForSelector("#moderator", { visible: true });
    await newTab.type("#moderator", "abhi");
    await newTab.keyboard.press("Enter");

    await newTab.waitForSelector(".save-challenge.btn.btn-green")
    await newTab.click(".save-challenge.btn.btn-green");

    //await setTimeout(function(){},4000);
    await newTab.close();

}

