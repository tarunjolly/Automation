let puppeter=require('puppeteer');
let userinput=process.argv.slice(2);
(async function(){
    //starts the browser
    let browser=await puppeter.launch({
        headless:true,
        defaultViewport: null,
        args: ["--start-maximized"],
        //slowMo:50,
    })
    var url="https://www.covid19india.org";    
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    await tab.goto(url,{
        waitUntil:"networkidle2",
    });
   let allstatesdata= await getTableData(tab);
    console.table(allstatesdata);
   let eachstatesmoreData=[]; 
   for(let i=0;i<userinput.length;i++)
   {
   let eachstates= await getEachState(tab,userinput[i]);
   await tab.goto(url,{waitUntil:"networkidle2"});
   eachstatesmoreData.push(eachstates);
   }
   console.table(eachstatesmoreData);
   await browser.close();
})();
async function getTableData(tab)
{
    await tab.waitForSelector("tbody tr td");
    //All states data
    let allStatesName=await tab.$$("tbody tr td");
    let NumericFigures=await tab.$$("tbody tr td span.total");
               //*******State Names ********/
    let StateName=[];
    for(let i=0;i<allStatesName.length;i=i+5){
    text = await tab.evaluate(function(element){
        return element.textContent
    }, allStatesName[i]);
    StateName.push(text);
    }
    /***********Each state Figures of confirmed active recovered and deceased  **************/
    let Numeric=[];
    for(let i=0;i<NumericFigures.length;i++){
        text = await tab.evaluate(function(element){
            return element.textContent
        },NumericFigures[i]);
        Numeric.push(text);
       
    }
    let arrayOfObjects=[];
    for(let i=0,j=0;i<StateName.length;i++,j=j+4)
    {   let name=StateName[i];
        let confirmed=Numeric[j];
        let active=Numeric[j+1];
        let recovered=Numeric[j+2];
        let deceased=Numeric[j+3];

        let obj={
            StateName:name,
            Confirmed:confirmed,
            Active:active,
            Recovered:recovered,
            Deceased:deceased,
        }

        arrayOfObjects.push(obj);
    }
    return arrayOfObjects;
}
async function getEachState(tab,userinput)
{
    
   await tab.waitForSelector('.title-chevron .title-icon');
   
   let titleElementArray=await tab.$$(".title-chevron .title-icon");
    let arr=[];
    let obj={};
   for(let i=0;i<titleElementArray.length;i++)
   {
        let titleans=await getText(tab,titleElementArray[i]);
        if( titleans==userinput)
        {
            await titleElementArray[i].click();
            await tab.waitForSelector('.state-last-update .state-page-link');
            await tab.click(".state-last-update .state-page-link");
            await tab.waitForSelector(".meta-item.confirmed h1");
            let confirmed=await tab.$(".meta-item.confirmed h1");
            await tab.waitForSelector(".meta-item.confirmed h1");
            let active=await tab.$(".meta-item.active h1");
            let  recovery=await tab.$('.meta-item.recovery h1');
            let mortality=await tab.$('.meta-item.mortality h1');
            let growthrate=await tab.$(".meta-item.gr h1");
            let tpm=await tab.$(".meta-item.tpm h1");

            
            let c=await getText(tab,confirmed);
            let a=await getText(tab,active);
            let r=await getText(tab,recovery);
            let m=await getText(tab,mortality);
            let g=await getText(tab,growthrate);
            let t=await getText(tab,tpm);
            
             obj={
                 State:userinput,
                Confirmed_Per_Million:c,
                Active:a,
                Recovery_Rate:r,
                Mortality_Rate:m,
                Avg_Growth_Rate:g,
                Test_Per_Million:t,
            }
            
        }
   }
   return obj;
}
async function getText(tab,element)
{
    
   let gotans=await tab.evaluate(function(element){
        return element.textContent
    },element)
    return gotans;
}