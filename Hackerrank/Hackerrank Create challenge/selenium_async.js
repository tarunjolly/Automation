// npm install selenium-webdriver chromedriver
require("chromedriver");
let swd = require("selenium-webdriver");
let fs = require("fs");
let credentialsFile = process.argv[2];
let questionsFile = process.argv[3];
// build browser
let bldr = new swd.Builder();
let driver = bldr.forBrowser("chrome").build();
// username,pwd
console.log("Before");
(async function () {
    try {

        await loginHelper();
        console.log("User loggedin");
        let profileTab = await driver.findElement(swd.By.css("a[data-analytics='NavBarProfileDropDown']"));
        await profileTab.click();
        let adminBtn = await driver.findElement(swd.By.css("a[data-analytics='NavBarProfileDropDownAdministration']"));
        await adminBtn.click();
        // let manageTabs = await driver.findElements(swd.By.css(".administration ul li a"));
        // await manageTabs[1].click();

        // let challengePageLink = await driver.getCurrentUrl();

//        console.log(challengePageLink);
        // get data
        let challenges = require(questionsFile);
        // loop => serially => create challenge
        // for (let i = 0; i < challenges.length; i++) {
        // }
        let challengePageLink="https://www.hackerrank.com/administration/challenges"
        await driver.get("https://www.hackerrank.com/administration/challenges");
        //await driver.get(challengePageLink);
        for(let i=0;i<challenges.length;i++){
            await waitforloader();
        await createChallenge(challenges[i], challengePageLink);
        }
        await driver.get(challengePageLink);
    } catch (err) {
        console.log(err.message);
    }
})();
console.log("After");
async function loginHelper() {
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    login = credentials.login;
    email = credentials.email;
    pwd = credentials.pwd;
    // go to login page
    await driver.manage().window().maximize();
    let loginPWillBeOpenedP = driver.get(login);
    // set implicit 
    await loginPWillBeOpenedP;
    await driver.manage().setTimeouts({
        implicit: 10000,
        pageLoad: 10000
    })
    let emailBox = await driver.findElement(swd.By.css("#input-1"));
    await emailBox.sendKeys(email);
    let pBox = await driver.findElement(swd.By.css("#input-2"));
    await pBox.sendKeys(pwd);
    let loginBtn = await driver.findElement(swd.By.css("button[data-analytics='LoginPassword']"));
    await loginBtn.click();

}
async function createChallenge(challenge,challengePageLink) {
    try {

        await driver.get(challengePageLink);
        await waitforloader();
        let createChallengeBtn = await driver.findElement(swd.By.css(".btn.btn-green.backbone.pull-right"));
        console.log(1)
        await createChallengeBtn.click();
        let chBox = await driver.findElement(swd.By.css("#name"));
        await chBox.sendKeys(challenge["Challenge Name"])
        let DescBox = await driver.findElement(swd.By.css("#preview"));
        await DescBox.sendKeys(challenge["Description"]);
        // await (await driver).execute
        
        await driver.executeScript(
            "document.querySelector('#problem_statement-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let psBox = await driver.findElement(swd.By.css("#problem_statement-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await psBox.sendKeys(challenge["Problem Statement"]);

        await driver.executeScript(
            "document.querySelector('#input_format-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let inBpx=await driver.findElement(swd.By.css("#input_format-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await inBpx.sendKeys(challenge["Input Format"])
            
        //constraints-container
        await driver.executeScript(
            "document.querySelector('#constraints-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let conBpx=await driver.findElement(swd.By.css("#constraints-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await conBpx.sendKeys(challenge["Output Format"])


        //output_format-container
        await driver.executeScript(
            "document.querySelector('#output_format-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let otBpx=await driver.findElement(swd.By.css("#output_format-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await otBpx.sendKeys(challenge["Output Format"])
 

        
    let inputtag=await driver.findElement(swd.By.css("#tags_tag"));
    await inputtag.sendKeys(challenge["Tags"]);
    await inputtag.sendKeys(swd.Key.ENTER);
    
    
    let submitbutton= await driver.findElement(swd.By.css(".save-challenge.btn.btn-green"));
    await submitbutton.click();

    } catch (err) {
        console.log(err.message)
    }
}




async function waitforloader(){
    let loader = await driver.findElement(swd.By.css("#ajax-msg"));
    // explicit wait 
    await driver.wait(swd.until.elementIsNotVisible(loader));
}

