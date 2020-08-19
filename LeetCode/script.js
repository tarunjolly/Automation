let puppeeter=require('puppeteer');
let fs=require('fs');
let credentailfile=process.argv[2];

(async function(){
    let data=await fs.promises.readFile(credentailfile,"utf-8");
    let credentails=JSON.parse(data);
    let login=credentails.login;
    let email=credentails.email;
    let pwd=credentails.pwd;
    let browser=await puppeeter.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo:50,
    })

    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
   await tab.goto(login,{waitUntil:"networkidle2"});

   //login
   await loginfn(tab,email,pwd);

   await tab.waitForSelector(".table-responsive.question-list-table .reactable-data tr");
   let allques=await tab.$$(".table-responsive.question-list-table .reactable-data tr");
   console.log(allques.length);

   await solveeachques(tab,allques);




})();




async function loginfn(tab,email,pwd)
{
    await tab.waitForSelector("div.nav-menu a");
    let siginUrl=await tab.$$("div.nav-menu a");
    await Promise.all([siginUrl[4].click(),tab.waitForNavigation({waitUntil:"networkidle2"})]);

    //navigate to login page
    await tab.waitForSelector("#id_login");
    await tab.type("#id_login",email,{delay:100});
    
    await tab.waitForSelector("#id_password");
    await tab.type("#id_password",pwd),{delay:100};
    

    await tab.waitForSelector("#signin_btn");
    await Promise.all([tab.click("#signin_btn"),tab.waitForNavigation({waitUntil:"networkidle2"})]);
    //await pageXOffset.waitFor(20000);
    //Navigate to Problems
    await tab.goto("https://leetcode.com/problemset/all/",{
        waitUntil:"networkidle2",
    })

    
}

async function solveeachques(tab,allques)
{
    let first=allques[0];
    let href=await tab.evaluate(function(element){
        let q=element.querySelectorAll('td');
        let anchor=element.querySelectorAll('a');
        return anchor[0].getAttribute("href");
        //return q;
    },first)
    //console.log(hr);
    let chref=`https://www.leetcode.com${href}`;
    await tab.goto(chref,{waitUntil:"networkidle2"});
    await tab.waitForSelector("div[data-key='solution']");
    await tab.click("div[data-key='solution']");
    
    
    await tab.waitForSelector("iframe[name='CLZq9vzU']")
    let frameHandle = await tab.$("iframe[name='CLZq9vzU']");
    let frame = await frameHandle.contentFrame();
    await frame.waitForSelector("textarea[name='lc-codemirror']");
    let code1=await frame.$("textarea[name='lc-codemirror']");
    let ans=await frame.evaluate(function(element){
        return element.textContent;
    },code1)
    console.log(ans);
    
    //div.ace_content
    //button.custom-testcase__2ah7
    await tab.waitForSelector("button.custom-testcase__2ah7");
    await tab.click("button.custom-testcase__2ah7");

    await tab.waitForSelector("div.ace_content");
    await tab.click("div.ace_content");
    await tab.keyboard.down('Control');
    await tab.keyboard.press('KeyA');
    await tab.keyboard.up('Control');
    
    await tab.keyboard.down('Control');
    await tab.keyboard.press('KeyX');
    await tab.keyboard.up('Control');
     
    await tab.type("div.ace_content",`class Solution{${ans}}`);
    
    await tab.keyboard.down('Control');
    await tab.keyboard.press('KeyA');
    await tab.keyboard.up('Control');
    
    await tab.keyboard.down('Control');
    await tab.keyboard.press('KeyC');
     await tab.keyboard.up('Control');
    


    await tab.waitForSelector("div[data-cy='lang-select']");
    tab.click("div[data-cy='lang-select']");
    await tab.waitForSelector("li[data-cy='lang-select-Java']")
    await tab.click("li[data-cy='lang-select-Java']");
    




    await tab.waitForSelector("div.CodeMirror-code");
    let code=await tab.$$("div.CodeMirror-code");
     console.log(code.length);
    console.log("done");
     await code[0].click();
     await tab.keyboard.down('Control');
     
     await tab.keyboard.press('KeyA');
     await tab.keyboard.up('Control');
     
     
     await tab.keyboard.down('Control');
     
     await tab.keyboard.press('KeyV');
     await tab.keyboard.up('Control');

    //  await code[0].type(`class Solution {
    //      ${ans}
    //     }`);
     await tab.waitForSelector("button[data-cy='submit-code-btn']");
     await tab.click("button[data-cy='submit-code-btn']")

    
}

async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}
