const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless : false})
    const page = await browser.newPage()
    await page.goto('https://gall.dcinside.com/mgallery/board/write/?id=blooddonation')

    const sid = '피플'
    const spw = 'people123'
    const subject = 'test'
    const content = 'content'
    await page.evaluate((id, pw, sub) => {
        document.querySelector('#name').value = id
        document.querySelector('#password').value = pw
        document.querySelector('#subject').value = sub
        
    }, sid, spw, subject);
    
    await page.evaluate((cont) => {

        const iframe = document.getElementById("tx_canvas_wysiwyg");

        // grab iframe's document object
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const iframeP = iframeDoc.querySelector('.tx-content-container');

        iframeP.innerHTML = '123123'
    }, content);
    await page.click('[data-no="0"]')
    await page.click('button[class="btn_blue btn_svc write"]')
    await page.waitForNavigation()



    await browser.close()
})()
