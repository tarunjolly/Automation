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
   await login(tab,email,pwd);



})()




async function login(tab,email,pwd)
{
    
}