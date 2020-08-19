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
        args: ["--start-maximized","--disable-notifications"],
        slowMo:400,
    })

    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    //await tab.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136");

   await tab.goto(login,{waitUntil:"networkidle2"});

   //login
   await loginfn(tab,email,pwd);
   await sendemail(tab);
   
})();



async function sendemail(tab)
{
    console.log("1");
    await tab.waitFor(5000);

    await tab.goto("https://mail.google.com/mail/u/0/#inbox?compose=new",{waitUntil:"networkidle2"});
    console.log("2");
    await tab.waitForSelector("textarea[name='to']");
    await tab.click("textarea[name='to']");
    //enter sender email
    await tab.type("textarea[name='to']","");
    await tab.waitForSelector("input[name='subjectbox']");
    //enter the subject
    await tab.type("input[name='subjectbox']","Automated Email");
    await tab.waitForSelector("div[aria-label='Message Body']");
    //enter the message body
    await tab.type("div[aria-label='Message Body']","Sending an email");


    await tab.waitForSelector("div[aria-label='Send ‪(Ctrl-Enter)‬']");
    await tab.click("div[aria-label='Send ‪(Ctrl-Enter)‬']");
    console.log("Email sent successfully");
}

async function loginfn(tab,email,pwd)
{
    //email
    await tab.waitForSelector("input#identifierId");
    await tab.type("input#identifierId", email, { delay: 300 });
    await tab.waitForSelector("div#identifierNext");
    await Promise.all([tab.click("div#identifierNext"),await tab.waitForNavigation({waitUntil:"networkidle2"})]);
    //pwd
     await tab.waitForSelector("input[aria-label='Enter your password']");
     await tab.type("input[aria-label='Enter your password']", pwd, { delay: 300 });
    // //login button 
     await tab.waitForSelector("#passwordNext");
     await tab.click("#passwordNext");
     console.log("Logged into Gmail");
}