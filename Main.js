const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Microsoft_halo_eliteContoller = 'https://www.microsoft.com/en-us/d/xbox-elite-wireless-controller-series-2-halo-infinite-limited-edition/90z8k1dbj8zd';
const Pen = "https://www.microsoft.com/en-us/d/surface-slim-pen-2/8TB9XW8RWC14?icid=Surface_Acc_Cat_R1CP2_SlimPen2_092221&activetab=pivot%3aoverviewtab";
const bestbuy = "https://www.bestbuy.com/site/apple-iphone-13-pro-5g-128gb-sierra-blue-verizon/6443321.p?skuId=6443321"
// set up funciton
async function configureBrowser() {
    // launches browser with headless setting turned off to see whats going on
    const browser = await puppeteer.launch({headless: false});                  // start of set up
    // create page 
    const page = await browser.newPage();
    // gets rid of timeout so that big pages dont timeout before they load
    page.setDefaultNavigationTimeout(0);                                        // end of set up
    // loads url to page var and waits till DOM content is loaded to continue
    await page.goto(bestbuy, {waitUntil: 'load'});        // loads url
    console.log('page loaded')  
    // waits x amount of milliseconds to make sure everything loads
    await page.waitForTimeout(10000);                                            // wait

    return page
};

// checks for stock
async function checkStock(page) {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    // feed cheerio html
    $ = cheerio.load(html);
    // find btn container
    let btnContainer = $('#ButtonPanel_buttons > div > div.pi-overflow-ctrl')
    // find text of buy button by mapping through btn container, this is an array
    let btnText = btnContainer.contents().map(function(){
        // if the child's name is button then get the text in the span element
        if (this.name === 'button'){
            // return the text of span
            return $(this).find('span').text();
        }
    }).get();
    console.log(btnText[0]);
    // checks the first element in the btnText array and compares the string
    if(btnText[0] == 'Out of stock'){
        console.log('product is out of stock');
    }
    else{
        console.log('product is in stock');
    }
};

async function checkBestBuy(page) {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    $ = cheerio.load(html);
    let btnContainer = $('#fulfillment-add-to-cart-button-86865987 > div')
    let btnText = btnContainer.contents().map(function(){
        if(this.name == 'button'){
            console.log($(this).textContent);
            return $(this)
        }
    }).get();
    console.log(btnText.textContent);
    if(btnText[0] == 'Out of stock'){
        console.log('product is out of stock')
    }
    else{
        console.log('product is in stock')
    }
}

async function monitor() {
    let page = await configureBrowser();
    // await checkStock(page);
    await checkBestBuy(page);
}

monitor();